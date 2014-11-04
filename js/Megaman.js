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
};

Megaman.prototype = new Entity();


Megaman.prototype.KEY_JUMP = 'W'.charCodeAt(0);
Megaman.prototype.KEY_LEFT   = 'A'.charCodeAt(0);
Megaman.prototype.KEY_RIGHT  = 'D'.charCodeAt(0);

Megaman.prototype.KEY_FIRE   = ' '.charCodeAt(0);

// Initial, inheritable, default values
Megaman.prototype.launchVel = 2;
Megaman.prototype.numSubSteps = 1;

Megaman.prototype.jumpSound = new Audio(
    "sounds/megaman_jump.wav");

var g_runningSprite = 0;
var g_hasShotBullet = 0;
Megaman.prototype._updateSprite = function(oldVelX, oldVelY){
    var velX = this.velX,
        velY = this.velY;

    var framesPerSprite = 8;
    //Mirror the sprite around its Y-axis
    if(velX < 0)     g_megamanFlipSprite = true;
    else if(velX > 0) g_megamanFlipSprite = false;

    if(oldVelX === 0) g_runningSprite = 0;

    if(velY !== 0){
        if(this._isFiringBullet){
            this.sprite = g_sprites.megaman_fire.jumping;
            g_hasShotBullet++;
        }
        else
            this.sprite = g_sprites.megaman_jump;
    }else{
        if(velX === 0){
            if(this._isFiringBullet){
                this.sprite = g_sprites.megaman_fire.still;
                g_hasShotBullet++;
            }else{
                this.sprite = g_sprites.megaman_still;
            }
        }
        else{
            if(this._isFiringBullet){
                this.sprite = g_sprites.megaman_fire.running[Math.floor(g_runningSprite++ / framesPerSprite)];
                g_hasShotBullet++;
            }else{
                this.sprite = g_sprites.megaman_running[Math.floor(g_runningSprite++ / framesPerSprite)];
            }
        }
    }

    if(g_runningSprite >= g_sprites.megaman_running.length * framesPerSprite)
        g_runningSprite = 0;

    if(g_hasShotBullet > 10){
        g_hasShotBullet = 0;
        this._isFiringBullet = false;
    }
};

Megaman.prototype.update = function (du) {
    
    // TODO: YOUR STUFF HERE! --- Unregister and check for death
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
    if(this.maybeFireBullet()) this._isFiringBullet = true;

    // TODO: YOUR STUFF HERE! --- Warp if isColliding, otherwise Register
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

    var halfWidth = this.sprite.width/2 * this._scale,
        halfHeight = this.sprite.height/2 * this._scale;
    var maxX = g_canvas.width  - halfWidth,
        minX = halfWidth;
    var maxY = g_canvas.height - halfHeight,
        minY = halfHeight;
    var oldVelX = this.velX,
        oldVelY = this.velY;

    this.velX = this.computeThrustX();
    this.cx = util.clampRange(this.cx + (du * this.velX), minX, maxX);

    //Compute horizontal position
    var maxVelY = this._initialJumpSpeed;
    var accelY = this.computeGravity();

    if(oldVelY === 0){
        if(keys[this.KEY_JUMP])
            this.velY = maxVelY;
        else if(this.cy < maxY - halfWidth)
            oldVelY = -0.35;
    }
    if(oldVelY !== 0){
        if(util.almostEqual(oldVelY, 0))
            //The character starts falling towards the earth again
            this.velY = -0.5;
        else
            //The character travels up or towards the ground
            this.velY -= accelY * du;
    }

    this.cy -= du * this.velY;

    if(this.cy >= maxY){
        this.velY = 0;
        this.jumpSound.pause();
        this.jumpSound.currentTime = 0;
        this.jumpSound.play();
    }

    keys[this.KEY_JUMP] = false;
    this.cy = util.clampRange(this.cy, minY, maxY);
};

Megaman.prototype.maybeFireBullet = function () {
    
    if (keys[this.KEY_FIRE]) {
        var velY = 0,
            velX = g_megamanFlipSprite ? -10 : 10;
        entityManager.fireBullet(
           this.cx, this.cy, velX, velY);
        return true;
    }
    return false;
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
    // pass my scale into the sprite, for drawing

    this.sprite.scale = this._scale;

    this.sprite.drawWrappedCentredAt(
	   ctx, this.cx, this.cy
    );
    this.sprite.scale = origScale;
};
