// ==========
// DADA STUFF
// ==========

"use strict";

// A generic contructor which accepts an arbitrary descriptor object
function Potton(descr) {
    // Common inherited setup logic from Entity
    this.setup(descr);
    
    // Default sprite, if not otherwise specified
    this.sprite = this.sprite || g_sprites.potton_copter[0];
    this.alternate_sprite = this.alternate_sprite || g_sprites.potton_ball[0];
    
    // Set drawing scale
    this._scale = 1.5;
    this._alternate_scale = 1.5; // for potton ball
    this.width = this.sprite.width * this._scale;
    this.height = this.sprite.height * this._scale;

    // decide initial direction, go in direction of megaman
    if (this.cx - global.megamanX > 0) this.LEFT = true;
    else this.RIGHT = true;
};

Potton.prototype = new Enemy();

Potton.prototype.type = 'potton';

// "controls"
Potton.prototype.DROPSHELL = false;
Potton.prototype.LEFT = false;
Potton.prototype.RIGHT = false;

Potton.prototype.shellDropped = false; // have we dropped potton ball yet?
Potton.prototype.justHitWall = false; // used to decide direction, switch if we hit wall

// Velocity values
Potton.prototype.verticalSpeed  = 3;

// Position values
Potton.prototype.isFlipped  = false;

Potton.prototype.health = 1; // dies after one megaman hit

// Sprite indexes
Potton.prototype.spriteRenderer = {
    copter : {
        renderTimes : 8,
        idx : 0,
        cnt : 0
    },
    ball : {
        renderTimes : 8,
        idx : 0,
        cnt : 0
    }
};

Potton.prototype._updateSprite = function (du, oldX, oldY){
    // the s_ variables represents the sprites
    var s_copter  = this.spriteRenderer.copter;

    var velX = this.velX,
        velY = this.velY;

    //Flip dada, i.e. mirror the sprite around its Y-axis
    if(velX < 0)      this.isFlipped = false;
    else if(velX > 0) this.isFlipped = true;

    //Sprite is moving
    this.sprite = g_sprites.potton_copter[s_copter.idx];
 
    //Update sprite moving
    if(velX === 0 || s_copter.cnt >= g_sprites.potton_copter.length * s_copter.renderTimes) {
        s_copter.idx = 0;
        s_copter.cnt = 0;
    }else if(velX !== 0){
        s_copter.idx = Math.floor(s_copter.cnt / s_copter.renderTimes);
        s_copter.cnt += Math.round(du) || 1;
    }
};

Potton.prototype.update = function (du) {

    spatialManager.unregister(this);
    if (this._isDeadNow) return entityManager.KILL_ME_NOW;

    this.decideActions(du); // AI
    
    if (this.DROPSHELL) {
        entityManager.generateEnemy('potton_ball', {
            cx : this.cx,
            cy : this.cy,
            velX : 0,
            velY : -0.5
        });
        this.DROPSHELL = false;
        this.shellDropped = true;
    }

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

Potton.prototype.updatePosition = function (du) {
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
        this.justHitWall = false;
    } else {
        this.justHitWall = true;
    }

    //HORIZONTAL POSITION UPDATE
    //
    // doesn't move vertically
};

/************************************************************
*                          A. I.                            *
*************************************************************/
Potton.prototype.decideActions = function(du) {
    if (this.justHitWall) {
        this.LEFT = !this.LEFT;
        this.RIGHT = !this.RIGHT;
    }

    // drop shell if megaman is under you +- 5 and he must be below you as well
    if (Math.abs(this.cx - global.megamanX) < 5 && global.megamanY - this.cy > 0 && !this.shellDropped) {
        this.DROPSHELL = true;
    }
};

Potton.prototype.computeThrustX = function () {
    var directionX = 0;

    if (this.RIGHT) {
        directionX += this.verticalSpeed;
    }
    if (this.LEFT) {
        directionX -= this.verticalSpeed;
    }
    return directionX;
};

Potton.prototype.render = function (ctx) {
    var origScale = this.sprite.scale;

    if (!this.shellDropped) {
        var pottonBallShift = this.sprite.height / 5;
        this.alternate_sprite.scale = this._alternate_scale;
        this.alternate_sprite.drawWrappedCentredAt(
            ctx, this.cx, this.cy + pottonBallShift, this.isFlipped
        );
    }

    this.sprite.scale = this._scale;
    this.sprite.drawWrappedCentredAt(
       ctx, this.cx, this.cy, this.isFlipped
    );
    this.sprite.scale = origScale;
};

