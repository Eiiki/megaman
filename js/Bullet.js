// ======
// BULLET
// ======

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */


// A generic contructor which accepts an arbitrary descriptor object
function Bullet(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    // Make a noise when I am created (i.e. fired)
    if(this.fireSound.currentTime === 0 || this.fireSound.currentTime > 0.4){
    this.fireSound.pause();
    this.fireSound.currentTime = 0;

    this._scale = 0.2;
}
    this.fireSound.play();
    
/*
    // Diagnostics to check inheritance stuff
    this._bulletProperty = true;
    console.dir(this);
*/

}

Bullet.prototype = new Entity();

// HACKED-IN AUDIO (no preloading)
Bullet.prototype.fireSound = new Audio(
    "sounds/megaman_fire_bullet.wav");
Bullet.prototype.zappedSound = new Audio(
    "sounds/megaman_takes_hit.wav");
    
// Initial, inheritable, default valuesBullet.prototype.cx = 200;
Bullet.prototype.cy = 200;
Bullet.prototype.cx = 200;
Bullet.prototype.velX = 20;
Bullet.prototype.velY = 0;

Bullet.prototype.update = function (du) {

    // TODO: YOUR STUFF HERE! --- Unregister and check for death
    spatialManager.unregister(this);

    //if (bullet hits anything) return entityManager.KILL_ME_NOW;

    this.cx += this.velX * du;
    this.cy += this.velY * du;

    this.wrapPosition();
    
    // TODO? NO, ACTUALLY, I JUST DID THIS BIT FOR YOU! :-)
    //
    // Handle collisions
    //
    var hitEntity = this.findHitEntity();
    if (hitEntity) {
        var canTakeHit = hitEntity.takeBulletHit;
        if (canTakeHit) canTakeHit.call(hitEntity);
        return entityManager.KILL_ME_NOW;
    }
    
    // TODO: YOUR STUFF HERE! --- (Re-)Register
    spatialManager.register(this);
};

Bullet.prototype.getRadius = function () {
    return 4;
};

Bullet.prototype.takeBulletHit = function () {
    this.kill();
    
    // Make a noise when I am zapped by another bullet
    this.zappedSound.play();
};

Bullet.prototype.render = function (ctx) {

    g_sprites.bullet.drawWrappedCentredAt(
        ctx, this.cx, this.cy, this.rotation
    );
};
