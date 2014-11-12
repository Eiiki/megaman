// ==========
// SHIP STUFF
// ==========

"use strict";

// A generic contructor which accepts an arbitrary descriptor object
function Megaman(descr) {
    // Common inherited setup logic from Entity
    this.setup(descr);
    
    // Default sprite, if not otherwise specified
    this.sprite = this.sprite || g_sprites.megaman_still;
    
    // Set drawing scale
    this._scale = 2.2;
    this.width = global.megamanWidth;
    this.height = global.megamanHeight;

    this._climbSpeed = 2.5;
    this._verticalSpeed = 4;
    this._initialJumpSpeed = 12;

    this._isFiringBullet = false;
    this._hasJumped = false;
};

Megaman.prototype = new Entity();

Megaman.prototype.KEY_UP  = 38;//'up'.charCodeAt(0);
Megaman.prototype.KEY_DOWN = 40;//'down'.charCodeAt(0);
Megaman.prototype.KEY_LEFT   = 37;//'left'.charCodeAt(0);
Megaman.prototype.KEY_RIGHT  = 39;//'right'.charCodeAt(0);

Megaman.prototype.KEY_JUMP  = 'S'.charCodeAt(0);
Megaman.prototype.KEY_FIRE   = 'A'.charCodeAt(0);

// Initial, inheritable, default values
Megaman.prototype.launchVel = 2;
Megaman.prototype.numSubSteps = 1;

Megaman.prototype.isFlipped = false;
Megaman.prototype.isFalling = false;
Megaman.prototype.isClimbing = false;

Megaman.prototype.jumpSound ="sounds/megaman_jump.wav";
Megaman.prototype.fireSound = "sounds/megaman_fire_bullet.wav";


/*
var climbingSpriteIdx = 0;

Megaman.prototype._updateSprite = function(oldVelX, oldVelY){
    var velX = this.velX,
        velY = this.velY;
    var framesPerSprite = 8;

    //Mirror the sprite around its Y-axis
    if(velX < 0)      this.isFlipped = true;
    else if(velX > 0) this.isFlipped = false;

    if(oldVelX === 0) g_runningSprite = 0;
    if(this._isFiringBullet){
        g_hasShotBullet = true;
        g_bulletSpriteCnt++;
    }

    if(this.isClimbing) {
        this.sprite = g_sprites.megaman_climbing[climbingSpriteIdx];
    }else if(velY !== 0){
        //Sprite is jumping, either firingor not
        this.sprite = g_hasShotBullet && g_hasShotBullet ? 
        g_sprites.megaman_fire.jumping : g_sprites.megaman_jump;
    }else{
        if(velX === 0){
            //Sprite is still, either firing or not
            this.sprite = g_hasShotBullet && g_hasShotBullet ? 
            g_sprites.megaman_fire.still : g_sprites.megaman_still;
        }
        else{
            //Sprite is running, either firing or not
            var runningSpriteIdx = Math.floor(g_runningSprite++ / framesPerSprite);

            this.sprite = g_hasShotBullet && g_hasShotBullet ? 
            g_sprites.megaman_fire.running[runningSpriteIdx] : g_sprites.megaman_running[runningSpriteIdx];
        }
    }

    if(g_runningSprite >= g_sprites.megaman_running.length * framesPerSprite) g_runningSprite = 0;

    if(g_hasShotBullet && g_bulletSpriteCnt < 20){
        g_bulletSpriteCnt++;
    }else{
        g_bulletSpriteCnt = 0;
        g_hasShotBullet = false;
    }
};
*/

var g_runningSprite = 0;
var g_bulletSpriteCnt = 0;
var g_hasShotBullet = false;
var g_climbingSpriteIdx = 0;

Megaman.prototype._updateSprite = function(oldVelX, oldVelY){
    var velX = this.velX,
        velY = this.velY;
    var framesPerSprite = 8;

    //Mirror the sprite around its Y-axis
    if(velX < 0)      this.isFlipped = true;
    else if(velX > 0) this.isFlipped = false;

    if(oldVelX === 0) g_runningSprite = 0;
    if(this._isFiringBullet){
        g_hasShotBullet = true;
        g_bulletSpriteCnt++;
    }

    if(this.isClimbing) {
        this.sprite = g_sprites.megaman_climbing[Math.floor(g_climbingSpriteIdx/10)];
    }else if(velY !== 0){
        //Sprite is jumping, either firingor not
        this.sprite = g_hasShotBullet && g_hasShotBullet ? 
        g_sprites.megaman_fire.jumping : g_sprites.megaman_jump;
    }else{
        if(velX === 0){
            //Sprite is still, either firing or not
            this.sprite = g_hasShotBullet && g_hasShotBullet ? 
            g_sprites.megaman_fire.still : g_sprites.megaman_still;
        }
        else{
            //Sprite is running, either firing or not
            var runningSpriteIdx = Math.floor(g_runningSprite++ / framesPerSprite);

            this.sprite = g_hasShotBullet && g_hasShotBullet ? 
            g_sprites.megaman_fire.running[runningSpriteIdx] : g_sprites.megaman_running[runningSpriteIdx];
        }
    }

    if(g_runningSprite >= g_sprites.megaman_running.length * framesPerSprite) g_runningSprite = 0;

    if(g_hasShotBullet && g_bulletSpriteCnt < 20){
        g_bulletSpriteCnt++;
    }else{
        g_bulletSpriteCnt = 0;
        g_hasShotBullet = false;
    }

};

Megaman.prototype.update = function (du) {

    spatialManager.unregister(this);
    if(this._isDeadNow) return spatialManager.KILL_ME_NOW;
    
    var oldVelX = this.velX,
        oldVelY = this.velY;
    // Perform movement substeps
    var steps = this.numSubSteps;
    var dStep = du / steps;
    for (var i = 0; i < steps; ++i) {
        this.computeSubStep(dStep);
    }

    // Handle firing
    this.maybeFireBullet();

    spatialManager.register(this);
    //Update the sprite
    this._updateSprite(oldVelX, oldVelY);
    //call this for now to run the entityManager.deferredSetup over and over
    if(!this.isColliding()){
        spatialManager.register(this);
    }
};

Megaman.prototype.computeSubStep = function (du) {
    this.updatePosition(du);   
};

var NOMINAL_GRAVITY = 0.7;
Megaman.prototype.computeGravity = function () {
    return NOMINAL_GRAVITY;
};

Megaman.prototype.computeThrustX = function () {
    var directionX = 0;

    if (keys[this.KEY_RIGHT]) {
        directionX += this._verticalSpeed;
    }
    if (keys[this.KEY_LEFT]) {
        directionX -= this._verticalSpeed;
    }
    return directionX;
};

Megaman.prototype.computeThrustY = function() {
    var directionY = 0;

    if (keys[this.KEY_UP]) {
        directionY -= this._climbSpeed;
    }
    if (keys[this.KEY_DOWN]) {
        directionY += this._climbSpeed;
    }
    return directionY;
}

var g_goUpLevel = false;
var g_goDownLevel = false;

Megaman.prototype.updatePosition = function (du) {
    
    // setti inn fastar tölur hér þar sem breytilega stærðin var
    // að fokka upp collision detectioninu á óútreiknanlegan hátt

    // þarf að hreinsa upp collisionið og setja upp í sér class sem
    // megaman og vondir kallar sem collida við background erfa frá
    //    #ThirdWeekProblems 
    var spriteHalfWidth  = global.megamanWidth/2,
        spriteHalfHeight = global.megamanHeight/2;
    var oldVelX = this.velX,
        oldVelY = this.velY;
    var accelY = this.computeGravity();

    //VERTICAL POSITION UODATE
    //
    this.velX = this.computeThrustX();
    var nextX = this.cx + this.velX * du;
    
    var flipped = this.isFlipped ? -1 : 1;
    var xAdjusted = flipped * spriteHalfWidth + nextX;
    
    // tjékkar á láréttu collission við umhverfi
    var topXAdjusted    = Map.isColliding(xAdjusted, this.cy - spriteHalfHeight + 5),
        bottomXAdjusted = Map.isColliding(xAdjusted, this.cy + spriteHalfHeight - 5);
    if (topXAdjusted !== 1 && bottomXAdjusted !== 1){
        this.cx = Math.max(spriteHalfWidth, nextX);
    }

    //HORIZONTAL POSITION UPDATE
    //
    /************************************************************
    * keyUpKeys[keyCode] is true if and only if a given key with 
      keycode keyCode has been pushed down and released again
    *************************************************************/
    if(!this.isClimbing){
        if(keyUpKeys[this.KEY_JUMP]){
            //So the megaman can jump low and high in the air
            if (this._hasJumped && this.velY > 0) this.velY -= 0.6*this.velY;
            this._hasJumped = false;
        }

        if(oldVelY === 0 && keys[this.KEY_JUMP] && !this._hasJumped){
            //The character is on the ground and starts to jump
            this.velY = this._initialJumpSpeed;
            this._hasJumped = true;
        }
        if(oldVelY !== 0){
            if(util.almostEqual(oldVelY, 0)){
                //The character starts falling towards the earth again
                this.velY = -0.5;
            }else{
                //The character travels up or towards the ground
                this.velY -= accelY * du;
            }
        }
    }

    this.cy -= du * this.velY;
    //Check wether any of the corner edges of the megaman intersects with the stairs
    var rightTopCollision  = Map.isColliding(this.cx + spriteHalfWidth, this.cy - spriteHalfHeight),
        leftTopCollision = Map.isColliding(this.cx - spriteHalfWidth, this.cy - spriteHalfHeight);
    var rightBottomCollision = Map.isColliding(this.cx + spriteHalfWidth, this.cy + spriteHalfHeight),
        leftBottomCollision  = Map.isColliding(this.cx - spriteHalfWidth, this.cy + spriteHalfHeight);

    var top_bottom_collides = Math.max(rightTopCollision, leftTopCollision, rightBottomCollision, leftBottomCollision),
        left_right_collides = Math.max(topXAdjusted, bottomXAdjusted);

    // isClimbing is true iff. the megaman collides with the stair
    if (Math.max(leftBottomCollision, rightBottomCollision) === 3 && keys[this.KEY_UP] && !this.isClimbing) {
        // this is only the case where he's standing on top of a stair and to make sure he can't "go up on it"
        this.isClimbing = false;
    } else {
        this.isClimbing = (Math.max(top_bottom_collides, left_right_collides) === 2 ||
                           Math.max(top_bottom_collides, left_right_collides) === 3) && 
                           (keys[this.KEY_UP] || keys[this.KEY_DOWN] || this.isClimbing);
    }

    if(this.isClimbing){
        this.isFalling = false;
        this.velY = 0;
        var oldY = this.cy;
        this.cy += this.computeThrustY()*du;
        if(oldY !== this.cy){
            g_climbingSpriteIdx++;
            g_climbingSpriteIdx = g_climbingSpriteIdx >= g_sprites.megaman_climbing.length*10 ? 0 : g_climbingSpriteIdx;
        }
    }else{
        if ((rightTopCollision === 1 || leftTopCollision === 1) && this.velY >= 0){
            //The megaman jumps up and collides its head with a tile
            this.velY = -0.5;
        }
        if(rightBottomCollision === 1 || leftBottomCollision === 1 || 
           rightBottomCollision === 3 || leftBottomCollision === 3) {
            //Check wether the megaman is colliding with the ground of the map
            this.cy = Map.getYPosition(this.cy);
            this.velY = 0;
            this.isFalling = false;
        }else if(!this.isFalling && this.velY <= 0){
            //Starts falling down
            this.velY = -0.5;
            this.isFalling = true;
        }
        if(oldVelY < 0 && this.velY === 0) audioManager.play(this.jumpSound);
    }
    global.megamanX = this.cx;
    global.megamanY = this.cy;
    if (this.cy < global.camY && global.camY > global.mapHeight) global.camY -= 480;
    if (this.cy > global.camY + 480) global.camY += 480;
};

//Fires one bullet after each keypress.
/*
* keyUpKeys[keyCode] is true if and only if a given key with 
  keycode keyCode has been pushed down and released again
*/
Megaman.prototype.maybeFireBullet = function () {
    if(keyUpKeys[this.KEY_FIRE]) this._isFiringBullet = false;

    if (keys[this.KEY_FIRE] && !this._isFiringBullet && !this.isClimbing) {
        var velY = 0,
            velX = this.isFlipped ? -10 : 10;

        entityManager.fireBullet(
           this.cx, this.cy, velX, velY);
        audioManager.play(this.fireSound);

        this._isFiringBullet = true;
    }
};

Megaman.prototype.getRadius = function () {
    return (Math.max(this.sprite.width, this.sprite.height) / 2) * this._scale;
};

Megaman.prototype.halt = function () {
    this.velX = 0;
    this.velY = 0;
};

Megaman.prototype.render = function (ctx) {
    var origScale = this.sprite.scale;
    this.sprite.scale = this._scale;

    this.sprite.drawWrappedCentredAt(
	   ctx, this.cx, this.cy, this.isFlipped
    );
    this.sprite.scale = origScale;
};
