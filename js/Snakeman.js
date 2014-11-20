// ===================
// SNAKEMAN BOSSY BOSS
// ===================

"use strict";

// A generic contructor which accepts an arbitrary descriptor object
function Snakeman(descr) {
    // Common inherited setup logic from Entity
    this.setup(descr);
    
    // Default sprite, if not otherwise specified
    this.sprite = this.sprite || g_sprites.snakeman.cinematic[0];
    this.spriteArray = g_sprites.snakeman.cinematic;

    // Set drawing scale
    this._scale = 2.0;
    this.width = this.sprite.width * this._scale * 0.7;
    this.height = this.sprite.height * this._scale * 0.95;

    this.timeSinceJump = this.minJumpTime; // counter
    this.timeSinceSnakes = this.minTimeBetweenSnakes;
    this.blinkTimer = this.blinkTime;
    this.snakeTimer = this.snakeTime;

    // always start facing megaman
    if (this.cx - global.megamanX > 0) this.LEFT = true;
    else this.RIGHT = true;     
};

Snakeman.prototype = new Enemy();

Snakeman.prototype.type = 'snakeman';

// "controls"
Snakeman.prototype.SHORTJUMP = false;
Snakeman.prototype.HIGHJUMP = false;
Snakeman.prototype.LEFT = false;
Snakeman.prototype.RIGHT = false;
Snakeman.prototype.SUMMON_SNAKES = false;
Snakeman.prototype.minTimeBetweenSnakes = 4 * SECS_TO_NOMINALS;
Snakeman.prototype.minJumpTime = 1.0 * SECS_TO_NOMINALS;
Snakeman.prototype.blinkTime = 1 * SECS_TO_NOMINALS;
Snakeman.prototype.snakeTime = 0.5 * SECS_TO_NOMINALS;

Snakeman.prototype.cinematicTime = 5 * SECS_TO_NOMINALS;

// walking jumping highjumping cinematic
Snakeman.prototype.state = "cinematic"; // walking, jumping, highjumping/spawning snakes, and showing off (cinematic in beginning)

// Velocity values
Snakeman.prototype.verticalSpeed  = 3;
Snakeman.prototype.highJumpSpeed  = 20;
Snakeman.prototype.shortJumpSpeed = 14;

// Position values
Snakeman.prototype.isFlipped  = false;
Snakeman.prototype.isFalling  = false;

Snakeman.prototype.health = 5; // dies after 36 megaman hit
Snakeman.prototype.maxHealth = 180;

// Sprite indexes
Snakeman.prototype.spriteRenderer = {
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
    highjumping : {
        renderTimes : 24,
        idx : 0,
        cnt : 0
    },
    cinematic : {
        renderTimes : 128,
        idx : 0,
        cnt : 0
    }
};

Snakeman.prototype._updateSprite = function (du, oldX, oldY){
    // the s_ variables represents the sprites
    var s_moving  = this.spriteRenderer.walking;
    if (this.state === 'walking') {
        s_moving = this.spriteRenderer.walking;
        this.spriteArray = g_sprites.snakeman.walking;
    } else if (this.state === 'jumping') {
        s_moving = this.spriteRenderer.jumping;
        this.spriteArray = g_sprites.snakeman.jumping;
    } else if (this.state === 'highjumping') {
        s_moving = this.spriteRenderer.highjumping;
        this.spriteArray = g_sprites.snakeman.highjumping;
    } else if (this.state === 'cinematic') {
        s_moving = this.spriteRenderer.cinematic;
        this.spriteArray = g_sprites.snakeman.cinematic;
    }

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
    }else if(velX !== 0 || this.state === 'cinematic' || this.state === 'highjumping'){
        s_moving.idx = Math.floor(s_moving.cnt / s_moving.renderTimes);
        s_moving.cnt += Math.round(du) || 1;
    }
};

Snakeman.prototype._computeVelocityY = function(du, oldVelY){
    var accelY = this.computeGravity();

    // decide direction at the time of a jump following megaman
    if (this.HIGHJUMP || this.SHORTJUMP) {
        if (this.cx - global.megamanX > 0) {
            this.LEFT = true;
            this.RIGHT = false;
        }
        else {
            this.RIGHT = true;
            this.LEFT = false;
        }       
    }

    if(oldVelY === 0 && this.HIGHJUMP){
        //The character is on the ground and starts to jump
        this.velY = this.highJumpSpeed;
        this.HIGHJUMP = false;
    } else if (oldVelY === 0 && this.SHORTJUMP) {
        this.velY = this.shortJumpSpeed;
        this.SHORTJUMP = false;
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

Snakeman.prototype.update = function (du) {
    spatialManager.unregister(this);
    if (this._isDeadNow) return entityManager.KILL_ME_NOW;

    //this.debug();

    // update time
    this.timeSinceJump -= du;
    this.timeSinceSnakes -= du;
    if (this.isBlinking) {
        this.blinkTimer -= du;
        if (this.blinkTimer <= 0) {
            this.isBlinking = false;
            this.blinkTimer = this.blinkTime;
        }
    }

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
        setTimeout(function(){
            SNAKEMAN_DEAD = true;
        }, 2000);
    }

    spatialManager.register(this);

    //Update the sprite
    this._updateSprite(du, oldX, oldY);
};

Snakeman.prototype.updatePosition = function (du) {
    // setti inn fastar tölur hér þar sem breytilega stærðin var
    // að fokka upp collision detectioninu á óútreiknanlegan hátt
    var spriteHalfWidth  = this.width/2,
        spriteHalfHeight = this.height/2;
    var oldVelX = this.velX,
        oldVelY = this.velY;

    // skip update in x while in cinematic mode
    if (this.state !== 'cinematic') {
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
        // if you get a right top or left top collision, jump, because you prob hit an obstacle
        if ((isColliding[0] === 1 || isColliding[1] === 1) && this.state !== 'cinematic') {
            // horizontal collision
            if (this.timeSinceJump <= 0 && !this.HIGHJUMP) {
                this.SHORTJUMP = true; // initiate jump!
                this.state = 'jumping';
                this.timeSinceJump = this.minJumpTime;
            }
        }
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
        this.cy = Map.getYPosition(this.cy, this.height * 1.02);
        this.velY = 0;
        this.isFalling = false;

        // reset states
        if (this.state === 'jumping' || this.state === 'highjumping') {
            this.state = 'walking';
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

/************************************************************
*                          A. I.                            *
*************************************************************/
Snakeman.prototype.decideActions = function(du) {
    if (this.state === 'cinematic') {
        this.cinematicTime -= du;
        if (this.cinematicTime <= 0) {
            this.state = 'walking';
            // funs over for megaman!
            if (this.cx - global.megamanX > 0) {
                this.LEFT = true;
                this.RIGHT = false;
            }
            else {
                this.RIGHT = true; 
                this.LEFT = false;     
            }
        }
    } else if (this.state === 'walking' || this.state === 'jumping') {
        if (this.timeSinceSnakes <= 0) {
            this.HIGHJUMP = true;
            this.state = 'highjumping';
            this.timeSinceJump = this.minJumpTime;
            this.timeSinceSnakes = this.minTimeBetweenSnakes;
        }
    } else if (this.state === 'highjumping') {
        this.snakeTimer -= du;
        if (this.snakeTimer <= 0) {
            this.summonSnakes();
            //console.log("summon snakes!");
            this.snakeTimer = this.snakeTime;
            this.timeSinceSnakes = this.minTimeBetweenSnakes;
        }
    } else if (this.state === 'jumping') {
        // nothing I think
    }
    /*
    // yes... this is not. Pretty....
    var rand = Math.random();
    if (rand < 0.001 * du) {
        this.SHORTJUMP = true;
        this.state = 'jumping';
        this.timeSinceJump = this.minJumpTime;
    }*/
};

Snakeman.prototype.summonSnakes = function () {
    entityManager.generateEnemy('snakebullet', {
        cx : this.isFlipped ? this.cx - 20 : this.cx + 20,
        cy : this.cy,
        velX : 0,
        velY : -0.5
    });
    entityManager.generateEnemy('snakebullet', {
        cx : this.isFlipped ? this.cx - 20 : this.cx + 20,
        cy : this.cy,
        velX : 0,
        velY : -1.0
    });
};

Snakeman.prototype.computeThrustX = function () {
    var directionX = 0;

    if (this.RIGHT) {
        directionX += this.verticalSpeed;
    }
    if (this.LEFT) {
        directionX -= this.verticalSpeed;
    }
    return directionX;
};

Snakeman.prototype.takeBulletHit = function() {
    if (this.state !== 'cinematic') {
        this.health -= 5; // needs adjusting
        this.isBlinking = true;
    }
};

Snakeman.prototype.render = function (ctx) {
    var origScale = this.sprite.scale;
    this.sprite.scale = this._scale;

    this.sprite.drawWrappedCentredAt(
       ctx, this.cx, this.cy, this.isFlipped
    );

    if (this.isBlinking) {
        // blink controlles the rate of alternating sprites here
        // yes... probably couldve variablized the number 8 here but damn it!
        var blink = this.blinkTimer < this.blinkTime && this.blinkTimer > this.blinkTime * 7 / 8 ||
                    this.blinkTimer < this.blinkTime * 6 / 8 && this.blinkTimer > this.blinkTime * 5 / 8 ||
                    this.blinkTimer < this.blinkTime * 4 / 8 && this.blinkTimer > this.blinkTime * 3 / 8 ||
                    this.blinkTimer < this.blinkTime * 2 / 8 && this.blinkTimer > this.blinkTime * 1 / 8;
        if (blink) {
            // explosion
            var oldAlpha = ctx.globalAlpha;
            ctx.globalAlpha = 0.7;
            g_sprites.snakeman.explosion.drawWrappedCentredAt(
                ctx, this.cx, this.cy, false
            );
            ctx.globalAlpha = oldAlpha; 
        }
    }

    this.sprite.scale = origScale;

    this.drawHealth(ctx);
};

Snakeman.prototype.drawHealth = function(ctx) {
    var sprite = g_sprites.snakeman_health;
    var oldWidth = sprite.width;
    var oldHeight = sprite.height;

    var origScale = sprite.scale;
    // whoop magic numbers
    var s = sprite.scale;
    var cx = global.camX + 84; // changeable param
    var cy = global.camY + 30 + s*(sprite.height)/2;

    sprite.drawWrappedCentredAt(
        ctx, cx, cy
    );
    var healthRatio = 1 - this.health / this.maxHealth;
    if (healthRatio < 0) healthRatio = 0;
    var topLeft = [cx - s*(sprite.width)/2, cy - s*(sprite.height)/2]; // [x, y]
    // draw a black box over the health we've lost
    var oldFillStyle = ctx.fillStyle;
    ctx.fillStyle = 'black';
    ctx.fillRect(topLeft[0], topLeft[1], s*sprite.width, s*(healthRatio * sprite.height));
    ctx.fillStyle = oldFillStyle;

    sprite.scale = origScale;
    sprite.width = oldWidth;
    sprite.height = oldHeight;
};

Snakeman.prototype.debug = function() {
    console.log("STATE: " + this.state);
    console.log();
    //console.log("Sprite arrays: ");
    //console.log(this.spriteArray);
    console.log(" velX " + this.velX + " velY " + this.velY);
    console.log("CONTROLS");
    console.log("left " + this.LEFT);
    console.log("right " + this.RIGHT);
};