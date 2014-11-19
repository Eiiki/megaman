// ==========
// DADA STUFF
// ==========

"use strict";

// A generic contructor which accepts an arbitrary descriptor object
function Bubukan_stick(descr) {
    // Common inherited setup logic from Entity
    this.setup(descr);
    
    // Default sprite, if not otherwise specified
    this.sprite = this.sprite || g_sprites.bubukan.stick;
    
    // Set drawing scale
    this._scale = 1.7;
    this.width = this.sprite.width * this._scale;
    this.height = this.sprite.height * this._scale;
};

Bubukan_stick.prototype = new Enemy();

Bubukan_stick.prototype.type = 'bubukan_stick';
Bubukan_stick.prototype.lifeTime = 0.55 * SECS_TO_NOMINALS;

// "controls"
// no controls... simply falls to ground and explodes

// Position values
Bubukan_stick.prototype.isFalling  = false;

Bubukan_stick.prototype.health = 999; // "invulnerable", dies when hits ground

// go slower for realistic aesthetics and so we don't go out of bounds
Bubukan_stick.prototype.computeGravity = function() {
    return global.gravity*0.3;
};

Bubukan_stick.prototype._computeVelocityY = function(du, oldVelY){
    var accelY = this.computeGravity();

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

Bubukan_stick.prototype.update = function (du) {

    spatialManager.unregister(this);
    if (this._isDeadNow) return entityManager.KILL_ME_NOW;

    this.lifeTime -= du;
    
    var oldX = this.cx,
        oldY = this.cy;

    // Perform movement substeps
    var steps = this.numSubSteps;
    var dStep = du / steps;
    for (var i = 0; i < steps; ++i) {
        this.computeSubStep(dStep);
    }

    if (this.lifeTime <= 0) {
        this.kill();
    }

    spatialManager.register(this);
};

Bubukan_stick.prototype.updatePosition = function (du) {
    // setti inn fastar tölur hér þar sem breytilega stærðin var
    // að fokka upp collision detectioninu á óútreiknanlegan hátt
    var spriteHalfWidth  = this.width/2,
        spriteHalfHeight = this.height/2;
    var oldVelX = this.velX,
        oldVelY = this.velY;

    //HORIZONTAL POSITION UPDATE
    //
    this._computeVelocityY(du, oldVelY);
    this.cy -= du * this.velY;

    /*
        * collisions[0] represents the value of the LEFT  TOP    tile that the megaman colides with -> ltColl
        * collisions[1] represents the value of the RIGHT TOP    tile that the megaman colides with -> rtColl
        * collisions[2] represents the value of the RIGHT BOTTOM tile that the megaman colides with -> rbColl
        * collisions[3] represents the value of the LEFT  BOTTOM tile that the megaman colides with -> lbColl
    */
    var collisions = Map.cornerCollisions(this.cx, this.cy, this.width, this.height);
    var ltColl = collisions[0], rtColl = collisions[1], rbColl = collisions[2], lbColl = collisions[3];

    if(lbColl === 1 || lbColl === 3 || rbColl === 1 || rbColl === 3) {
        // DISABLE GROUND COLLISION WARNING COULD BE DANGEROUS
        //Check whether the entity is colliding with the ground of the map
        //this.cy = Map.getYPosition(this.cy, this.height);
        //this.velY = 0;
        //this.isFalling = false;

        //this.health = 0; // if we hit the ground, kill us with an explosion
    }else if(this.isFalling && this.velY <= 0){
        //Starts falling down
        this.velY = -0.5;
        this.isFalling = true;
    }
    if ((ltColl === 1 || rtColl === 1) && this.velY >= 0){
        //The entity jumps up and collides its head with a tile
        this.velY = -0.5;
    }
};

/************************************************************
*                          A. I.                            *
*************************************************************/
/*Bubukan_stick.prototype.decideActions = function(du) {

};*/
