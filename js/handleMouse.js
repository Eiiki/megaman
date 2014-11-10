// ==============
// MOUSE HANDLING
// ==============

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

var g_mouseX = 0,
    g_mouseY = 0;

function handleMouse(evt) {
    
    g_mouseX = evt.clientX - g_canvas.offsetLeft + document.body.scrollLeft
            + document.documentElement.scrollLeft;
    g_mouseY = evt.clientY - g_canvas.offsetTop + document.body.scrollTop
            + document.documentElement.scrollTop;

    // býr til nýjan tile í map eða fjarlægir hann
    if (evt.which) if (g_makeTiles) Map.toggleTile(g_mouseX + global.camX, g_mouseY);
    
    // If no button is being pressed, then bail
    var button = evt.buttons === undefined ? evt.which : evt.buttons;
    if (button){ return; }
}

// Handle "down" and "move" events the same way.
window.addEventListener("mousedown", handleMouse);
window.addEventListener("mousemove", handleMouse);
