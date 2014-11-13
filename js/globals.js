// =======
// GLOBALS
// =======
/*

Evil, ugly (but "necessary") globals, which everyone can use.

*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

var g_canvas = document.getElementById("myCanvas");
var g_ctx = g_canvas.getContext("2d");

// The "nominal interval" is the one that all of our time-based units are
// calibrated to e.g. a velocity unit is "pixels per nominal interval"
//
var NOMINAL_UPDATE_INTERVAL = 16.666;

// Multiply by this to convert seconds into "nominals"
var SECS_TO_NOMINALS = 1000 / NOMINAL_UPDATE_INTERVAL;

var global = {
	megamanHeight : 45,
	megamanWidth  : 28,
	megamanX : 0,
	megamanY : 0,
	camX : 0,
	camY : 3392,
	fellOffEdge: false,

	mapHeight: 3392 - 7 * 480 // þetta er camY - sjöföld hæð canvasins
};
