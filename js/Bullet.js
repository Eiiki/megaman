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
    
/*
    // Diagnostics to check inheritance stuff
    this._bulletProperty = true;
    console.dir(this);
*/

}

Bullet.prototype = new Entity();

Bullet.prototype.creator = 'none'; // who fired me?

// HACKED-IN AUDIO (no preloading)
Bullet.prototype.zappedSound = "sounds/enemy_takes_hit.wav";

Bullet.prototype.update = function (du) {

    // TODO: YOUR STUFF HERE! --- Unregister and check for death
    spatialManager.unregister(this);

    //if (bullet hits anything) return entityManager.KILL_ME_NOW;

    this.cx += this.velX * du;
    this.cy += this.velY * du;

    if(this.cx > g_canvas.width + global.camX || this.cx < global.camX){
        this.takeBulletHit();
        return entityManager.KILL_ME_NOW;
    }

    this.wrapPosition();

    // Handle collisions
    // don't kill this bullet if the hotentity is the creator of the bullet
    // also don't call the "takeBulletHit" function if you hit the creator
    var hitEntity = this.findHitEntity();
    if (hitEntity) {
        var canTakeHit = hitEntity.takeBulletHit;
        var type = hitEntity.type;
        if (canTakeHit && type !== this.creator) canTakeHit.call(hitEntity);

        if (type !== this.creator) return entityManager.KILL_ME_NOW;
    }
    
    // TODO: YOUR STUFF HERE! --- (Re-)Register
    spatialManager.register(this);
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

    g_sprites.bullet.drawWrappedCentredAt(
        ctx, this.cx, this.cy, this.rotation
    );
    this.sprite.scale = origScale;
};
