// util.js
//
// A module of utility functions, with no private elements to hide.
// An easy case; just return an object containing the public stuff.

"use strict";


var util = {

// COLLISIONS
// ======

//Return true iff. circle1 and circle2 collides
circlesCollides : function(x1, y1, r1, x2, y2, r2){
    //(R0-R1)^2 <= (x0-x1)^2+(y0-y1)^2 <= (R0+R1)^2
    var r_diff = util.square(r1-r2);
    var r_sum  = util.square(r1+r2);
    var x_diff = util.square(x1-x2);
    var y_diff = util.square(y1-y2);

    var coord_diffs = x_diff + y_diff;

    return r_diff <= coord_diffs && coord_diffs <= r_sum;
},
// RANGES
// ======

clampRange: function(value, lowBound, highBound) {
    if (value < lowBound) {
	value = lowBound;
    } else if (value > highBound) {
	value = highBound;
    }
    return value;
},

wrapRange: function(value, lowBound, highBound) {
    while (value < lowBound) {
	value += (highBound - lowBound);
    }
    while (value > highBound) {
	value -= (highBound - lowBound);
    }
    return value;
},

isBetween: function(value, lowBound, highBound) {
    if (value < lowBound) { return false; }
    if (value > highBound) { return false; }
    return true;
},
almostEqual: function(value, compareValue){
    return Math.abs(this.square(value) - this.square(compareValue)) < 0.1;
},

// RANDOMNESS
// ==========

randRange: function(min, max) {
    return (min + Math.random() * (max - min));
},


// MISC
// ====

square: function(x) {
    return x*x;
},

// orientation true if left
dirToRad: function(dir, orientation) {
    var circle = consts.FULL_CIRCLE;
    if (orientation) {
        if (dir === 'down') {
            return 3 * circle / 4;
        } else if (dir === 'left') {
            return 0;
        } else if (dir === 'up') {
            return 1 * circle / 4;
        } else if (dir ==='right') {
            return circle / 2;
        }
    } else {
        if (dir === 'down') {
            return 1 * circle / 4;
        } else if (dir === 'left') {
            return circle / 2;
        } else if (dir === 'up') {
            return 3 * circle / 4;
        } else if (dir ==='right') {
            return 0;
        }
    }
    return 0;
},

// DISTANCES
// =========

distSq: function(x1, y1, x2, y2) {
    return this.square(x2-x1) + this.square(y2-y1);
},

wrappedDistSq: function(x1, y1, x2, y2, xWrap, yWrap) {
    var dx = Math.abs(x2-x1),
	dy = Math.abs(y2-y1);
    if (dx > xWrap/2) {
	dx = xWrap - dx;
    };
    if (dy > yWrap/2) {
	dy = yWrap - dy;
    }
    return this.square(dx) + this.square(dy);
},

// SOUNDS
// ======
playSoundNow: function(sound, delay){
    if(delay === undefined) delay = 0;
    
    if(sound.currentTime > delay){
        //Stops the current sound and plays it from beginning
        sound.pause();
        sound.currentTime = 0;
    }
    sound.play();
},


// CANVAS OPS
// ==========

clearCanvas: function (ctx) {
    var prevfillStyle = ctx.fillStyle;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = prevfillStyle;
},

strokeCircle: function (ctx, x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();
},

fillCircle: function (ctx, x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
},

strokeBox: function(ctx, x, y, w, h){
    ctx.beginPath();
    ctx.rect(x,y,w,h);
    ctx.stroke();
},

fillBox: function (ctx, x, y, w, h, style) {
    var oldStyle = ctx.fillStyle;
    ctx.fillStyle = style;
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = oldStyle;
}

};
