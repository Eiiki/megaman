// ======
// BULLET
// ======

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */


// A generic contructor which accepts an arbitrary descriptor object
function Bullet(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    // Default sprite, if not otherwise specified
    this.sprite = this.sprite || g_sprites.bullet;
    // Set normal drawing scale
    this._scale = 0.15;

    if (this.creator === "petiteSnakey") {
        this.sprite = g_sprites.small_pill[0];
        this._scale = 1.4;
    }

    if (this.creator === "hammer_joe") {
        this.sprite = g_sprites.hammer_joe_bullet[0];
        this.spriteIndex = 0;
        this._scale = 2;
    }

    if(this.creator === "bigsnakey"){
        this.sprite = g_sprites.big_bullet[0];
        this.spriteIndex = 0;
        this._scale = 2.1;
    }
    this.timeSinceShot = 0;
    this.shouldRegister = true;
}

Bullet.prototype = new Entity();

Bullet.prototype.creator = 'none'; // who fired me?

// HACKED-IN AUDIO (no preloading)
Bullet.prototype.zappedSound = "sounds/enemy_takes_hit.wav";

Bullet.prototype._updateSprite = function () {
    if (this.creator === 'hammer_joe') {
        this.sprite = g_sprites.hammer_joe_bullet[this.spriteIndex];
        if (this.timeSinceShot >= 3) {
            this.spriteIndex++;
            this.timeSinceShot = 0;
            if (this.spriteIndex >= g_sprites.big_bullet.length) this.spriteIndex = 0;
        }
    }

    if(this.creator === "bigsnakey"){
        this.sprite = g_sprites.big_bullet[this.spriteIndex];
        if (this.timeSinceShot >= 3) {
            this.spriteIndex++;
            this.timeSinceShot = 0;
            if (this.spriteIndex === 2) this.spriteIndex = 0;
        }
    }
}

Bullet.prototype.update = function (du) {

    // TODO: YOUR STUFF HERE! --- Unregister and check for death
    spatialManager.unregister(this);

    //if (bullet hits anything) return entityManager.KILL_ME_NOW;
    this.cx += this.velX * du;
    this.cy += this.velY * du;

    this.timeSinceShot += du;

    if(this.cx > g_canvas.width + global.camX || this.cx < global.camX){
        this.takeBulletHit();
        return entityManager.KILL_ME_NOW;
    }


    // Handle collisions
    // don't kill this bullet if the hit entity is the creator of the bullet
    // also don't call the "takeBulletHit" function if you hit the creator

    // plus all enemies hurt megaman and not each other

    var hitEntity = this.findHitEntity();
    
    if (hitEntity.type === 'hammer_joe' && hitEntity.invulnerable && this.shouldRegister) {
        this.velX *= -1;
        this.velY = -10;
        this.shouldRegister = false;
        spatialManager.register(this);
        return;
    }

    if (hitEntity) {
        var canTakeHit = hitEntity.takeBulletHit;
        var type = hitEntity.type;
        if (canTakeHit && ((this.creator === 'megaman' && type !== 'megaman') ||
            (this.creator !== 'megaman' && type === 'megaman'))) canTakeHit.call(hitEntity);

        if ((this.creator === 'megaman' && type !== 'megaman') ||
            (this.creator !== 'megaman' && type === 'megaman')) {
            audioManager.play(this.zappedSound);
            return entityManager.KILL_ME_NOW;
        }
    }
    
    if (this.cx < global.camX || this.cx > global.camX + g_canvas.width ||
        this.cy < global.camY || this.cy > global.camY + g_canvas.height) 
    {
        return entityManager.KILL_ME_NOW;
    }
    // TODO: YOUR STUFF HERE! --- (Re-)Register
    spatialManager.register(this);
    this._updateSprite()
};

Bullet.prototype.getRadius = function () {
    return Math.max(this.sprite.width/2, this.sprite.height/2) * this._scale;
};

Bullet.prototype.takeBulletHit = function () {
    this.kill();
    // Make a noise when I am zapped by another bullet
    audioManager.play(this.zappedSound);
};

Bullet.prototype.render = function (ctx) {
    var origScale = this.sprite.scale;
    // pass my scale into the sprite, for drawing

    this.sprite.scale = this._scale;
    this.sprite.drawWrappedCentredAt(
        ctx, this.cx, this.cy, this.isFlipped 
    );
    this.sprite.scale = origScale;
};
