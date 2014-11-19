function bigSnakey(descr) {
    // Common inherited setup logic from Entity
    this.setup(descr);
    
    // Default sprite, if not otherwise specified
    this.sprite = this.sprite || g_sprites.bigSnakey[0];
    
    // Set drawing scale
    this._scale = 1;
    this.width = this.sprite.width * this._scale;
    this.height = this.sprite.height * this._scale;
    this.isFlipped = false;
};

bigSnakey.prototype = new Enemy();

bigSnakey.prototype.health = 2;
bigSnakey.prototype.type = 'bigsnakey';
bigSnakey.prototype.timeSinceShot = 0;
bigSnakey.prototype.hasShot = false;

bigSnakey.prototype.megamanBehind = function() {
    return this.isFlipped ? global.megamanX < this.cx : global.megamanX > this.cx;
}

bigSnakey.prototype._updateSprite = function () {
    /*if (this.timeSinceShot >= 100) { this.sprite = g_sprites.bigSnakey[2]; }
    if (this.timeSinceShot >= 120) { this.sprite = g_sprites.bigSnakey[0]; }
    if (this.timeSinceShot >= 140 && !this.megamanBehind()) { this.sprite = g_sprites.bigSnakey[1]; }
    if (this.timeSinceShot >= 160) { this.timeSinceShot = 0; }
    if (this.timeSinceShot  < 100) { this.sprite = g_sprites.bigSnakey[0]; }*/
    this.sprite = g_sprites.bigSnakey[0];
};

bigSnakey.prototype.fireBullet = function () {
    /*var xVector = (global.megamanX - this.cx);
    var yVector = (global.megamanY - this.cy);
    
    var yToxRatio = yVector / xVector;
    
    var xVel = this.isFlipped ? 6 : -6;
    var yVel = xVel * yToxRatio;

    // 5 is to make it look good when snakey fires, otherwise when he is
    // flipped the shot will start outside of his sprite
    entityManager.fireBullet(this.cx + 5, this.cy, xVel, yVel, this.type);
    
    audioManager.play(this.fireSound);
    this.hasShot = true;*/
};

bigSnakey.prototype.update = function (du) {
    spatialManager.unregister(this);
    if (this._isDeadNow) return entityManager.KILL_ME_NOW;

    // update time
    this.timeSinceShot += du;

    if (this.timeSinceShot >= 145 && !this.hasShot && !this.megamanBehind()) { this.fireBullet(); } 
    if (this.timeSinceShot >= 160) { this.hasShot = false; }

    if (this.health <= 0) this.kill();

    spatialManager.register(this);

    //Update the sprite
    this._updateSprite();
};

bigSnakey.prototype.render = function (ctx) {
    var offSet = this.isFlipped ? this.sprite.width/2 : 0;
    this.sprite.drawWrappedCentredAt(ctx, this.cx + offSet, this.cy, this.isFlipped);

    if (this.health <= 0) {
        entityManager.generateEnemy('explosion', {
            cx : this.cx,
            cy : this.cy
        });
    }
};