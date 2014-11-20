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


var entityManager = {

// "PRIVATE" DATA

_character  : [],
_enemies    : [],
_bullets    : [],
_MAP        : [Map],
_spawner    : [Spawner],

// "PRIVATE" METHODS

_forEachOf: function(aCategory, fn) {
    for (var i = 0; i < aCategory.length; ++i) {
        fn.call(aCategory[i]);
    }
},

// PUBLIC METHODS

// A special return value, used by other objects,
// to request the blessed release of death!
//
KILL_ME_NOW : -1,

// Some things must be deferred until after initial construction
// i.e. thing which need `this` to be defined.
//
deferredSetup : function () {
    this._categories = [this._MAP, this._bullets, this._character, this._spawner, this._enemies];
},

init: function() {
    //this.generateMegaman();
},

fireBullet: function(cx, cy, velX, velY, creator, flip) {
    if (flip === 'undefined') flip = false;

    this._bullets.push(new Bullet({
        cx   : cx,
        cy   : cy,
        velX : velX,
        velY : velY,
        creator : creator,
        isFlipped : flip
    }));
},

generateMegaman : function(descr) {
    this._character.push(new Megaman(descr));
},

generateEnemy : function(type, descr) {
    if (type === 'dada'){
        this._enemies.push(new Dada(descr));
    }
    if (type === 'petiteSnakey') {
        var entity = new petiteSnakey(descr);
        this._enemies.push(entity);
        // I need access to the enemy entity for de-spawning purposes
        return entity;
    }
    if (type === 'bigsnakey') {
        var entity = new bigSnakey(descr);
        this._enemies.push(entity);
        // I need access to the enemy entity for de-spawning purposes
        return entity;
    }
    if (type === 'hammer_joe') {
        this._enemies.push(new hammerJoe(descr));
    }
    if (type === 'potton'){
        this._enemies.push(new Potton(descr));
    }
    if (type === 'potton_ball'){
        this._enemies.push(new Potton_ball(descr));
    }
    if (type === 'explosion'){
        this._enemies.push(new Explosion(descr));
    }
    if (type === 'goodie') {
        this._enemies.push(new Goodie(descr));
    }
    if (type === 'big_life'){
        this._enemies.push(new Goodie(descr,type));
    }
    if (type === 'bubukan'){
        this._enemies.push(new Bubukan(descr));
    }
    if (type === 'bubukan_stick'){
        this._enemies.push(new Bubukan_stick(descr));
    }
    if (type === 'misteryBox'){
        this._enemies.push(new misteryBox(descr));
    }
    if (type === 'snakeman') {
        this._enemies.push(new Snakeman(descr));
    }
    if (type === 'snakebullet') {
        this._enemies.push(new SnakeBullet(descr));
    }
    if (type === 'bomb_flier') {
        this._enemies.push(new bomb_flier(descr));
    }
    if (type === 'gate') {
        this._enemies.push(new Gate(descr));
    }
},

yoinkMegamanToPos : function(xPos, yPos) {
    /*
    var theMegaman = the megaman object;
    if (theMegaman) {
        theMegaman.setPos(xPos, yPos);
    }
    */
},

update: function(du) {
    if(this._enemies.length !== 0){
        for(var i = 0; i < this._enemies.length; i++){
            var Baddie = this._enemies[i];
            if(Baddie.cx > global.camX + 710 || Baddie.cx < global.camX-200){
                if (Baddie.type !== 'snakeman') {
                    Baddie.kill();
                }
            }
            if(global.camY+960 < Baddie.cy || global.camY-480 > Baddie.cy){
                if (Baddie.type !== 'snakeman') {
                    Baddie.kill();
                }
            }
        }
    }
    for (var c = 0; c < this._categories.length; ++c) {

        var aCategory = this._categories[c];
        var i = 0;

        while (i < aCategory.length) {

            var status = aCategory[i].update(du);

            if (status === this.KILL_ME_NOW) {
                // remove the dead guy, and shuffle the others down to
                // prevent a confusing gap from appearing in the array
                var pos = [aCategory[i].spawncx,aCategory[i].spawncy];
                Spawner.death(pos);
                aCategory.splice(i,1);
            }
            else {
                ++i;
            }
        }
    }

},

render: function(ctx) {

    var debugX = 10, debugY = 100;

    for (var c = 0; c < this._categories.length; ++c) {

        var aCategory = this._categories[c];

        for (var i = 0; i < aCategory.length; ++i) {
            aCategory[i].render(ctx);
        }
        debugY += 10;
    }
}

};

// Some deferred setup which needs the object to have been created first
entityManager.deferredSetup();

