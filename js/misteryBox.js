        // entityManager.fireBullet(
        //    this.cx, this.cy, velX, velY, this.type);
        // audioManager.play(this.fireSound);

function misteryBox(descr) {
    // Common inherited setup logic from Entity
    this.setup(descr);
    
    // Default sprite, if not otherwise specified
    this.sprite = this.sprite || g_sprites.misteryBox[0];
    this.spriteArray = g_sprites.misteryBox;
    
    // Set drawing scale
    this._scale = 2;
    this.width = this.sprite.width * this._scale;
    this.height = this.sprite.height * this._scale;
};

misteryBox.prototype = new Enemy();

misteryBox.prototype.health = 2;
misteryBox.prototype.type = 'misteryBox';

misteryBox.prototype.spriteRenderer = {
    blink : {
        renderTimes : 24,
        idx : 0,
        cnt : 0
    }
};

misteryBox.prototype._updateSprite = function (du){
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

misteryBox.prototype.update = function (du) {

    spatialManager.unregister(this);
    if (this._isDeadNow) return entityManager.KILL_ME_NOW;

    if (this.health <= 0) {
        this.onDeath(); // make bombs and goodies 
        this.kill();
    }

    spatialManager.register(this);

    this._updateSprite(du, 0, 0);
};

misteryBox.prototype.updatePosition = function (du) {
    };

misteryBox.prototype.render = function (ctx) {
    var origScale = this.sprite.scale;
    this.sprite.scale = this._scale;

    this.sprite.drawWrappedCentredAt(
       ctx, this.cx, this.cy, this.isFlipped
    );
    this.sprite.scale = origScale;

    // be careful, if you overwrite this render in your own enemies, make
    // sure you include the explosion on death!
    /*if (this.health <= 0) {
        this.onDeath();
    }*/
    // this is obviously omitted here....
};