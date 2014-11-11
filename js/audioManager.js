/*

audioManager.js

*/


"use strict";

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

