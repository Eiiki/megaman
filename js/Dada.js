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
};

Dada.prototype = new Entity();

Dada.prototype.type = 'dada';

// "controls"
Dada.prototype.SHORTJUMP = false;
Dada.prototype.HIGHJUMP = false;
Dada.prototype.LEFT = false;
Dada.prototype.RIGHT = false;

// Velocity values
Dada.prototype.verticalSpeed    = 4;
Dada.prototype.highJumpSpeed = 12;
Dada.prototype.shortJumpSpeed = 6;

// Position values
Dada.prototype.isFlipped  = false;
Dada.prototype.isFalling  = false;

// Values for rendering
Dada.prototype.numSubSteps = 1;

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
    if(velX < 0)      this.isFlipped = true;
    else if(velX > 0) this.isFlipped = false;

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

    /************************************************************
    *                          A. I.                            *
    *************************************************************/
    //this.decideMovement(du);
    // reset all our previous decisions
    this.HIGHJUMP = false;
    this.SHORTJUMP = false;
    this.LEFT = false;
    this.RIGHT = false;
    //this.LEFT = true;
    //this.SHORTJUMP = true;
};

Dada.prototype.takeBulletHit = function() {
    this.health -= 1;
}

Dada.prototype.computeSubStep = function (du) {
    this.updatePosition(du);   
};

Dada.prototype.computeGravity = function () {
    return global.gravity;
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

Dada.prototype.updatePosition = function (du) {
    // setti inn fastar tölur hér þar sem breytilega stærðin var
    // að fokka upp collision detectioninu á óútreiknanlegan hátt

    // þarf að hreinsa upp collisionið og setja upp í sér class sem
    // megaman og vondir kallar sem collida við background erfa frá
    //    #ThirdWeekProblems 
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
    var topXAdjusted    = Map.isColliding(xAdjusted, this.cy - spriteHalfHeight + 5), //afhverju + 5 ?
        bottomXAdjusted = Map.isColliding(xAdjusted, this.cy + spriteHalfHeight - 5); //afhverju - 5 ?
    if (topXAdjusted !== 1 && bottomXAdjusted !== 1){
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

    if ((ltColl === 1 || rtColl === 1) && this.velY >= 0){
        //The entity jumps up and collides its head with a tile
        this.velY = -0.5;
    }
    if(lbColl === 1 || lbColl === 3 || rbColl === 1 || rbColl === 3) {
        //Check whether the entity is colliding with the ground of the map
        this.cy = Map.getYPosition(this.cy, this.height);
        this.velY = 0;
        this.isFalling = false;
    }else if(!this.isFalling && this.velY <= 0){
        //Starts falling down
        this.velY = -0.5;
        this.isFalling = true;
    }
};

Dada.prototype.getRadius = function () {
    return (Math.max(this.sprite.width, this.sprite.height) / 2) * this._scale;
};

Dada.prototype.halt = function () {
    this.velX = 0;
    this.velY = 0;
};

Dada.prototype.render = function (ctx) {
    var origScale = this.sprite.scale;
    this.sprite.scale = this._scale;

    this.sprite.drawWrappedCentredAt(
       ctx, this.cx, this.cy, this.isFlipped
    );
    this.sprite.scale = origScale;
};
