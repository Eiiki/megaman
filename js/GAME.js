// =========
// MEGAMAN
// =========
/*

A short, less complex, playable version of the Megaman

*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

var g_canvas = document.getElementById("myCanvas");
var g_ctx = g_canvas.getContext("2d");

// ====================
// CREATE INITIAL SHIPS
// ====================

function createMegaman() {

    entityManager.generateMegaman({
        cx : 100,
        cy : 100
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

    entityManager.render(ctx);
    
    if (g_renderSpatialDebug) spatialManager.render(ctx);
}


// =============
// PRELOAD STUFF
// =============

var g_images = {};

function requestPreloads() {

    var requiredImages = {
        megaman_sprite : "sprites/8bitmegaman.png"
    };

    imagesPreload(requiredImages, g_images, preloadDone);
}

var g_sprites = {};

function preloadDone() {
    //Sprite(image, sx, sy, width, height)
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

    g_sprites.bullet = new Sprite(
        g_images.megaman_sprite,
        103,10,
        21,24
    );

    //g_sprites.bullet = new Sprite(g_images.ship);
    //g_sprites.bullet.scale = 0.25;

    entityManager.init();
    createMegaman();

    main.init();
}

// Kick it off
requestPreloads();