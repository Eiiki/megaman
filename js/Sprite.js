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
    this.width = Math.max(1,Math.round(this.width));
    this.height = Math.max(1,Math.round(this.height));
    if (this.width > g_canvas.width) this.width = g_canvas.width;
    if (this.width > g_canvas.height) this.width = g_canvas.height;

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

    // math.round suggested by http://stackoverflow.com/questions/27537963/context-drawimage-working-in-chrome-but-not-in-firefox
    if(flipSprite) ctx.scale(-1,1);
    if(flipSpriteY) ctx.scale(1,-1);
    // try and catch just in case
    try{ctx.drawImage(this.image, 
                  Math.round(this.sx), Math.round(this.sy), w, h,
                  Math.round(-w/2), Math.round(-h/2), w, h);
    } catch (err) {
        //console.log(this);
    }
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
