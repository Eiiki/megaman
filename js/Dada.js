// ==========
// DADA STUFF
// ==========

"use strict";

// A generic contructor which accepts an arbitrary descriptor object
function Dada(descr) {
    // Common inherited setup logic from Entity
    this.setup(descr);
    
    // Default sprite, if not otherwise specified
    this.sprite = this.sprite || g_sprites.dada_moving[0];
    
    // Set drawing scale
    this._scale = 0.6;
    this.width = this.sprite.width * this._scale;
    this.height = this.sprite.height * this._scale;

    this.timeSinceJump = this.minJumpTime; // counter
};

Dada.prototype = new Enemy();

Dada.prototype.type = 'dada';

// "controls"
Dada.prototype.SHORTJUMP = false;
Dada.prototype.HIGHJUMP = false;
Dada.prototype.LEFT = false;
Dada.prototype.RIGHT = false;
Dada.prototype.jumpCnt = 2;
Dada.prototype.minJumpTime = 0.1 * SECS_TO_NOMINALS;

// Velocity values
Dada.prototype.verticalSpeed  = 3;
Dada.prototype.highJumpSpeed  = 15;
Dada.prototype.shortJumpSpeed = 6;

// Position values
Dada.prototype.isFlipped  = false;
Dada.prototype.isFalling  = false;

Dada.prototype.health = 1; // dies after one megaman hit

// Sprite indexes
Dada.prototype.spriteRenderer = {
    moving : {
        renderTimes : 8,
        idx : 0,
        cnt : 0
    }
};

Dada.prototype._updateSprite = function (du, oldX, oldY){
    // the s_ variables represents the sprites
    var s_moving  = this.spriteRenderer.moving;

    var velX = this.velX,
        velY = this.velY;

    //Flip dada, i.e. mirror the sprite around its Y-axis
    if(velX < 0)      this.isFlipped = false;
    else if(velX > 0) this.isFlipped = true;

    //Sprite is moving
    this.sprite = g_sprites.dada_moving[s_moving.idx];
 
    //Update sprite moving
    if(velX === 0 || s_moving.cnt >= g_sprites.dada_moving.length * s_moving.renderTimes) {
        s_moving.idx = 0;
        s_moving.cnt = 0;
    }else if(velX !== 0){
        s_moving.idx = Math.floor(s_moving.cnt / s_moving.renderTimes);
        s_moving.cnt += Math.round(du) || 1;
    }
};

Dada.prototype._computeVelocityY = function(du, oldVelY){
    var accelY = this.computeGravity();

    if(oldVelY === 0 && this.HIGHJUMP){
        //The character is on the ground and starts to jump
        this.velY = this.highJumpSpeed;
    } else if (oldVelY === 0 && this.SHORTJUMP) {
        this.velY = this.shortJumpSpeed;
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
};

Dada.prototype.update = function (du) {

    spatialManager.unregister(this);
    if (this._isDeadNow) return entityManager.KILL_ME_NOW;

    // update time
    this.timeSinceJump -= du;

    this.decideActions(du); // AI
    
    var oldX = this.cx,
        oldY = this.cy;

    // Perform movement substeps
    var steps = this.numSubSteps;
    var dStep = du / steps;
    for (var i = 0; i < steps; ++i) {
        this.computeSubStep(dStep);
    }

    // handle collisions and stuff
    if (this.health <= 0) this.kill();

    spatialManager.register(this);

    //Update the sprite
    this._updateSprite(du, oldX, oldY);
};

/************************************************************
*                          A. I.                            *
*************************************************************/
Dada.prototype.decideActions = function(du) {
    // reset all our previous decisions
    this.SHORTJUMP = false;
    this.HIGHJUMP = false;
    this.LEFT = this.LEFT; // remember direction, only change on high jump
    this.RIGHT = this.RIGHT;

    // two short jumps and one high jump repeated
    if (this.timeSinceJump <= 0 &&
        this.velY === 0 && 
        (this.jumpCnt >= 0 && this.jumpCnt <= 1)) {
        this.SHORTJUMP = true;
        this.jumpCnt++;
        this.timeSinceJump = this.minJumpTime; // reset
    } else if (this.timeSinceJump <= 0 && 
                this.velY === 0 &&
               (this.jumpCnt === 2)) {
        this.HIGHJUMP = true;
        this.jumpCnt = 0;
        this.timeSinceJump = this.minJumpTime; // reset time counter
        // go in direction of megaman
        if (this.cx - global.megamanX > 0) {
            this.LEFT = true;
            this.RIGHT = false;
        } else {
            this.RIGHT = true;
            this.LEFT = false;
        }
    }
};

Dada.prototype.computeThrustX = function () {
    var directionX = 0;

    if (this.RIGHT) {
        directionX += this.verticalSpeed;
    }
    if (this.LEFT) {
        directionX -= this.verticalSpeed;
    }
    return directionX;
};

