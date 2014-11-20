
function cloud() {
    this.sprite = g_sprites.cloud[0];
    this.clouds = [
        {cx : 5953, cy : 310 },
        {cx : 6338, cy : 342 },
        {cx : 6370, cy : 246 },
        {cx : 6721, cy : 246 },
    ];

    this.dt = 0;
    this.spriteIndex = 0;
    this.offSets = [0, -2];
    this.offSet;
};

cloud.prototype._updateSprite = function () {
    var i = this.spriteIndex;
    
    this.sprite = g_sprites.cloud[i];
    this.offSet = this.offSets[i];

    if (this.dt >= 5) {
        i++;
        this.dt = 0;
        if (i >= 2) i = 0;
    }

    this.spriteIndex = i;
};

cloud.prototype.update = function(du) {
    this.dt += du;

    this._updateSprite();
}


cloud.prototype.render = function (ctx) {
    var clouds = this.clouds;
    var offSet = this.offSet;

    for (var i = 0; i < clouds.length; i++) {
        var cx = clouds[i].cx;
        var cy = clouds[i].cy;

        this.sprite.drawWrappedCentredAt(ctx, cx + offSet, cy, false, false);
    }
};