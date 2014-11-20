// =======
// BUBUKAN
// =======

"use strict";

// A generic contructor which accepts an arbitrary descriptor object
function Bubukan(descr) {
    // Common inherited setup logic from Entity
    this.setup(descr);
    
    // Default sprite, if not otherwise specified
    this.sprite = this.sprite || g_sprites.bubukan.walking[0];
    this.sprite.drawWrappedCentredAt(g_ctx, g_canvas.width/2, g_canvas.height/2, false, false);
    this.spriteArray = g_sprites.bubukan.walking;
    
    // Set drawing scale
    this._scale = 1.5;
    this.width = this.sprite.width * this._scale;
    this.height = this.sprite.height * this._scale;

    // decide initial direction, go in direction of megaman
    if (this.cx - global.megamanX > 0) this.LEFT = true;
    else this.RIGHT = true;
};

Bubukan.prototype = new Enemy();

Bubukan.prototype.type = 'bubukan';
// bubukan starts walking, then jumps then falls, then walks again
Bubukan.prototype.state = 'walking'; // walking, jumping, falling

// "controls"
Bubukan.prototype.JUMP = false;
Bubukan.prototype.LEFT = false;
Bubukan.prototype.RIGHT = false;
Bubukan.prototype.hitGround = false; // used when he lands after jump
Bubukan.prototype.droppedStick = false;
Bubukan.prototype.justJumped = false;

// Velocity values
Bubukan.prototype.verticalSpeed  = 3;
Bubukan.prototype.jumpSpeed  = 15;

// Position values
Bubukan.prototype.isFlipped  = false;
Bubukan.prototype.isFalling  = false;

Bubukan.prototype.health = 999; // "invulnerable" until he jumps
Bubukan.prototype.timeTillFall = 0.3 * SECS_TO_NOMINALS;

// Sprite indexes
Bubukan.prototype.spriteRenderer = {
    walking : {
        renderTimes : 8,
        idx : 0,
        cnt : 0
    },
    jumping : {
        renderTimes : 12,
        idx : 0,
        cnt : 0
    },
    falling : {
        renderTimes : 8,
        idx : 0,
        cnt : 0
    }
};

Bubukan.prototype._updateSprite = function (du, oldX, oldY){
    // the s_ variables represents the sprites
    var s_moving  = this.spriteRenderer.walking;
    if (this.state === 'walking') {
        s_moving = this.spriteRenderer.walking;
        this.spriteArray = g_sprites.bubukan.walking;
    } else if (this.state === 'jumping') {
        s_moving = this.spriteRenderer.jumping;
        this.spriteArray = g_sprites.bubukan.jumping;
    } else if (this.state === 'falling') {
        s_moving = this.spriteRenderer.falling;
        this.spriteArray = g_sprites.bubukan.falling;
    }

    var velX = this.velX,
        velY = this.velY;

    //Flip bubukan, i.e. mirror the sprite around its Y-axis
    if(velX < 0)      this.isFlipped = false;
    else if(velX > 0) this.isFlipped = true;

    //Sprite is moving
    this.sprite = this.spriteArray[s_moving.idx];
 
    //Update sprite moving
    if(velX === 0 || s_moving.cnt >= this.spriteArray.length * s_moving.renderTimes) {
        s_moving.idx = 0;
        s_moving.cnt = 0;
    }else if(velX !== 0){
        s_moving.idx = Math.floor(s_moving.cnt / s_moving.renderTimes);
        s_moving.cnt += Math.round(du) || 1;
    }
};

Bubukan.prototype._computeVelocityY = function(du, oldVelY){
    var accelY = this.computeGravity();

    if(oldVelY === 0 && this.JUMP){
        //The character is on the ground and starts to jump
        this.velY = this.jumpSpeed;
        this.justJumped = true;
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

Bubukan.prototype.update = function (du) {
    spatialManager.unregister(this);
    if (this._isDeadNow) return entityManager.KILL_ME_NOW;

    if (this.state === 'jumping') this.timeTillFall -= du;

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

Bubukan.prototype.updatePosition = function (du) {
    // setti inn fastar tölur hér þar sem breytilega stærðin var
    // að fokka upp collision detectioninu á óútreiknanlegan hátt
    var spriteHalfWidth  = this.width/2,
        spriteHalfHeight = this.height/2;
    var oldVelX = this.velX,
        oldVelY = this.velY;

    //VERTICAL POSITION UPDATE
    //
    
    this.velX = this.computeThrustX() * du;
    var nextX = this.cx + this.velX;
    var flipped = this.isFlipped ? -1 : 1;
    var xAdjusted = flipped * spriteHalfWidth + nextX;

    // tjékkar á láréttu collission við umhverfi
    var isColliding = Map.cornerCollisions(nextX, this.cy, this.width, this.height);
    if (isColliding[0] !== 1 && isColliding[3] !== 1 /*&& isColliding[1] !== 1 && isColliding[2] !== 1*/){
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
        this.cy = Map.getYPosition(this.cy, this.height*1.05);
        this.velY = 0;
        this.isFalling = false;

        // hit ground after jump!
        if (this.state === 'falling' && !this.hitGround) {
            this.state = 'walking'; //AI
            this.hitGround = true;
            // do this only once
            // decide direction again after we land, go in direction of megaman
            this.LEFT = false; // reset
            this.RIGHT = false;
            if (this.cx - global.megamanX > 0) this.LEFT = true;
            else this.RIGHT = true; 
        }
    }else if(!this.isFalling && this.velY <= 0 && this.droppedStick){ // this &&this.droppedStick is a shitmix, because without it he constantly jumped
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
Bubukan.prototype.decideActions = function(du) {
    if (this.state === 'walking') {
        var dist = Math.abs(this.cx - global.megamanX);
        // jump when megaman is close
        if (dist < 150 && !this.hitGround) {
            this.state = 'jumping';
        }
        if (this.hitGround) {
            this.verticalSpeed = 5; // go faster than megaman!
        }
    } else if (this.state === 'jumping') {
        // sortof a misnomer, this is actually the leverege move before the jump
        if (this.timeTillFall <= 0) {
            this.JUMP = true;
            this.state = 'falling';
        }
    } else if (this.state === 'falling') {
        var shift = 50; // how far away should the stick start
        if (this.justJumped) {
            this.justJumped = false;
            this.JUMP = false;
        }
        if (!this.droppedStick) {
            entityManager.generateEnemy('bubukan_stick', {
                cx : this.isFlipped ? this.cx + shift : this.cx - shift,
                cy : this.cy,
                velX : 0,
                velY : 3
            });
            this.droppedStick = true;
        }
        this.health = 3;
    }
};

Bubukan.prototype.computeThrustX = function () {
    var directionX = 0;

    if (this.RIGHT) {
        directionX += this.verticalSpeed;
    }
    if (this.LEFT) {
        directionX -= this.verticalSpeed;
    }
    return directionX;
};

