// =================
// KEYBOARD HANDLING
// =================

var keys = [];
var keyUpKeys = [];

function handleKeydown(evt) {
    keys[evt.keyCode] = true;
    keyUpKeys[evt.keyCode] = false;

    var eatStart = eatKey(KEY_START);
    var eatStartAlter = eatKey(KEY_START_ALTER);
    if ((eatStart || eatStartAlter) && !GAME_STARTED) {
        titleScreenEnd();
    }
}

function handleKeyup(evt) {
    keys[evt.keyCode] = false;
    keyUpKeys[evt.keyCode] = true;
}

// Inspects, and then clears, a key's state
//
// This allows a keypress to be "one-shot" e.g. for toggles
// ..until the auto-repeat kicks in, that is.
//
function eatKey(keyCode) {
    var isDown = keys[keyCode];
    keys[keyCode] = false;
    return isDown;
}

// A tiny little convenience function
function keyCode(keyChar) {
    return keyChar.charCodeAt(0);
}

window.addEventListener("keydown", handleKeydown);
window.addEventListener("keyup", handleKeyup);
