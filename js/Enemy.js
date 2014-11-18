// =====
// ENEMY
// =====

// enemies inherit from Entity and consitute stuff that's not Megaman
// and has certain things in common

"use strict";

function Enemy() {

};

Enemy.prototype = new Entity();

// Values for rendering
Enemy.prototype.numSubSteps = 1;

// Velocity values
Enemy.prototype.verticalSpeed  = 3;

// misc
Enemy.prototype.health = 1;
Enemy.prototype.type = 'enemy';

Enemy.prototype.takeBulletHit = function() {
    this.health -= 1;
};

Enemy.prototype.computeSubStep = function (du) {
    this.updatePosition(du);   
};

Enemy.prototype.computeGravity = function () {
    return global.gravity;
};

Enemy.prototype.getRadius = function () {
    return (Math.max(this.sprite.width, this.sprite.height) / 2) * this._scale;
};

Enemy.prototype.halt = function () {
    this.velX = 0;
    this.velY = 0;
};

Enemy.prototype.render = function (ctx) {
    var origScale = this.sprite.scale;
    this.sprite.scale = this._scale;

    this.sprite.drawWrappedCentredAt(
       ctx, this.cx, this.cy, this.isFlipped
    );
    this.sprite.scale = origScale;

    // be careful, if you overwrite this render in your own enemies, make
    // sure you include the explosion on death!
    if (this.health <= 0) {
        entityManager.generateEnemy('explosion', {
            cx : this.cx,
            cy : this.cy
        });
    }
};