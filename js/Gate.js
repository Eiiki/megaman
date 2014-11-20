// ===================
// GATE
// ===================

"use strict";

// A generic contructor which accepts an arbitrary descriptor object
function Gate(descr) {
    // Common inherited setup logic from Entity
    this.setup(descr);
    
    // Default sprite, if not otherwise specified
    this.sprite = this.sprite || g_sprites.gate;

    // Set drawing scale
    this._scale = this.sprite.scale;
    this.width = this.sprite.width * this._scale;
    this.height = this.sprite.height * this._scale; 

    // set the tiles in the map array as 1 so megaman can't get out.
    var x1 = 8188;
    var x2 = x1 + 32;
    var y1 = 297;
    var y2 = y1 + 32;
    var y3 = y2 + 32;
    var y4 = y3 + 32;
    var coords = [
        [x1, y1],[x1,y2],[x1,y3],[x1,y4],
        [x2, y1],[x2,y2],[x2,y3],[x2,y4]
    ];
    for (var i = 0; i < coords.length; i++) {
        Map.toggleTile(coords[i][0], coords[i][1]);
    }

    this.cx = x1 + 14;
    this.cy = y1 + 57;

    audioManager.play("sounds/gates_open.wav", 1, false);
};

Gate.prototype = new Enemy();

Gate.prototype.type = 'gate';

Gate.prototype.update = function (du) {
    spatialManager.unregister(this);
    if (this._isDeadNow) return entityManager.KILL_ME_NOW;

    spatialManager.register(this);
};

Gate.prototype.getRadius = function() {
    return 0; // megaman should not collide with us
}

Gate.prototype.render = function (ctx) {
    var origScale = this.sprite.scale;
    this.sprite.scale = this._scale;

    this.sprite.drawWrappedCentredAt(
       ctx, this.cx, this.cy
    );

    this.sprite.scale = origScale;
};