        // entityManager.fireBullet(
        //    this.cx, this.cy, velX, velY, this.type);
        // audioManager.play(this.fireSound);

function petiteSnakey(descr) {
    // Common inherited setup logic from Entity
    this.setup(descr);
    
    // Default sprite, if not otherwise specified
    this.sprite = this.sprite || g_sprites.petiteSnakey[0];
    
    // Set drawing scale
    this._scale = 2;
    this.width = this.sprite.width * this._scale;
    this.height = this.sprite.height * this._scale;
};

petiteSnakey.prototype = new Enemy();

petiteSnakey.prototype.health = 2;
petiteSnakey.prototype.type = 'petiteSnakey';
petiteSnakey.prototype.timeSinceShot = 0;
petiteSnakey.prototype.hasShot = false;

petiteSnakey.prototype.megamanBehind = function() {
    return this.isFlipped ? global.megamanX < this.cx : global.megamanX > this.cx;
}

petiteSnakey.prototype._updateSprite = function () {
    if (this.timeSinceShot >= 100) { this.sprite = g_sprites.petiteSnakey[2]; }
    if (this.timeSinceShot >= 120) { this.sprite = g_sprites.petiteSnakey[0]; }
    if (this.timeSinceShot >= 140 && !this.megamanBehind()) { this.sprite = g_sprites.petiteSnakey[1]; }
    if (this.timeSinceShot >= 160) { this.timeSinceShot = 0; }
    if (this.timeSinceShot  < 100) { this.sprite = g_sprites.petiteSnakey[0]; }
};

petiteSnakey.prototype.fireBullet = function () {
    var xVector = (global.megamanX - this.cx);
    var yVector = (global.megamanY - this.cy);
    
    var yToxRatio = yVector / xVector;
    
    var xVel = this.isFlipped ? 6 : -6;
    var yVel = xVel * yToxRatio;

    // 5 is to make it look good when snakey fires, otherwise when he is
    // flipped the shot will start outside of his sprite
    entityManager.fireBullet(this.cx + 5, this.cy, xVel, yVel, this.type);
    
    audioManager.play(this.fireSound);
    this.hasShot = true;
}

petiteSnakey.prototype.update = function (du) {

    spatialManager.unregister(this);
    if (this._isDeadNow) return entityManager.KILL_ME_NOW;

    // update time
    this.timeSinceShot += du;

    if (this.timeSinceShot >= 145 && !this.hasShot && !this.megamanBehind()) { this.fireBullet(); } 
    if (this.timeSinceShot >= 160) { this.hasShot = false; }

    if (this.health <= 0) {
        this.onDeath(); // make bombs and goodies 
        this.kill();
    }

    spatialManager.register(this);

    //Update the sprite
    this._updateSprite();
};

petiteSnakey.prototype.render = function (ctx) {
    var offSet = this.isFlipped ? this.sprite.width/2 : 0;
    var origScale = this.sprite.scale;
    this.sprite.scale = this._scale;

    this.sprite.drawWrappedCentredAt(ctx, this.cx + offSet, this.cy, this.isFlipped, this.flippY);
    this.sprite.scale = origScale;
};