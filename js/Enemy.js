// =====
// ENEMY
// =====

// enemies inherit from Entity and consitute stuff that's not Megaman
// and has certain things in common

"use strict";

function Enemy() {

};

Enemy.prototype = new Entity();

// Values for rendering
Enemy.prototype.numSubSteps = 1;

// Velocity values
Enemy.prototype.verticalSpeed  = 3;

// misc
Enemy.prototype.health = 1;
Enemy.prototype.type = 'enemy';

Enemy.prototype.updatePosition = function (du) {
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
    
    // tjékkar á láréttu collission við umhverfi
    var isColliding = Map.cornerCollisions(nextX, this.cy, this.width, this.height);
    if (isColliding[0] !== 1 && isColliding[3] !== 1 && isColliding[1] !== 1 && isColliding[2] !== 1){
        this.cx = Math.max(spriteHalfWidth, nextX);
    }

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
        //Check whether the entity is colliding with the ground of the map
        this.cy = Map.getYPosition(this.cy, this.height);
        this.velY = 0;
        this.isFalling = false;
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

Enemy.prototype.takeBulletHit = function() {
    this.health -= 1;
};

Enemy.prototype.computeSubStep = function (du) {
    this.updatePosition(du);   
};

Enemy.prototype.computeGravity = function () {
    return global.gravity;
};

Enemy.prototype.getRadius = function () {
    return (Math.max(this.sprite.width, this.sprite.height) / 2) * this._scale;
};

Enemy.prototype.halt = function () {
    this.velX = 0;
    this.velY = 0;
};

Enemy.prototype.render = function (ctx) {
    var origScale = this.sprite.scale;
    this.sprite.scale = this._scale;

    this.sprite.drawWrappedCentredAt(
       ctx, this.cx, this.cy, this.isFlipped
    );
    this.sprite.scale = origScale;
};