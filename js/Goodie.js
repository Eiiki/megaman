// =======
// GOODIES
// =======

"use strict";

// A generic contructor which accepts an arbitrary descriptor object
function Goodie(descr) {
    // Common inherited setup logic from Entity
    this.setup(descr);
    
    // Default sprite, if not otherwise specified
    this.sprite = this.sprite || g_sprites.small_pill[0];
    
    //decide type at random!!
    var rand = Math.floor(util.randRange(0, this.possibles.length));
    console.log("rand " + rand);
    if (rand === this.possibles.length) rand = this.possibles.length - 1; // just in case
    this.goodieType = this.possibles[rand];
    console.log("goodieType " + this.goodieType);

    // decide correct sprite/scale
    if (this.goodieType === 'small_pill') {
        this.sprite = g_sprites.small_pill[0];
        this.spriteArray = g_sprites.small_pill;
        this._scale = 1.5;
    } else {
        // default to small pill just in case
        this.sprite = g_sprites.small_pill[0];
        this.spriteArray = g_sprites.small_pill;
        this._scale = 1.5;
    }

    this.width = this.sprite.width * this._scale;
    this.height = this.sprite.height * this._scale;
};

Goodie.prototype = new Enemy();

Goodie.prototype.type = 'goodie';
Goodie.prototype.goodieType = 'small_pill'; // default, seperate from this.type because of megaman collides with enemy


Goodie.prototype.possibles = ['small_pill', 'big_life'];

// Sprite indexes
Goodie.prototype.spriteRenderer = {
    blink : {
        renderTimes : 8,
        idx : 0,
        cnt : 0
    }
};

Goodie.prototype._updateSprite = function (du, oldX, oldY){
    // the s_ variables represents the sprites
    var s_blink  = this.spriteRenderer.blink;

    //Sprite is blink
    this.sprite = this.spriteArray[s_blink.idx];
 
    //Update sprite blink
    if(s_blink.cnt >= this.spriteArray.length * s_blink.renderTimes) {
        s_blink.idx = 0;
        s_blink.cnt = 0;
    }else {
        s_blink.idx = Math.floor(s_blink.cnt / s_blink.renderTimes);
        s_blink.cnt += Math.round(du) || 1;
    }
};

Goodie.prototype._computeVelocityY = function(du, oldVelY){
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

Goodie.prototype.update = function (du) {
    spatialManager.unregister(this);
    if (this._isDeadNow) return entityManager.KILL_ME_NOW;

    // Perform movement substeps
    var steps = this.numSubSteps;
    var dStep = du / steps;
    for (var i = 0; i < steps; ++i) {
        this.computeSubStep(dStep);
    }

    // GIVE MEGAMAN THE GOODIE AND GO AWAY
    var hitEntity = this.isColliding();
    if (hitEntity && hitEntity.type === 'megaman') {
        hitEntity.receiveGoodie(this.goodieType);
        this.kill();
    }

    spatialManager.register(this);
};

Goodie.prototype.updatePosition = function (du) {
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
    console.log(this.cx + " " + this.cy + " " + this.width + " " + this.height);
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

/************************************************************
*                          A. I.                            *
*************************************************************/
/* goodie has no ai... */
