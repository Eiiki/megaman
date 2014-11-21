// =========
// MEGAMAN
// =========
/*
A short, less complex, playable version of the classic Megaman
*/

"use strict";

var g_canvas = document.getElementById("myCanvas");
var g_ctx = g_canvas.getContext("2d");

// ===============
// SET AUDIO (and hope it loads maybe)
// ===============
audioManager.set("sounds/snake_man_intro.mp3", "sounds/snake_man_intro.mp3");
audioManager.set("sounds/snake_man.mp3", "sounds/snake_man.mp3");
audioManager.set("sounds/boss_intro.mp3", "sounds/boss_intro.mp3");
audioManager.set("sounds/boss.mp3", "sounds/boss.mp3");
audioManager.set("sounds/title.mp3", "sounds/title.mp3");
audioManager.set("sounds/getWeapon.mp3", "sounds/getWeapon.mp3");
audioManager.set("sounds/megaman_and_boss_dead.wav", "sounds/megaman_and_boss_dead.wav");

// ====================
// CREATE INITIAL SHIPS
// ====================

// function createMegaman() {
//     entityManager.generateMegaman({
//         cx : 4000,
//         cy : 1000,
//         velX : 0,
//         velY : -0.5
//     });
// }
// function createMegaman() {
//     entityManager.generateMegaman({
//         cx:200,
//         cy:3750,
//         velX : 0,
//         velY : -0.5
//     });
// }
function createMegaman() {
    entityManager.generateMegaman({
        cx : 200,
        cy : 3520,
        velX : 0,
        velY : -0.5
    });
}

// =============
// GATHER INPUTS
// =============

function gatherInputs() {
    // Nothing to do here!
    // The event handlers do everything we need for now.
}


// =================
// UPDATE SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `update` routine handles generic stuff such as
// pausing, single-step, and time-handling.
//
// It then delegates the game-specific logic to `updateSimulation`


// GAME-SPECIFIC UPDATE LOGIC

function updateSimulation(du) {
    
    processDiagnostics();
    
    entityManager.update(du);
    g_cloud.update(du);

    if (SNAKEMAN_DEAD) {
        youWin();
    }
    // Prevent perpetual firing!
    //eatKey(Ship.prototype.KEY_FIRE);
}

// GAME-SPECIFIC DIAGNOSTICS

var g_renderSpatialDebug = false; //Red circles
var KEY_SPATIAL = keyCode('X');


function processDiagnostics() {

    if (eatKey(KEY_SPATIAL)) g_renderSpatialDebug = !g_renderSpatialDebug;
}


// =================
// RENDER SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `render` routine handles generic stuff such as
// the diagnostic toggles (including screen-clearing).
//
// It then delegates the game-specific logic to `gameRender`


// GAME-SPECIFIC RENDERING
function renderSimulation(ctx) {
    ctx.save();
    var x = global.megamanX;
    var y = global.megamanY;
    var canvasHalfWidth = g_canvas.width/2;
    var part = global.mapPart; 

    //global.camX = x > g_canvas.width/2 ? x - canvasHalfWidth: 0;

    // all the numbers here are just coordinates on the map image corresponding to
    // the starts and ends of "map parts" which are used to keep track of the current
    // heigt level of the map
    if (x > g_canvas.width/2 && global.shouldTrans) global.camX = x - canvasHalfWidth;
    if (x > 1792 && part === 1 || part === 2 || part === 3 && x < 1792) global.camX = 1792 - canvasHalfWidth;
    if (part === 3 && x > 2817) global.camX = 2817 - canvasHalfWidth;
    if (part === 2 && x < 2817 + canvasHalfWidth && x > 2817 - canvasHalfWidth) global.camX = 2817 - canvasHalfWidth;
    if (part === 2 && x > 2817 && y > 3100) global.camX = x - canvasHalfWidth;
    if (part === 2 && x > 3840 || part === 3 && x > 3200 || part === 4 || part === 5) global.camX = 3840 - canvasHalfWidth;
    if (part === 6 && x < 3840) global.camX = 3840 - canvasHalfWidth;
    if (part === 6 && x < 5122 && !global.shouldTrans) {
        global.camX = x - canvasHalfWidth;
        global.shouldTrans = true;
    }
    if (part === 6 && x > 5377 || part === 7) {
        global.camX = 5377 - canvasHalfWidth;
        global.shouldTrans = false;
    }
    if (part === 7) {
        Map._tiles[33][159] = 1;
        Map._tiles[32][159] = 1;
        Map._tiles[31][159] = 1;
        Map._tiles[30][159] = 1;
        Map._tiles[29][159] = 1;
        Map._tiles[28][159] = 1;
    }
    if (part === 8) global.shouldTrans = true;
    if (part === 8 && x < 5377) global.camX = 5377 - canvasHalfWidth;
    if (part === 8 && x > 8448) global.camX = 8448 - canvasHalfWidth;
    if (part === 8 && global.camX < 8448-canvasHalfWidth && BOSS_STARTED) global.camX = 8448-canvasHalfWidth;
    if (part === 8 && global.camY > 30 && BOSS_STARTED) global.camY = 30;
    if (part === 8 && BOSS_STARTED) {
        global.isTransitioning = false;
    }

    ctx.translate(-global.camX, -global.camY);
    entityManager.render(ctx);
    g_cloud.render(ctx);
    
    if (g_renderSpatialDebug) spatialManager.render(ctx);
    ctx.restore();

    if (SNAKEMAN_DEAD) {
        // won game
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, g_canvas.width, g_canvas.height);
        g_sprites.youWin.drawWrappedCentredAt(
            ctx, g_canvas.width / 2, g_canvas.height / 2
        );
    } 
}

// =============
// PRELOAD STUFF
// =============

var g_images = {};

function requestPreloads() {
    var requiredImages = {
        megaman_sprite : "sprites/8bitmegaman.png",
        megaman_health : "sprites/megaman_health.png",
        bullet_sprite  : "sprites/bullet.png",
        map: "sprites/MegaManIII-SnakeMan-clean.png",
        // AI
        dada          : "sprites/dada.png",
        petiteSnakey  : "sprites/small_frog.png",
        bigSnakey     : "sprites/big_frog.png",
        potton_copter : "sprites/potton_copter.png",
        potton_ball   : "sprites/potton_ball.png",
        bubukan       : "sprites/bubukan_added.png",
        hammer_joe    : "sprites/hammer_joe.png",
        bomb_flier    : "sprites/bomb_flier.png",
        snakeman      : "sprites/snakeman.png",
        snakebullets    : "sprites/snakeman_bullets.png",
        snakeman_health : "sprites/snakeman_health.png",
        jamacy          : "sprites/jamacy.png",
        // MISC
        explosion     : "sprites/explosion.png",
        small_pill    : "sprites/small_pill.png",
        big_life      : "sprites/big_life.png",
        small_life    : "sprites/small_life.png", // life is actually pill
        mistery_box   : "sprites/mistery_box.png",
        snake_part    : "sprites/snake_part.png",
        big_bullet    : "sprites/big_bullet.png",
        cloud         : "sprites/flying_platform.png",
        gate          : "sprites/gate.png",
        youWin        : "sprites/youWin.png"
    };

    imagesPreload(requiredImages, g_images, preloadDone);
}

var g_sprites = {};
var g_cloud;

function preloadDone() {
    initSprites();

    entityManager.init();
    createMegaman();

    // if boss
    /*setTimeout(function() {
        audioManager.pause("sounds/snake_man.mp3");
        audioManager.playByID("sounds/boss_intro.mp3", 0.35, false);
    }, delay);
    setTimeout(function() {
        audioManager.playByID("sounds/boss.mp3", 0.35, true);
    }, 8800 + delay);*/

    /*entityManager.generateEnemy('goodie', {
        cx : 320,
        cy : 3770,
        velX : 0,
        velY : 0
    });
    entityManager.generateEnemy('goodie', {
        cx : 390,
        cy : 3770,
        velX : 0,
        velY : 0
    });*/
    
    /*entityManager.generateEnemy('bubukan', {
        cx : 400,
        cy : 3600,
        velX : 0,
        velY : -0.5
    });*/

    // title screen!!!
    playTitleSong(); // play song
    drawTitleScreen();

    //main.init();
    // listen for KEY_START and then init main
    // see titlescreenend function
    g_cloud = new cloud();
}

function playTitleSong() {
    var delay = 500; // ms
    setTimeout(function(){
        if (!GAME_STARTED) {
            audioManager.playByID("sounds/title.mp3", 0.8, true);
        }
    }, delay);
}

var BOSS_STARTED = false;
function playBossSong() {
    var delay = 500; // ms 
    setTimeout(function() {
        audioManager.pause("sounds/snake_man.mp3");
        audioManager.pause("sounds/snake_man_intro.mp3");
        audioManager.disableByID("sounds/snake_man.mp3"); // in case it hasnt started playing yet
        audioManager.playByID("sounds/boss_intro.mp3", 0.35, false);
    }, delay);
    setTimeout(function() {
        audioManager.playByID("sounds/boss.mp3", 0.35, true);
    }, 8800 + delay);
}

function drawTitleScreen() {
    // yes global ctx whatevs
    g_sprites.titleScreen[0].drawWrappedCentredAt(
        g_ctx, g_canvas.width / 2, g_canvas.height / 2
    );
}

var KEY_START = 13; // ENTER
var KEY_START_ALTER = keyCode(' ');
var GAME_STARTED = false;
// call this function everytime when we hit start, unless
// we've done it once
function titleScreenEnd() {
    audioManager.pause("sounds/title.mp3");
    GAME_STARTED = true;

    // delay both background songs to allow them a bit of time to load to avoid
    // them not playing
    var delay = 0;
    setTimeout(function() {
        audioManager.playByID("sounds/snake_man_intro.mp3", 0.2, false);
    }, delay); 
    setTimeout(function() {
        // setTimeout function is called 3.50 seconds after the code reaches it. That is the time
        // the snake_man_intro.wav takes to finish playing. 
        audioManager.playByID("sounds/snake_man.mp3", 0.2, true);
    }, 3500 + delay);

    main.init();
}

var SNAKEMAN_DEAD = false;
function youWin() {
    var delay = 500; // ms 
    setTimeout(function() { 
        audioManager.pause("sounds/boss.mp3");
        audioManager.playByID("sounds/getWeapon.mp3", 0.7, true);
    }, delay);
    g_isUpdatePaused = true;
}

// Kick it off
requestPreloads();
