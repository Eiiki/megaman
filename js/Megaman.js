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
    this._scale = 2.5;

    this._verticalSpeed = 4;
    this._initialJumpSpeed = 12;

    this._isFiringBullet = false;
    this._hasJumped = false;
};

Megaman.prototype = new Entity();


Megaman.prototype.KEY_JUMP = 'W'.charCodeAt(0);
Megaman.prototype.KEY_LEFT   = 'A'.charCodeAt(0);
Megaman.prototype.KEY_RIGHT  = 'D'.charCodeAt(0);

Megaman.prototype.KEY_FIRE   = ' '.charCodeAt(0);

// Initial, inheritable, default values
Megaman.prototype.launchVel = 2;
Megaman.prototype.numSubSteps = 1;

Megaman.prototype.isFlipped = false;
Megaman.prototype.isFalling = false;

Megaman.prototype.jumpSound = new Audio(
    "sounds/megaman_jump.wav");
Megaman.prototype.fireSound = new Audio(
    "sounds/megaman_fire_bullet.wav");


var g_runningSprite = 0;
var g_bulletSpriteCnt = 0;
var g_hasShotBullet = false;
var g_megamanX;
var g_megamanY;

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

    if(velY !== 0){
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
    var direction = 0;
    
    if (keys[this.KEY_RIGHT]) {
        direction += this._verticalSpeed;
    }
    if (keys[this.KEY_LEFT]) {
        direction -= this._verticalSpeed;
    }
    return direction;
};

Megaman.prototype.updatePosition = function (du) {
    
    // setti inn fastar tölur hér þar sem breytilega stærðin var
    // að fokka upp collision detectioninu á óútreiknanlegan hátt

    // þarf að hreinsa upp collisionið og setja upp í sér class sem
    // megaman og vondir kallar sem collida við background erfa frá
    //    #ThirdWeekProblems 
    var spriteHalfWidth  = 25, //this.sprite.width/2 * this._scale,
        spriteHalfHeight = 33;//this.sprite.height/2 * this._scale;
    var maxX = g_canvas.width  - spriteHalfWidth,
        minX = spriteHalfWidth;
    var maxY = g_canvas.height - spriteHalfHeight,
        minY = spriteHalfHeight;
    var oldVelX = this.velX,
        oldVelY = this.velY;
    var accelY = this.computeGravity();
    g_megamanX = this.cx;
    g_megamanY = this.cy;

    //VERTICAL POSITION UODATE
    //
    this.velX = this.computeThrustX();
    var nextX = this.cx + this.velX * du;
    //this.cx = util.clampRange(this.cx + (du * this.velX), minX, maxX);
    
    var flipped = this.isFlipped ? -1 : 1;
    var xAdjusted = flipped * spriteHalfWidth + nextX;
    
    // tjékkar á láréttu collission við umhverfi
    if (!Map.isColliding(xAdjusted, this.cy + spriteHalfHeight - 5) &&
        !Map.isColliding(xAdjusted, this.cy - spriteHalfHeight + 5)) this.cx = nextX;

    //HORIZONTAL POSITION UPDATE
    //
    /************************************************************
    * keyUpKeys[keyCode] is true if and only if a given key with 
      keycode keyCode has been pushed down and released again
    *************************************************************/
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

    this.cy -= du * this.velY;

    //tjékkar á lóðréttu collision við umhverfi
    if ((Map.isColliding(this.cx + spriteHalfWidth, this.cy + -1 * spriteHalfHeight) ||
        Map.isColliding(this.cx - spriteHalfWidth, this.cy + -1 * spriteHalfHeight)) &&
        this.velY >= 0) this.velY = -0.5;

    if(Map.isColliding(this.cx + spriteHalfWidth, this.cy + spriteHalfHeight) ||
       Map.isColliding(this.cx - spriteHalfWidth, this.cy + spriteHalfHeight)) {
        this.cy = Map.getYPosition(this.cy);
        this.velY = 0;
        // þarf að finna betri stað fyrir þetta
        //util.playSoundNow(this.jumpSound);
        this.isFalling = false;
    } else if (!this.isFalling && this.velY <= 0){
        this.velY = -0.5;
        this.isFalling = true;
    }
    //this.cy = util.clampRange(this.cy, minY, maxY);
};

//Fires one bullet after each keypress.
/*
* keyUpKeys[keyCode] is true if and only if a given key with 
  keycode keyCode has been pushed down and released again
*/
Megaman.prototype.maybeFireBullet = function () {
    if(keyUpKeys[this.KEY_FIRE]) this._isFiringBullet = false;

    if (keys[this.KEY_FIRE] && !this._isFiringBullet) {
        var velY = 0,
            velX = this.isFlipped ? -10 : 10;

        entityManager.fireBullet(
           this.cx, this.cy, velX, velY);
        util.playSoundNow(this.fireSound, 0.2);

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
