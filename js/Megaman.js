// ==========
// SHIP STUFF
// ==========

"use strict";

// A generic contructor which accepts an arbitrary descriptor object
function Megaman(descr) {
    // Common inherited setup logic from Entity
    this.setup(descr);
    
    // Default sprite, if not otherwise specified
    this.sprite = this.sprite || g_sprites.megaman_still;
    
    // Set drawing scale
    this._scale = 2.2;
    this.width = global.megamanWidth;
    this.height = global.megamanHeight;

    this._isFiringBullet = false;
    this._hasJumped = false;

    this._health = this.maxHealth*20; //this.maxHealth

    this._invulnTimer = this.invulnDuration;
    g_sprites.megaman_explosion.scale = 2.2;

    // for the immobilization
    this.reset_verticalSpeed = this.verticalSpeed;
    this.reset_initialJumpSpeed = this.initialJumpSpeed;
    this.reset_climbSpeed = this.climbSpeed;

    this.fix = false;
    this.burstTimer = this.burstTime;
};

Megaman.prototype = new Entity();

// Key values
Megaman.prototype.KEY_UP    = 38;
Megaman.prototype.KEY_DOWN  = 40;
Megaman.prototype.KEY_LEFT  = 37;
Megaman.prototype.KEY_RIGHT = 39;
Megaman.prototype.KEY_SUPER = 55;
Megaman.prototype.KEY_JUMP  = 'S'.charCodeAt(0);
Megaman.prototype.KEY_FIRE  = 'A'.charCodeAt(0);

// Velocity values
Megaman.prototype.verticalSpeed      = 4;
Megaman.prototype.initialJumpSpeed   = 12;
Megaman.prototype.climbSpeed         = 2.5;
Megaman.prototype.moveBackwardsSpeed = 1.5; 

// Position values
Megaman.prototype.isFlipped  = false;
Megaman.prototype.isFalling  = false;
Megaman.prototype.isClimbing = false;

// Values allowing shooting or jumping
Megaman.prototype.canJumpNow  = true;
Megaman.prototype.canShootNow = true;
Megaman.prototype.burstTime = 0.2 * SECS_TO_NOMINALS;
Megaman.prototype.numShots = 0;

// Values for rendering
Megaman.prototype.numSubSteps = 1;
Megaman.prototype.nextCamY = global.camY;
Megaman.prototype.alive = true;
Megaman.prototype.SUPERMAN = false;

// Sound values
Megaman.prototype.jumpSound = "sounds/megaman_jump.wav";
Megaman.prototype.fireSound = "sounds/megaman_fire_bullet.wav";
Megaman.prototype.takesHitSound = "sounds/megaman_takes_hit.wav";
Megaman.prototype.small_pillSound = "sounds/megaman_live_increase.wav";
Megaman.prototype.big_lifeSound = "sounds/megaman_live_increase_much.wav";
Megaman.prototype.death_sound = "sounds/megaman_and_boss_dead.wav"

// misc
Megaman.prototype.maxHealth = 100;
Megaman.prototype.type = 'megaman'; // used for firing bullet
Megaman.prototype.isInvuln = false; // invulnerable
Megaman.prototype.invulnDuration = 1.0 * SECS_TO_NOMINALS;

// Sprite indexes
Megaman.prototype.spriteRenderer = {
    running : {
        renderTimes : 8,
        idx : 0,
        cnt : 0
    },
    bullet : {
        renderTimes : 20,
        idx : 0,
        cnt : 0
    },
    climbing : {
        renderTimes : 10,
        idx : 0,
        cnt : 0
    }
};

Megaman.prototype._updateSprite = function (du, oldX, oldY){
    // the s_ variables represents the sprites for megaman
    var s_running  = this.spriteRenderer.running,
        s_bullet   = this.spriteRenderer.bullet,
        s_climbing = this.spriteRenderer.climbing;
    var velX = this.velX,
        velY = this.velY;

    //Reset the bullet counter if he can shoot and shoots again
    if(this.canShootNow && this._isFiringBullet) s_bullet.cnt = 1;
    var hasShotBullet = this._isFiringBullet || s_bullet.cnt > 0;

    //Flip megaman, i.e. mirror the sprite around its Y-axis
    if(!this.isClimbing){
        if(velX < 0)      this.isFlipped = true;
        else if(velX > 0) this.isFlipped = false;
    }

    if(this.isClimbing) {
        this.sprite = g_sprites.megaman_climbing[s_climbing.idx];
    }else if(velY !== 0){
        //Sprite is jumping, either firingor not
        this.sprite = hasShotBullet ? 
            g_sprites.megaman_fire.jumping : g_sprites.megaman_jump;
    }else{
        if(velX === 0){
            //Sprite is still, either firing or not
            this.sprite = hasShotBullet ? 
                g_sprites.megaman_fire.still : g_sprites.megaman_still;
        }
        else{
            //Sprite is running, either firing or not
            this.sprite = hasShotBullet ? 
                g_sprites.megaman_fire.running[s_running.idx] : g_sprites.megaman_running[s_running.idx];
        }
    }

    //Update sprite running
    if(velX === 0 || s_running.cnt >= g_sprites.megaman_running.length * s_running.renderTimes) {
        s_running.idx = 0;
        s_running.cnt = 0;
    }else if(velX !== 0){
        s_running.idx = Math.floor(s_running.cnt / s_running.renderTimes);
        s_running.cnt += Math.round(du) || 1;
    }

    //Update sprite bullet
    if((hasShotBullet && s_bullet.cnt < s_bullet.renderTimes) || (!s_bullet.cnt && this._isFiringBullet)) 
        s_bullet.cnt += Math.round(du) || 1;
    else if(hasShotBullet) 
        s_bullet.cnt = 0;

    //Update sprite climbing
    //if(s_climbing.cnt < s_climbing.renderTimes)
    if(oldY !== this.cy){
        s_climbing.idx = Math.floor(s_climbing.cnt / s_climbing.renderTimes);
        s_climbing.cnt += Math.round(du) || 1;
        s_climbing.cnt = s_climbing.cnt >= g_sprites.megaman_climbing.length * 10 ? 0 : s_climbing.cnt;
    }

    // for part of the update invulnerable sprite, see render
    if (this.isInvuln && this._invulnTimer > this.invulnDuration / 2) {
        this.sprite = g_sprites.megaman_invulnerable;
    }

    if(!this.alive){
        this.isInvuln = true;
        this.sprite = g_sprites.megaman_dead;
    }
};

Megaman.prototype._computeVelocityY = function(du, oldVelY){
    var accelY = this.computeGravity();

    if(!this.isClimbing){
        if(this.canJumpNow){
            //So the megaman can jump low and high in the air
            if (this._hasJumped && this.velY > 0) this.velY -= 0.6*this.velY;
            //can't jump again unless he have landed on the ground
            if(this.velY === 0) this._hasJumped = false;
        }

        if(oldVelY === 0 && keys[this.KEY_JUMP] && !this._hasJumped){
            //The character is on the ground and starts to jump
            this.velY = this.initialJumpSpeed;
            this._hasJumped = true;
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
    }
    this.velY = global.isTransitioning ? this.velY/2 : this.velY;
};

Megaman.prototype.update = function (du) {
    spatialManager.unregister(this);
    if(this._isDeadNow) return entityManager.KILL_ME_NOW;
    console.log(this.cx + " " + this.cy);
    var oldX = this.cx,
        oldY = this.cy;

    if (this.numShots >= 3) {
        this.canShootNow = false;
        this.burstTimer -= du;
    }
    if (this.burstTimer <= 0) {
        this.numShots = 0;
        this.canShootNow = true;
        this.burstTimer = this.burstTime;
    }
    if(eatKey(this.KEY_SUPER)) this.SUPERMAN = !this.SUPERMAN;

    if(this._health <= 0 || (this.velY < -20 && (global.camY+960 < this.cy || global.camY-480 > this.cy))){
        this.alive = false;
        
        this.killMegaman();
    }

    // hopefully disable controls if we are in a collision with an enemy (the first half)
    if (this._invulnTimer < this.invulnDuration && this._invulnTimer > this.invulnDuration / 2) {
        this.immobilize(true);
    }

    // Perform movement substeps
    var steps = this.numSubSteps;
    var dStep = du / steps;
    for (var i = 0; i < steps; ++i) {
        this.computeSubStep(dStep);
    }

    // ugly fix for annoying visual bug when jumping between map parts
    if (global.mapPart === 6 && this.cy < 1000 && !this.isClimbing) {
            this.fix = true;
    }

    // camera moving to correct place in snakeman boss
    if (this.cx > 8240 && !BOSS_STARTED) {
        global.camX = 8200;
        global.camY = 20;
        global.mapPart = 8;
        // do more bossy stuff!
        playBossSong();
        BOSS_STARTED = true;
        entityManager.generateEnemy('gate', {

        });
        global.isTransitioning = true;
    }

    if (this.cy > 1000) this.fix = false;

    // move camera when megaman transisiton between levels of the map
    if(!global.isTransitioning){
        if (this.cy < global.camY && global.camY > global.mapHeight && !this.fix){
            if (!(this.cy < 150)) {
                this.nextCamY -= 480;
                global.mapPart++;
            }
        } 
        else if (this.cy > global.camY + 480 && !global.fellOffEdge) {
            this.nextCamY += 480;
            global.mapPart--;
        }
    }

    if(global.camY > this.nextCamY){
        global.camY = Math.max(this.nextCamY, global.camY - global.transitionSpeed * du);
        global.isTransitioning = true;
    } else if(global.camY < this.nextCamY){
        global.camY = Math.min(this.nextCamY, global.camY + global.transitionSpeed * du);
        global.isTransitioning = true;
    } else if(global.isTransitioning) {
        global.isTransitioning = false;
    }
    if(this._health > this.maxHealth) this._health = this.maxHealth;
    // Handle firing
    this.maybeFireBullet();

    spatialManager.register(this);
    
    //Update the sprite
    this._updateSprite(du, oldX, oldY);

    /************************************************************
    * keyUpKeys[keyCode] is true if and only if a given key with 
      keycode keyCode has been pushed down and released again
    *************************************************************/
    this.canShootNow = keyUpKeys[this.KEY_FIRE];
    this.canJumpNow  = keyUpKeys[this.KEY_JUMP];
};

Megaman.prototype.immobilize = function (set) {
        if (set) {
            this.verticalSpeed = 0;
            this.initialJumpSpeed = 0;
            this.climbSpeed = 0;
        } else {
            this.verticalSpeed = this.reset_verticalSpeed;
            this.initialJumpSpeed = this.reset_initialJumpSpeed;
            this.climbSpeed = this.reset_climbSpeed;
        }
        /* old implementation
        keys[this.KEY_UP] = false;
        keys[this.KEY_DOWN] = false;
        keys[this.KEY_LEFT] = false;
        keys[this.KEY_RIGHT] = false;
        keys[this.KEY_JUMP] = false;
        keys[this.KEY_FIRE] = false;*/
};

Megaman.prototype.killMegaman = function(){
    this.alive = false;
    this.sprite = g_sprites.megaman_dead;
    audioManager.pause("sounds/snake_man.mp3");
    audioManager.pause("sounds/snake_man_intro.mp3");
    audioManager.playByID(this.death_sound);
    setTimeout(function(){ 
        location.reload(); 
    },3000);
};

Megaman.prototype.computeSubStep = function (du) {
    this.updatePosition(du);   
};

Megaman.prototype.computeGravity = function () {
    return global.gravity;
};

Megaman.prototype.computeThrustX = function () {
    var directionX = 0;

    if (keys[this.KEY_RIGHT]) {
        directionX += this.verticalSpeed;
    }
    if (keys[this.KEY_LEFT]) {
        directionX -= this.verticalSpeed;
    }
    return directionX;
};

Megaman.prototype.computeThrustY = function() {
    var directionY = 0;

    if (keys[this.KEY_UP]) {
        directionY -= this.climbSpeed;
    }
    if (keys[this.KEY_DOWN]) {
        directionY += this.climbSpeed;
    }
    if(global.isTransitioning) return directionY/2;
    return directionY;
}

Megaman.prototype.updatePosition = function (du) {
    // setti inn fastar tölur hér þar sem breytilega stærðin var
    // að fokka upp collision detectioninu á óútreiknanlegan hátt

    // þarf að hreinsa upp collisionið og setja upp í sér class sem
    // megaman og vondir kallar sem collida við background erfa frá
    //    #ThirdWeekProblems 
    var spriteHalfWidth  = this.width/2,
        spriteHalfHeight = this.height/2;
    var oldVelX = this.velX,
        oldVelY = this.velY;

    //HORIZONTAL POSITION UODATE
    //
    this.velX = this.computeThrustX() * du;
    var nextX = this.isClimbing ? this.cx : this.cx + this.velX;

    // handle collision with entities in game and stuff
    // he goes backwards a bit on collision
    if (this.isInvuln) {
        this._invulnTimer -= du;
        // if we're invulnerable and got more than half of that time left
        // move us backwards during
        if (this._invulnTimer > this.invulnDuration / 2) {
            var oldNextX = nextX;
            nextX -= this.isFlipped ? -this.moveBackwardsSpeed * du : this.moveBackwardsSpeed * du;
            var NextCollides = Map.cornerCollisions(nextX, this.cy, this.width, this.height);
            if(NextCollides[0] === 1 || NextCollides[1] === 1){nextX = oldNextX;}
        }
        if (this._invulnTimer < this.invulnDuration / 2) {
            this.immobilize(false); // enable movement again
        }
    }
    var hitEntity = this.isColliding();
    if (hitEntity && !this.isInvuln && hitEntity.creator !== 'megaman' && 
        hitEntity.type !== 'goodie' && 
        hitEntity.type !== 'misteryBox' && !this.SUPERMAN && hitEntity.type !== 'bullet') {
        // COLLISION
        if(!this.SUPERMAN){
            this._health -= 7.5; // needs adjusting
            if (hitEntity.type === 'snakeman') this._health -= 2.5;
        }
        this.isInvuln = true;
        this.isClimbing = false;
        audioManager.play(this.takesHitSound);
    }
    if (this._invulnTimer <= 0) {
        this._invulnTimer = this.invulnDuration;
        this.isInvuln = false;
    }
    
    var flipped = this.isFlipped ? -1 : 1;
    var xAdjusted = flipped * spriteHalfWidth + nextX;
    
    // tjékkar á láréttu collission við umhverfi
    var topXAdjusted    = Map.isColliding(xAdjusted, this.cy - spriteHalfHeight + 5), //afhverju + 5 ?
        bottomXAdjusted = Map.isColliding(xAdjusted, this.cy + spriteHalfHeight - 5); //afhverju - 5 ?
    if ((topXAdjusted !== 1 && bottomXAdjusted !== 1) && (topXAdjusted !== 5 && bottomXAdjusted !== 5) && this.alive){
        this.cx = Math.max(spriteHalfWidth, nextX);
    }

    //VERTICAL POSITION UPDATE
    //
    this._computeVelocityY(du, oldVelY);
    if(this.alive) this.cy -= du * this.velY;

    //If the megaman jumps out of view
    if(global.mapPart === 8 && Map.isOutOfBound(this.cx, this.cy, this.width, this.height)){
        this._health = -1;
        this.killMegaman();
        return;
    }
    
    // if megaman is climbing and jumps he will stop climbing
    if(keys[this.KEY_JUMP] && this.isClimbing) this.isClimbing = false;

    /*
        * collisions[0] represents the value of the LEFT  TOP    tile that the megaman colides with -> ltColl
        * collisions[1] represents the value of the RIGHT TOP    tile that the megaman colides with -> rtColl
        * collisions[2] represents the value of the RIGHT BOTTOM tile that the megaman colides with -> rbColl
        * collisions[3] represents the value of the LEFT  BOTTOM tile that the megaman colides with -> lbColl
    */
    var collisions = Map.cornerCollisions(this.cx, this.cy, this.width, this.height);
    var ltColl = collisions[0], rtColl = collisions[1], rbColl = collisions[2], lbColl = collisions[3];

    var wasClimbing = this.isClimbing;
    this.isClimbing = !(Math.max(lbColl, rbColl) === 3 && keys[this.KEY_UP] && !this.isClimbing) && 
                        (Map.collidesWithStair(ltColl, rtColl, rbColl, lbColl) && 
                        (keys[this.KEY_UP] || keys[this.KEY_DOWN] || this.isClimbing));

    if(this.isClimbing){
        // snaps megaman to the center of the ladder he's climbing
        if (Map.collidesWithStair(rtColl, rbColl)) {
            this.cx = Map.getXPosition(this.cx + this.width/2);
        }
        if (Map.collidesWithStair(ltColl, lbColl)) {
            this.cx = Map.getXPosition(this.cx - this.width/2);
        }

        this.isFalling = false;
        this.velY = 0;
        this.cy += this.computeThrustY() * du;
    }else{
        if ((ltColl === 1 || rtColl === 1) && this.velY >= 0){
            //The megaman jumps up and collides its head with a tile
            this.velY = -0.5;
        }
        if(lbColl === 1 || lbColl === 3 || rbColl === 1 || rbColl === 3 || lbColl === 4 || rbColl === 4 || lbColl === 5 || rbColl === 5) {
            //Check whether the megaman is colliding with the ground of the map
            this.cy = Map.getYPosition(this.cy, this.height);
            this.velY = 0;
            this.isFalling = false;
        }else if(!this.isFalling && this.velY <= 0){
            //Starts falling down
            this.velY = wasClimbing ? 0 : -0.5;
            this.isFalling = wasClimbing ? false : true;
        }
    }

    if (rbColl === 5 || lbColl === 5 || rbColl === 4 || lbColl === 4 || rbColl === 3 || lbColl === 3) {
        Map._tiles[33][159] = 0;
        Map._tiles[32][159] = 0;
        Map._tiles[31][159] = 0;
        Map._tiles[30][159] = 0;
        Map._tiles[29][159] = 0;
        Map._tiles[28][159] = 0;
    }
    //implement the y update if fx megaman is standing on big snakey wave
    if(global.collisionUpdate.shouldUpdate){
        if(!this._hasJumped){
            this.cy = global.collisionUpdate.cy;
        }
        global.collisionUpdate.shouldUpdate = false;
    }

    if(oldVelY < 0 && this.velY === 0) audioManager.play(this.jumpSound);
    global.megamanX = this.cx;
    global.megamanY = this.cy;

    // check if the camera translation system should follow megaman or not
    if(Map.isColliding(this.cx, this.cy) === null) global.fellOffEdge = true;
};

//Fires one bullet after each keypress.
Megaman.prototype.maybeFireBullet = function () {
    if(this.canShootNow) this._isFiringBullet = false;

    if (keys[this.KEY_FIRE] && !this._isFiringBullet && !this.isClimbing) {
        var velY = 0,
            velX = this.isFlipped ? -10 : 10;

        entityManager.fireBullet(
           this.cx, this.cy, velX, velY, this.type);
        audioManager.play(this.fireSound);

        this.numShots += 1;
        this._isFiringBullet = true;
    }
};

Megaman.prototype.takeBulletHit = function() {
    var hitEntity = this.isColliding();
    if (hitEntity && !this.isInvuln && hitEntity.creator !== 'megaman' && !this.SUPERMAN) {
        // COLLISION
        this._health -= 7.5; // needs adjusting
        this.isInvuln = true;
        this.isClimbing = false;
        audioManager.play(this.takesHitSound);
        /*if ((global.mapPart === 3 && this.cx < 1970) || (global.mapPart === 6 && this.cx < 4020)) {
            this._health -= 7.5; // big snakey hack!!!
        }*/
        if (hitEntity.creator === 'bigsnakey') this._health -= 7.5;    
    }
};

Megaman.prototype.receiveGoodie = function (type) {
    if (type === 'small_pill') {
        this._health += 10;
        audioManager.play(this.small_pillSound);
    } else if (type === 'big_life') {
        this._health += 30;
        audioManager.play(this.big_lifeSound);
    }
    // else do nothing... if we receive a juicy buster power
};

Megaman.prototype.getRadius = function () {
    return (Math.max(this.sprite.width, this.sprite.height) / 2) * this._scale;
};

Megaman.prototype.halt = function () {
    this.velX = 0;
    this.velY = 0;
};

Megaman.prototype.render = function (ctx) {
    var origScale = this.sprite.scale;
    this.sprite.scale = this._scale;

    // draw explosion if an enemy collides with us
    // alternate every x second
    // this can perhaps be simplified some... but whatever, it works! :D
    if (this.isInvuln && this.alive) {
        // blink controlles the rate of alternating sprites here
        // yes... probably couldve variablized the number 8 here but damn it!
        var blink = this._invulnTimer < this.invulnDuration && this._invulnTimer > this.invulnDuration * 7 / 8 ||
                    this._invulnTimer < this.invulnDuration * 6 / 8 && this._invulnTimer > this.invulnDuration * 5 / 8 ||
                    this._invulnTimer < this.invulnDuration * 4 / 8 && this._invulnTimer > this.invulnDuration * 3 / 8 ||
                    this._invulnTimer < this.invulnDuration * 2 / 8 && this._invulnTimer > this.invulnDuration * 1 / 8;

        if (this._invulnTimer < this.invulnDuration/2 && blink) {
            // yes a little hack.. whatever. After half the invuln duration
            // start just making megaman sprite blink instead of the explosion
            // normal sprite drawing
            this.sprite.drawWrappedCentredAt(
               ctx, this.cx, this.cy, this.isFlipped
            );
        } else if (blink) {
            // normal sprite drawing
            this.sprite.drawWrappedCentredAt(
               ctx, this.cx, this.cy, this.isFlipped
            );
            // explosion
            var oldAlpha = ctx.globalAlpha;
            ctx.globalAlpha = 0.7;
            g_sprites.megaman_explosion.drawWrappedCentredAt(
                ctx, this.cx, this.cy, false
            );
            ctx.globalAlpha = oldAlpha; 
        }
    } else {
        // normal sprite drawing
        this.sprite.drawWrappedCentredAt(
           ctx, this.cx, this.cy, this.isFlipped
        );
    }
    this.sprite.scale = origScale;

    this.drawHealth(ctx);
};

Megaman.prototype.drawHealth = function(ctx) {
    var sprite = g_sprites.megaman_health;
    var oldWidth = sprite.width;
    var oldHeight = sprite.height;

    var origScale = sprite.scale;
    // whoop magic numbers
    sprite.scale = 0.85;
    var s = sprite.scale;
    var cx = global.camX + 44;
    var cy = global.camY + 30 + s*(sprite.height)/2;

    sprite.drawWrappedCentredAt(
        ctx, cx, cy
    );
    var healthRatio = 1 - this._health / this.maxHealth;
    if (healthRatio < 0) healthRatio = 0;
    var topLeft = [cx - s*(sprite.width)/2, cy - s*(sprite.height)/2]; // [x, y]
    // draw a black box over the health we've lost
    var oldFillStyle = ctx.fillStyle;
    ctx.fillStyle = 'black';
    // - 2 is magic number for quick fix
    ctx.fillRect(topLeft[0], topLeft[1], s*sprite.width-2, s*(healthRatio * sprite.height));
    ctx.fillStyle = oldFillStyle;

    sprite.scale = origScale;
    sprite.width = oldWidth;
    sprite.height = oldHeight;
};
