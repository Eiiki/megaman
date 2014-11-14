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

    this._isFiringBullet = false;
    this._hasJumped = false;

    // just for display purposes start with half health for now ONLY 
    this._health = this.maxHealth / 2; //this.maxHealth
};

Megaman.prototype = new Entity();

Megaman.prototype.KEY_UP    = 38;
Megaman.prototype.KEY_DOWN  = 40;
Megaman.prototype.KEY_LEFT  = 37;
Megaman.prototype.KEY_RIGHT = 39;

Megaman.prototype.KEY_JUMP = 'S'.charCodeAt(0);
Megaman.prototype.KEY_FIRE = 'A'.charCodeAt(0);

// Initial, inheritable, default values
Megaman.prototype.verticalSpeed = 4;
Megaman.prototype.initialJumpSpeed = 12;
Megaman.prototype.climbSpeed = 2.5;
Megaman.prototype.numSubSteps = 1;
Megaman.prototype.nextCamY = global.camY;

Megaman.prototype.isFlipped = false;
Megaman.prototype.isFalling = false;
Megaman.prototype.isClimbing = false;

Megaman.prototype.jumpSound = "sounds/megaman_jump.wav";
Megaman.prototype.fireSound = "sounds/megaman_fire_bullet.wav";

Megaman.prototype.maxHealth = 100;


var g_runningSprite = 0;
var g_bulletSpriteCnt = 0;
var g_hasShotBullet = false;
var g_climbingSpriteIdx = 0;

Megaman.prototype._updateSprite = function(oldVelX, oldVelY){
    var velX = this.velX,
        velY = this.velY;
    var framesPerSprite = 8;

    //Flip megaman, i.e. mirror the sprite around its Y-axis
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
        this.sprite = g_hasShotBullet ? 
            g_sprites.megaman_fire.jumping : g_sprites.megaman_jump;
    }else{
        if(velX === 0){
            //Sprite is still, either firing or not
            this.sprite = g_hasShotBullet ? 
                g_sprites.megaman_fire.still : g_sprites.megaman_still;
        }
        else{
            //Sprite is running, either firing or not
            var runningSpriteIdx = Math.floor(g_runningSprite++ / framesPerSprite);

            this.sprite = g_hasShotBullet ? 
                g_sprites.megaman_fire.running[runningSpriteIdx] : g_sprites.megaman_running[runningSpriteIdx];
        }
    }

    if(g_runningSprite >= g_sprites.megaman_running.length * framesPerSprite) g_runningSprite = 0;

    if(g_hasShotBullet && g_bulletSpriteCnt < 20){
        g_bulletSpriteCnt++;
    }else if(g_hasShotBullet && g_hasShotBullet){
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

    // move camera when megaman transisiton between levels of the map
    if (this.cy < global.camY && global.camY > global.mapHeight){
        this.nextCamY -= 480;
        global.mapPart++;
    } 
    if (this.cy > global.camY + 480 && !global.fellOffEdge) {
        this.nextCamY += 480;
        global.mapPart--;
    }
    
    if(global.camY > this.nextCamY){
        global.camY -= global.transitionSpeed;
        global.isTransitioning = true;
    } else if(global.camY < this.nextCamY){
        global.camY += global.transitionSpeed;
        global.isTransitioning = true;
    } else if(global.isTransitioning) {
        global.isTransitioning = false;
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

Megaman.prototype.computeGravity = function () {
    return global.gravity;
};

Megaman.prototype.computeThrustX = function () {
    var directionX = 0;

    if (keys[this.KEY_RIGHT]) {
        directionX += this.verticalSpeed;
    }
    if (keys[this.KEY_LEFT]) {
        directionX -= this.verticalSpeed;
    }
    return directionX;
};

Megaman.prototype.computeThrustY = function() {
    var directionY = 0;

    if (keys[this.KEY_UP]) {
        directionY -= this.climbSpeed;
    }
    if (keys[this.KEY_DOWN]) {
        directionY += this.climbSpeed;
    }
    if(global.isTransitioning) return directionY/2;
    return directionY;
}

Megaman.prototype.updatePosition = function (du) {
    
    // setti inn fastar tölur hér þar sem breytilega stærðin var
    // að fokka upp collision detectioninu á óútreiknanlegan hátt

    // þarf að hreinsa upp collisionið og setja upp í sér class sem
    // megaman og vondir kallar sem collida við background erfa frá
    //    #ThirdWeekProblems 
    var spriteHalfWidth  = this.width/2,
        spriteHalfHeight = this.height/2;
    var oldVelX = this.velX,
        oldVelY = this.velY;
    var accelY = this.computeGravity();

    //VERTICAL POSITION UODATE
    //
    this.velX = this.computeThrustX();
    var nextX = this.isClimbing ? this.cx : this.cx + this.velX * du;
    
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
            this.velY = this.initialJumpSpeed;
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
    
    // if megaman is climbing and jumps he will stop climbing
    if (keys[this.KEY_JUMP] && this.isClimbing) this.isClimbing = false;

    this.velY = global.isTransitioning ? this.velY/2 : this.velY;
    this.cy -= du * this.velY;


    //Check wether any of the corner edges of the megaman intersects with the stairs
    var rightTopCollision  = Map.isColliding(this.cx + spriteHalfWidth, this.cy - spriteHalfHeight),
        leftTopCollision = Map.isColliding(this.cx - spriteHalfWidth, this.cy - spriteHalfHeight);
    var rightBottomCollision = Map.isColliding(this.cx + spriteHalfWidth, this.cy + spriteHalfHeight),
        leftBottomCollision  = Map.isColliding(this.cx - spriteHalfWidth, this.cy + spriteHalfHeight);

    var top_bottom_collides = Math.max(rightTopCollision, leftTopCollision, rightBottomCollision, leftBottomCollision),
        left_right_collides = Math.max(topXAdjusted, bottomXAdjusted),
        right_top_bottom_collides = Math.max(rightTopCollision, rightBottomCollision),
        left_top_bottom_collides  = Math.max(leftTopCollision, leftBottomCollision);

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
        // snaps megaman to the center of the ladder he's climbing
        if (right_top_bottom_collides === 2 || right_top_bottom_collides === 3) {
            this.cx = Map.getXPosition(this.cx + spriteHalfWidth);
        }
        if (left_top_bottom_collides === 2 || left_top_bottom_collides === 3) {
            this.cx = Map.getXPosition(this.cx - spriteHalfWidth);
        }

        this.isFalling = false;
        this.velY = 0;
        var oldY = this.cy;
        this.cy += this.computeThrustY()*du;
        if(oldY !== this.cy){
            g_climbingSpriteIdx += du;
            g_climbingSpriteIdx = g_climbingSpriteIdx >= g_sprites.megaman_climbing.length*10 ? 0 : g_climbingSpriteIdx;
        }
    }else{
        if ((rightTopCollision === 1 || leftTopCollision === 1) && this.velY >= 0){
            //The megaman jumps up and collides its head with a tile
            this.velY = -0.5;
        }
        if(rightBottomCollision === 1 || leftBottomCollision === 1 || 
           rightBottomCollision === 3 || leftBottomCollision === 3) {
            //Check whether the megaman is colliding with the ground of the map
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

    // check if the camera translation system should follow megaman or not
    if (Map.isColliding(this.cx, this.cy) === null) global.fellOffEdge = true;
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

    this.drawHealth(ctx);
};

Megaman.prototype.drawHealth = function(ctx) {
    var sprite = g_sprites.megaman_health;
    var oldWidth = sprite.width;
    var oldHeight = sprite.height;

    var origScale = sprite.scale;
    // whoop magic numbers
    sprite.scale = 0.85;
    var s = sprite.scale;
    var cx = global.camX + 44;
    var cy = global.camY + 30 + s*(sprite.height)/2;

    sprite.drawWrappedCentredAt(
        ctx, cx, cy
    );
    var healthRatio = 1 - this._health / this.maxHealth;
    var topLeft = [cx - s*(sprite.width)/2, cy - s*(sprite.height)/2]; // [x, y]
    // draw a black box over the health we've lost
    var oldFillStyle = ctx.fillStyle;
    ctx.fillStyle = 'black';
    ctx.fillRect(topLeft[0], topLeft[1], s*sprite.width, s*(healthRatio * sprite.height));
    ctx.fillStyle = oldFillStyle;

    sprite.scale = origScale;
    sprite.width = oldWidth;
    sprite.height = oldHeight;
};
