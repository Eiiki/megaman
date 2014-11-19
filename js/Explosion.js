// ==========
// EXPLOSION
// ==========

"use strict";

// A generic contructor which accepts an arbitrary descriptor object
function Explosion(descr) {
    // Common inherited setup logic from Entity
    this.setup(descr);
    
    // Default sprite, if not otherwise specified
    this.sprite = this.sprite || g_sprites.explosion[0];
    
    // Set drawing scale
    this._scale = 4;
    this.width = this.sprite.width * this._scale;
    this.height = this.sprite.height * this._scale;
};

Explosion.prototype = new Enemy();

Explosion.prototype.type = 'explosion';

// "controls"
// no controls... simply and explodes

// Sprite indexes
Explosion.prototype.spriteRenderer = {
    explosion : {
        renderTimes : 8,
        idx : 0,
        cnt : 0
    }
};

Explosion.prototype._updateSprite = function (du, oldX, oldY){
    // the s_ variables represents the sprites
    var s_explosion  = this.spriteRenderer.explosion;

    //Sprite is moving
    this.sprite = g_sprites.explosion[s_explosion.idx];
 
    //Update sprite moving
    if(s_explosion.cnt >= g_sprites.explosion.length * s_explosion.renderTimes) {
        s_explosion.idx = 0;
        s_explosion.cnt = 0;
        this.kill();
    }else {
        s_explosion.idx = Math.floor(s_explosion.cnt / s_explosion.renderTimes);
        s_explosion.cnt += Math.round(du) || 1;
    }
};

Explosion.prototype.getRadius = function() {
    return 0; // make sure we are out of the collision system.
}

Explosion.prototype.update = function (du) {
    spatialManager.unregister(this);
    if (this._isDeadNow) return entityManager.KILL_ME_NOW;

    //this.decideActions(du); // AI
    
    var oldX = this.cx,
        oldY = this.cy;

    // handle collisions and stuff
    if (this.health <= 0) this.kill();

    spatialManager.register(this);

    this._updateSprite(du, oldX, oldY);
};

Explosion.prototype.render = function (ctx) {
    var origScale = this.sprite.scale;
    this.sprite.scale = this._scale;

    this.sprite.drawWrappedCentredAt(
       ctx, this.cx, this.cy, this.isFlipped
    );
    this.sprite.scale = origScale;
};
