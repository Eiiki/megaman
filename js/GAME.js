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

// ====================
// CREATE INITIAL SHIPS
// ====================

function createMegaman() {
    entityManager.generateMegaman({
        cx : 200,
        cy : 3720,
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

    global.camX = x > g_canvas.width/2 ? x - canvasHalfWidth: 0;

    // all the numbers here are just coordinates on the map image corresponding to
    // the starts and ends of "map parts" which are used to keep track of the current
    // heigt level of the map
    if (x > g_canvas.width/2) global.camX = x - canvasHalfWidth;
    if (x > 1792 && part === 1 || part === 2 || part === 3 && x < 1792) global.camX = 1792 - canvasHalfWidth;
    if (part === 3 && x > 2817) global.camX = 2817 - canvasHalfWidth;
    if (part === 2 && x < 2817 + canvasHalfWidth && x > 2817 - canvasHalfWidth) global.camX = 2817 - canvasHalfWidth;
    if (part === 2 && x > 2817 && y > 3100) global.camX = x - canvasHalfWidth;
    if (part === 2 && x > 3840 || part === 3 && x > 3200 || part === 4 || part === 5) global.camX = 3840 - canvasHalfWidth;
    if (part === 6 && x < 3840) global.camX = 3840 - canvasHalfWidth;
    if (part === 6 && x > 5377 || part === 7) global.camX = 5377 - canvasHalfWidth;
    if (part === 8 && x < 5377) global.camX = 5377 - canvasHalfWidth;
    if (part === 8 && x > 8448) global.camX = 8448 - canvasHalfWidth;

    ctx.translate(-global.camX, -global.camY);
    entityManager.render(ctx);
    
    if (g_renderSpatialDebug) spatialManager.render(ctx);
    ctx.restore();
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
        dada : "sprites/dada.png",
        petiteSnakey : "sprites/small_frog.png",
        potton_copter : "sprites/potton_copter.png",
        potton_ball : "sprites/potton_ball.png",
        explosion : "sprites/explosion.png",
        small_pill : "sprites/small_pill.png"
    };

    imagesPreload(requiredImages, g_images, preloadDone);
}

var g_sprites = {};

function preloadDone() {
    //Sprite(image, sourceX, sourceY, width, height)
    g_sprites.megaman_still = new Sprite(
        g_images.megaman_sprite,
        103,10,
        21,24
    );
    g_sprites.megaman_jump = new Sprite(
        g_images.megaman_sprite,
        265,4,
        26,30
    );
    g_sprites.megaman_invulnerable = new Sprite(
        g_images.megaman_sprite,
        280, 45,
        30, 30
    );
    g_sprites.megaman_explosion = new Sprite(
        g_images.megaman_sprite,
        272, 275,
        50, 55
    );
    g_sprites.megaman_running = [
        new Sprite(
            g_images.megaman_sprite,
            188,12,
            24,22
        ),
        new Sprite(
            g_images.megaman_sprite,
            218,10,
            16,24
        ),
        new Sprite(
            g_images.megaman_sprite,
            239,12,
            21,22
        ),
        new Sprite(
            g_images.megaman_sprite,
            218,10,
            16,24
        )

    ];
    
    g_sprites.megaman_climbing = [
        new Sprite(
            g_images.megaman_sprite,
            61,245,
            20,32
        ),
        new Sprite(
            g_images.megaman_sprite,
            84,245,
            20,32
        )
    ];

    g_sprites.megaman_fire = {
        still : new Sprite(
            g_images.megaman_sprite,
            4,45,
            41,26
        ),
        running : [
            new Sprite(
                g_images.megaman_sprite,
                50,48,
                29,22
            ),
            new Sprite(
                g_images.megaman_sprite,
                84,46,
                26,24
            ),
            new Sprite(
                g_images.megaman_sprite,
                113,48,
                30,22
            ),
            new Sprite(
                g_images.megaman_sprite,
                84,46,
                26,24
            )
        ],
        jumping : new Sprite(
            g_images.megaman_sprite,
            146, 40,
            29,30
        )
    };

    // ==========
    // AI sprites
    // ==========
    g_sprites.dada_moving = [
        new Sprite(
            g_images.dada,
            0, 0,
            85, 92
        ),
        new Sprite(
            g_images.dada,
            90, 0,
            85, 92
        ),
        new Sprite(
            g_images.dada,
            175, 0,
            85, 92
        ),
        new Sprite(
            g_images.dada,
            265, 0,
            85, 92
        )
    ];

    g_sprites.petiteSnakey = [
        new Sprite(
            g_images.petiteSnakey,
            0, 0,
            30, 25, 2
        ),
        new Sprite(
            g_images.petiteSnakey,
            32, 0,
            30, 25, 2
        ),
        new Sprite(
            g_images.petiteSnakey,
            64, 0,
            30, 25, 2
        )
    ];

    g_sprites.potton_copter = [
        new Sprite(
            g_images.potton_copter,
            -1, 0,
            23, 20
        ),
        new Sprite(
            g_images.potton_copter,
            23, 0,
            25, 20
        )
    ];
    g_sprites.potton_ball = [
        new Sprite(
            g_images.potton_ball,
            0, 0,
            20, 25
        ),
        new Sprite(
            g_images.potton_ball,
            22, 0,
            25, 25
        )
    ];    
    g_sprites.explosion = [
        new Sprite(
            g_images.explosion,
            0, 0,
            16, 16
        ),
        new Sprite(
            g_images.explosion,
            16, 0,
            16, 16
        ),
        new Sprite(
            g_images.explosion,
            32, 0,
            16, 16
        ),
        new Sprite(
            g_images.explosion,
            48, 0,
            16, 16
        )
    ];

    g_sprites.small_pill = [
        new Sprite(
            g_images.small_pill,
            1, 0,
            12, 10
        ),
        new Sprite(
            g_images.small_pill,
            13, 0,
            12, 10
        )
    ];

    g_sprites.megaman_health = new Sprite(
        g_images.megaman_health
    );

    g_sprites.map = new Sprite(
        g_images.map
    );

    g_sprites.bullet = new Sprite(
        g_images.bullet_sprite
    );

    g_sprites.titleScreen = [
        new Sprite(
            g_images.map,
            14, 14,
            260, 244,
            1.98
        ),
        new Sprite(
            g_images.map,
            274, 14,
            260, 244,
            1.98
        )
    ];

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

    entityManager.generateEnemy('potton', {
        cx : 1800,
        cy : 3120
    });
    entityManager.generateEnemy('potton', {
        cx : 1800,
        cy : 3020
    });

    entityManager.generateEnemy('goodie', {
        cx : 320,
        cy : 3770,
        velX : 0,
        velY : 0
    });
    entityManager.generateEnemy('goodie', {
        cx : 350,
        cy : 3770,
        velX : 0,
        velY : 0
    });
    entityManager.generateEnemy('goodie', {
        cx : 390,
        cy : 3770,
        velX : 0,
        velY : 0
    });

    // title screen!!!
    playTitleSong(); // play song
    drawTitleScreen();

    //main.init();
    // listen for KEY_START and then init main
    // see titlescreenend function
}

function playTitleSong() {
    var delay = 500; // ms
    setTimeout(function(){
        if (!GAME_STARTED) {
            audioManager.playByID("sounds/title.mp3", 0.8, true);
        }
    }, delay);
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

// Kick it off
requestPreloads();
