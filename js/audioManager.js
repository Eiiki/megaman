/*

audioManager.js

can set songs with ID and then play them by those ID's

*/


"use strict";

var audioManager = {

_audio : {},

set : function(path, ID) {
    this._audio[ID] = new Audio(path);
},

play : function(path, vol, loop) {
    if (vol === undefined) vol = 1;
    if (loop === undefined) loop = false;
    var audio = new Audio(path);
    audio.volume = vol;
    audio.loop = loop;
    audio.play();
},

playByID : function(ID, vol, loop) {
    if (vol === undefined) vol = 1;
    if (loop === undefined) loop = false;

    this._audio[ID].volume = vol;
    this._audio[ID].loop = loop;
    this._audio[ID].play();
},

pause : function(ID) {
    this._audio[ID].pause();
}

};