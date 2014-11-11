/*

entityManager.js

A module which handles arbitrary entity-management for "Asteroids"


We create this module as a single global object, and initialise it
with suitable 'data' and 'methods'.

"Private" properties are denoted by an underscore prefix convention.

*/


"use strict";


// Tell jslint not to complain about my use of underscore prefixes (nomen),
// my flattening of some indentation (white), or my use of incr/decr ops 
// (plusplus).
//
/*jslint nomen: true, white: true, plusplus: true*/


var audioManager = {

play : function(path, vol, loop) {
    if (vol === undefined) vol = 1;
    if (loop === undefined) loop = false;
    var audio = new Audio(path);
    audio.volume = vol;
    audio.loop = loop;
    audio.play();
}

};

