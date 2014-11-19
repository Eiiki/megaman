// ============
// SPRITE STUFF
// ============

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

// Construct a "sprite" from the given `image`,
//
function Sprite(image, sx, sy, width, height, scale) {
    if(sx === undefined) sx = 0;
    if(sy === undefined) sy = 0;
    if(scale === undefined) scale = 1;

    this.sx = sx;
    this.sy = sy;
    this.width = width || image.width;
    this.height = height || image.height;

    this.image = image;
    this.scale = scale;
};

Sprite.prototype.drawCentredAt = function (ctx, cx, cy, flipSprite, flipSpriteY, rotation) {
    if (rotation === undefined) rotation = 0;
    var w = this.width;
    var h = this.height;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotation);
    ctx.scale(this.scale, this.scale);
    
    // drawImage expects "top-left" coords, so we offset our destination
    // coords accordingly, to draw our sprite centred at the origin

    if(flipSprite) ctx.scale(-1,1);
    if(flipSpriteY) ctx.scale(1,-1);
    ctx.drawImage(this.image, 
                  this.sx, this.sy, w, h,
                  -w/2,-h/2, w, h);
    if(flipSpriteY) ctx.scale(1,-1);
    if(flipSprite) ctx.scale(-1,1);
    ctx.restore();
};

Sprite.prototype.drawWrappedCentredAt = function (ctx, cx, cy, flipSprite, flipSpriteY, rotation) {
    
    // Get "screen width"
    var sw = g_canvas.width;
    
    // Draw primary instance
    this.drawWrappedVerticalCentredAt(ctx, cx, cy, flipSprite, flipSpriteY, rotation);
    
    // Left and Right wraps
    //this.drawWrappedVerticalCentredAt(ctx, cx - sw, cy, flipSprite, rotation);
    //this.drawWrappedVerticalCentredAt(ctx, cx + sw, cy, flipSprite, rotation);
};

Sprite.prototype.drawWrappedVerticalCentredAt = function (ctx, cx, cy, flipSprite, flipSpriteY, rotation) {

    // Get "screen height"
    var sh = g_canvas.height;
    // Draw primary instance
    this.drawCentredAt(ctx, cx, cy, flipSprite, flipSpriteY, rotation);
    
    // Top and Bottom wraps
    //this.drawCentredAt(ctx, cx, cy - sh, flipSprite, rotation);
    //this.drawCentredAt(ctx, cx, cy + sh, flipSprite, rotation);
};
