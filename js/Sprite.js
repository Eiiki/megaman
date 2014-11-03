// ============
// SPRITE STUFF
// ============

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

// Construct a "sprite" from the given `image`,
//
var g_megamanFlipSprite = false;
function Sprite(image, sx, sy, width, height) {
    this.sx = sx;
    this.sy = sy;
    this.width = width;
    this.height = height;

    this.image = image;
    this.scale = 1;
}

Sprite.prototype.drawAt = function (ctx, x, y) {
    var w = this.width;
    var h = this.height;
    if(g_megamanFlipSprite) ctx.scale(-1,1);
    ctx.drawImage(this.image, 
                  this.sx, this.sy, w, h,
                  x - w/2, y - h/2, w, h);
    if(g_megamanFlipSprite) ctx.scale(-1,1);
};

Sprite.prototype.drawCentredAt = function (ctx, cx, cy, rotation) {
    if (rotation === undefined) rotation = 0;
    var w = this.width;
    var h = this.height;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotation);
    ctx.scale(this.scale, this.scale);
    
    // drawImage expects "top-left" coords, so we offset our destination
    // coords accordingly, to draw our sprite centred at the origin
    if(g_megamanFlipSprite) ctx.scale(-1,1);
    ctx.drawImage(this.image, 
                  this.sx, this.sy, w, h,
                  -w/2,-h/2, w, h);
    if(g_megamanFlipSprite) ctx.scale(-1,1);
    ctx.restore();
};  

Sprite.prototype.drawWrappedCentredAt = function (ctx, cx, cy, rotation) {
    
    // Get "screen width"
    var sw = g_canvas.width;
    
    // Draw primary instance
    this.drawWrappedVerticalCentredAt(ctx, cx, cy, rotation);
    
    // Left and Right wraps
    //this.drawWrappedVerticalCentredAt(ctx, cx - sw, cy, rotation);
    //this.drawWrappedVerticalCentredAt(ctx, cx + sw, cy, rotation);
};

Sprite.prototype.drawWrappedVerticalCentredAt = function (ctx, cx, cy, rotation) {

    // Get "screen height"
    var sh = g_canvas.height;
    // Draw primary instance
    this.drawCentredAt(ctx, cx, cy, rotation);
    
    // Top and Bottom wraps
    //this.drawCentredAt(ctx, cx, cy - sh, rotation);
    //this.drawCentredAt(ctx, cx, cy + sh, rotation);
};
