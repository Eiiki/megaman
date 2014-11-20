// ==========
// BOMB FLIER STUFF
// ==========

"use strict";

// A generic contructor which accepts an arbitrary descriptor object
function bomb_flier(descr) {
    // Common inherited setup logic from Entity
    this.setup(descr);
    
    // Default sprite, if not otherwise specified
    this.sprite = this.sprite || g_sprites.bomb_flier[0];
    this.spriteArray = g_sprites.bomb_flier;
    // Set drawing scale
    this._scale = 2;
    this.width = this.sprite.width * this._scale/2;
    this.height = this.sprite.height * this._scale/2;
    this.spawncy = this.cy;

    // decide initial direction, go in direction of megaman
    if (this.cx - global.megamanX > 0) this.LEFT = true;
    else this.RIGHT = true;
};

bomb_flier.prototype = new Enemy();

bomb_flier.prototype.type = 'bomb_flier';

// "controls"
bomb_flier.prototype.LEFT = true;
bomb_flier.prototype.RIGHT = false;

bomb_flier.prototype.beenHit = false; // have we been hit yet?
bomb_flier.prototype.transition = false;
bomb_flier.prototype.transformed = false;

// Velocity values
bomb_flier.prototype.verticalSpeed  = 3;

// Position values
bomb_flier.prototype.isFlipped  = false;

bomb_flier.prototype.health = 4; // dies after one megaman hit

// Sprite indexes
bomb_flier.prototype.spriteRenderer = {
    blink : {
        renderTimes : 8,
        idx : 0,
        cnt : 0
    }
};

bomb_flier.prototype._updateSprite = function (du, oldX, oldY){

    var velX = this.velX
 
    // the s_ variables represents the sprites
    var s_blink  = this.spriteRenderer.blink;

    //Sprite is blink
    this.sprite = this.spriteArray[s_blink.idx];
    //Update sprite blink
    if(!this.beenHit && s_blink.cnt >= 4 * s_blink.renderTimes) {
        s_blink.idx = 0;
        s_blink.cnt = 0;
    }else if(this.beenHit && this.transition && s_blink.idx < 4){
        s_blink.renderTimes = 6;
        s_blink.idx = 4;
        this.velX = 0;
        this.velY = 0;
        this.transition = false;
    }else if(this.beenHit && !this.transition && s_blink.cnt >= this.spriteArray.length * s_blink.renderTimes){
        this.transformed = true;
        s_blink.idx = 9;
        this.velX = -4;
    }else {
        s_blink.idx = Math.floor(s_blink.cnt / s_blink.renderTimes);
        s_blink.cnt += Math.round(du) || 1;
    }
};

bomb_flier.prototype.update = function (du) {

    spatialManager.unregister(this);
    if (this._isDeadNow) return entityManager.KILL_ME_NOW;

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

    //Update the sprite
    this._updateSprite(du, oldX, oldY);
};

bomb_flier.prototype.updatePosition = function (du) {
    // setti inn fastar tölur hér þar sem breytilega stærðin var
    // að fokka upp collision detectioninu á óútreiknanlegan hátt
    var spriteHalfWidth  = this.width/2,
        spriteHalfHeight = this.height/2;
    var oldVelX = this.velX,
        oldVelY = this.velY;

    //VERTICAL POSITION UODATE
    //
    this.velX = this.computeThrustX() * du;
    var nextX = this.cx + this.velX;
    var flipped = this.isFlipped ? -1 : 1;
    var xAdjusted = flipped * spriteHalfWidth + nextX;
    if(!this.beenHit){

        if(this.cy > this.spawncy+32)this.velY = -1.5;
        if(this.cy <= this.spawncy-32)this.velY = 1.5;
    }
    this.cy += this.velY*du;
    this.cx = nextX;
    
    //HORIZONTAL POSITION UPDATE
    //
    // doesn't move vertically
};

/************************************************************
*                          A. I.                            *
*************************************************************/
bomb_flier.prototype.decideActions = function(du) {
    
};

bomb_flier.prototype.computeThrustX = function () {
    var directionX = 0;

    if (this.RIGHT) {
        if(!this.beenHit || this.transformed){
            directionX += this.verticalSpeed;
        }
    }
    if (this.LEFT) {
        if(!this.beenHit || this.transformed){
            directionX -= this.verticalSpeed;
        }
    }
    return directionX;
};

bomb_flier.prototype.render = function (ctx) {
    var origScale = this.sprite.scale;

    this.sprite.scale = this._scale;
    this.sprite.drawWrappedCentredAt(
       ctx, this.cx, this.cy, this.isFlipped
    );
    this.sprite.scale = origScale;
};

