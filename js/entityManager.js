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

fireBullet: function(cx, cy, velX, velY, creator) {
    this._bullets.push(new Bullet({
        cx   : cx,
        cy   : cy,
        velX : velX,
        velY : velY,
        creator : creator
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
    if (type === 'potton'){
        this._enemies.push(new Potton(descr));
    }
    if (type === 'potton_ball'){
        this._enemies.push(new Potton_ball(descr));
    }
    if (type === 'explosion'){
        this._enemies.push(new Explosion(descr));
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
    for (var c = 0; c < this._categories.length; ++c) {

        var aCategory = this._categories[c];
        var i = 0;

        while (i < aCategory.length) {

            var status = aCategory[i].update(du);

            if (status === this.KILL_ME_NOW) {
                // remove the dead guy, and shuffle the others down to
                // prevent a confusing gap from appearing in the array
                aCategory.splice(i,1);
                Spawner.death(this._enemies.length);
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

