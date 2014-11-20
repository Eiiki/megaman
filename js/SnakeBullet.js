// ===================
// SNAKEMAN BOSSY BOSS
// ===================

"use strict";

// A generic contructor which accepts an arbitrary descriptor object
function SnakeBullet(descr) {
    // Common inherited setup logic from Entity
    this.setup(descr);
    
    // Default sprite, if not otherwise specified
    this.sprite = this.sprite || g_sprites.snakeman.bullets[0];
    this.spriteArray = g_sprites.snakeman.bullets;

    // Set drawing scale
    this._scale = 2.0;
    this.width = this.sprite.width * this._scale * 0.6;
    this.height = this.sprite.height * this._scale * 1.5; 

    this.stayStillTimer = this.stayStillTime;
    this.stationaryX = this.cx; // old x

    // start going where Megaman is going! never change direction...
    if (this.cx - global.megamanX > 0) {
        this.LEFT = true;
        this.RIGHT = false;
        this.direction = 'left';
    }
    else {
        this.RIGHT = true; 
        this.LEFT = false;     
        this.direction = 'right';
    }
};

SnakeBullet.prototype = new Enemy();

SnakeBullet.prototype.type = 'snakebullet';

// "controls"
SnakeBullet.prototype.UP = false;
SnakeBullet.prototype.DOWN = false;
SnakeBullet.prototype.LEFT = false;
SnakeBullet.prototype.RIGHT = false;

SnakeBullet.prototype.stayStillTime = 1 * SECS_TO_NOMINALS;

// directions!!! down, left, up, right
SnakeBullet.prototype.direction = 'down';
SnakeBullet.prototype.hitGround = false;

// Velocity values
SnakeBullet.prototype.verticalSpeed  = 3;

// Position values
SnakeBullet.prototype.isFlipped  = false;
SnakeBullet.prototype.isFalling  = false;

SnakeBullet.prototype.health = 999; // "invulnerable to megaman shots"

// Sprite indexes
SnakeBullet.prototype.spriteRenderer = {
    bullets : {
        renderTimes : 16,
        idx : 0,
        cnt : 0
    }
};

SnakeBullet.prototype._updateSprite = function (du, oldX, oldY){
    // the s_ variables represents the sprites
    var s_moving  = this.spriteRenderer.bullets;

    var velX = this.velX,
        velY = this.velY;

    //Flip snakeman, i.e. mirror the sprite around its Y-axis
    if(velX < 0)      this.isFlipped = false;
    else if(velX > 0) this.isFlipped = true;

    //Sprite is moving
    this.sprite = this.spriteArray[s_moving.idx];
 
    //Update sprite moving
    if(s_moving.cnt >= this.spriteArray.length * s_moving.renderTimes) {
        s_moving.idx = 0;
        s_moving.cnt = 0;
    }else if(velX !== 0){
        s_moving.idx = Math.floor(s_moving.cnt / s_moving.renderTimes);
        s_moving.cnt += Math.round(du) || 1;
    }
};

SnakeBullet.prototype._computeVelocityY = function(du, oldVelY){
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

SnakeBullet.prototype.update = function (du) {
    spatialManager.unregister(this);
    if (this._isDeadNow) return entityManager.KILL_ME_NOW;

    this.decideActions(du); // AI
    
    /*console.log('this.velX ' + this.velX);
    console.log('this.velY ' + this.velY);
    console.log('this.LEFT ' + this.LEFT);
    console.log('this.RIGHT ' + this.RIGHT);
    console.log('this.UP ' + this.UP);
    console.log('this.DOWN ' + this.DOWN);
    console.log('this.dir ' + this.direction);
    console.log('this.hitGround ' + this.hitGround);
    console.log('this.x ' + this.cx);
    console.log('stationaryX ' + this.stationaryX);*/

    var oldX = this.cx,
        oldY = this.cy;

    // Perform movement substeps
    var steps = this.numSubSteps;
    var dStep = du / steps;
    for (var i = 0; i < steps; ++i) {
        this.computeSubStep(dStep);
    }

    this.stationaryX = this.cx; 

    // handle DEATH, kind of hack. They only die if they go above certain y coords
    // thats when they are at ceiling of snake mans cavern
    if (this.cy < 100) {
        entityManager.generateEnemy('explosion', {
            cx : this.cx,
            cy : this.cy
        });
        this.kill();
    }

    spatialManager.register(this);

    //Update the sprite
    this._updateSprite(du, oldX, oldY);
};

SnakeBullet.prototype.updatePosition = function (du) {
    // setti inn fastar tölur hér þar sem breytilega stærðin var
    // að fokka upp collision detectioninu á óútreiknanlegan hátt
    var spriteHalfWidth  = this.width/2,
        spriteHalfHeight = this.height/2;
    var oldVelX = this.velX,
        oldVelY = this.velY;

    if (this.hitGround) {
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

            // airbourne
            this.changeDirectionAir();
        }
        // if you get a right top or left top collision, jump, because you prob hit an obstacle
        if (isColliding[0] === 1 || isColliding[1] === 1) {
            // horizontal collision
        }
    }

    //HORIZONTAL POSITION UPDATE
    //
    if (!this.hitGround) this._computeVelocityY(du, oldVelY);
    if (this.hitGround) this.velY = this.computeThrustY();
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
        this.cy = Map.getYPosition(this.cy, this.height * 1.02);
        this.velY = 0;
        this.isFalling = false;

        if (!this.hitGround) {
            this.hitGround = true;
        }
    }else if(!this.isFalling && this.velY <= 0){
        //Starts falling down
        this.velY = -0.5;
        this.isFalling = true;
    }
    if ((ltColl === 1 || rtColl === 1) && this.velY >= 0){
        //The entity jumps up and collides its head with a tile
        this.velY = -0.5;
    }
};

// if were going LEFT and stop touching ground with dir up, we should go left
// if were going LEFT and stop touching ground with dir left, we should go down etc
SnakeBullet.prototype.changeDirectionAir = function() {
    if (this.LEFT) {
        if (this.direction === 'up') this.direction = 'left';
        else if (this.direction === 'left') this.direction = 'down';
        else if (this.direction === 'down') this.direction = 'left';
    }
    if (this.RIGHT) {
        if (this.direction === 'up') this.direction = 'right';
        else if (this.direction === 'right') this.direction = 'down';
        else if (this.direction === 'down') this.direction = 'right';
    }
}

SnakeBullet.prototype.changeDirectionGround = function() {
    if (this.LEFT) {
        if (this.direction === 'left') this.direction = 'up';
        else if (this.direction === 'down') this.direction = 'left';
    }
    if (this.RIGHT) {
        if (this.direction === 'right') this.direction = 'up';
        else if (this.direction === 'down') this.direction = 'right';
    }
}

SnakeBullet.prototype.computeGravity = function() {
    if (!this.hitGround) {
        return global.gravity;
    } else {
        return 0; // disable gravity when we hit ground
    }
}

/************************************************************
*                          A. I.                            *
*************************************************************/
SnakeBullet.prototype.decideActions = function(du) {
    switch (this.direction) {
        case 'up':
            this.UP = true;
            this.DOWN = false;
            break;
        case 'down':
            this.DOWN = true;
            this.UP = false;
            break;
    }

    // change direction if we've been in same spot too long
    // update old X
    if (Math.abs(this.stationaryX - this.cx) < 10) {
        this.stayStillTimer -= du;
        if (this.stayStillTimer <= 0) {
            this.changeDirectionGround();
            this.stayStillTimer = this.stayStillTime;
        }
    }
};

SnakeBullet.prototype.computeThrustX = function () {
    var directionX = 0;

    if (this.RIGHT) {
        directionX += this.verticalSpeed;
    }
    if (this.LEFT) {
        directionX -= this.verticalSpeed;
    }
    return directionX;
};

SnakeBullet.prototype.computeThrustY = function () {
    var directionY = 0;

    if (this.UP) {
        directionY += this.verticalSpeed;
    }
    if (this.DOWN) {
        directionY -= this.verticalSpeed;
    }
    return directionY;
};

SnakeBullet.prototype.render = function (ctx) {
    var origScale = this.sprite.scale;
    this.sprite.scale = this._scale;

    var rot = util.dirToRad(this.direction, this.LEFT);
    this.sprite.drawWrappedCentredAt(
       ctx, this.cx, this.cy, this.isFlipped, false, rot
    );

    this.sprite.scale = origScale;
};