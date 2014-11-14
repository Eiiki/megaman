// =========
// MEGAMAN
// =========
/*
A short, less complex, playable version of the classic Megaman
*/

"use strict";

var g_canvas = document.getElementById("myCanvas");
var g_ctx = g_canvas.getContext("2d");

// ====================
// CREATE INITIAL SHIPS
// ====================

function createMegaman() {
    entityManager.generateMegaman({
        cx : 100,
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
    //ctx.scale(0.1,0.1);
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
        brick : "sprites/TileBrick.jpg",
        map: "sprites/MegaManIII-SnakeMan-clean.png"
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
            14,45,
            31,24
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

    g_sprites.megaman_health = new Sprite(
        g_images.megaman_health
    );

    g_sprites.map = new Sprite(
        g_images.map
    );

    g_sprites.bullet = new Sprite(
        g_images.bullet_sprite
    );

    g_sprites.brick = new Sprite(
        g_images.brick
    );

    //g_sprites.bullet = new Sprite(g_images.ship);
    //g_sprites.bullet.scale = 0.25;

    entityManager.init();
    createMegaman();
    audioManager.play("sounds/snake_man_intro.wav", 0.2, false); 
    // start playing after the intro
    setTimeout(function() {
        audioManager.play("sounds/snake_man.mp3", 0.2, true); // bg music
    }, 3650); // snake_man_intro.wav is 3.5 secs. So the 3650 ms is a magic number to make it sound good (poor I know)

    main.init();
}

// Kick it off
requestPreloads();