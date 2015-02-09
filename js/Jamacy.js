// ==========
// DADA STUFF
// ==========

"use strict";

// A generic contructor which accepts an arbitrary descriptor object
function Jamacy(descr) {
    // Common inherited setup logic from Entity
    this.setup(descr);
    
    // Default sprite, if not otherwise specified
    this.sprite = this.sprite || g_sprites.jamacy[0];
    this.spriteArray = g_sprites.jamacy;
    
    // Set drawing scale
    this._scale = 2;
    this.width = this.sprite.width * this._scale;
    this.height = this.sprite.height * this._scale;

    this.switchTime = this.switchTimer;
};

Jamacy.prototype = new Enemy();

Jamacy.prototype.type = 'jamacy';

// "controls"
Jamacy.prototype.UP = false;
Jamacy.prototype.DOWN = true;
Jamacy.prototype.switchTimer = 1.3*SECS_TO_NOMINALS;

// Position values
Jamacy.prototype.verticalSpeed = 2;

// Sprite indexes
Jamacy.prototype.spriteRenderer = {
    moving : {
        renderTimes : 8,
        idx : 0,
        cnt : 0
    }
};

Jamacy.prototype._updateSprite = function (du, oldX, oldY){
    var s_moving = this.spriteRenderer.moving;

    var velX = this.velX,
        velY = this.velY;

    //Sprite is moving
    this.sprite = this.spriteArray[s_moving.idx];
 
    //Update sprite moving
    if(s_moving.cnt >= this.spriteArray.length * s_moving.renderTimes) {
        s_moving.idx = 0;
        s_moving.cnt = 0;
    }else {
        s_moving.idx = Math.floor(s_moving.cnt / s_moving.renderTimes);
        s_moving.cnt += Math.round(du) || 1;
    }
};

Jamacy.prototype.update = function (du) {
    spatialManager.unregister(this);
    if (this._isDeadNow) return entityManager.KILL_ME_NOW;

    this.switchTimer -= du;

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
    if (this.health <= 0) {
        this.onDeath(); // make bombs and goodies 
        this.kill();
    }

    spatialManager.register(this);

    this._updateSprite(du, this.cx, this.cy);
};

Jamacy.prototype.updatePosition = function (du) {
    this.cy += this.computeThrustY() * du;
};

Jamacy.prototype.computeThrustY = function () {
    var directionY = 0;

    if (this.UP) {
        directionY -= this.verticalSpeed;
    }
    if (this.DOWN) {
        directionY += this.verticalSpeed;
    }
    return directionY;
};

Jamacy.prototype.decideActions = function (du) {
    if (this.switchTimer <= 0) {
        this.UP = !this.UP;
        this.DOWN = !this.DOWN;
        this.switchTimer = this.switchTime;
    }
};

/************************************************************
*                          A. I.                            *
*************************************************************/
/*Jamacy.prototype.decideActions = function(du) {

};*/
