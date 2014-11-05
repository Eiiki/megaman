/*

spatialManager.js

A module which handles spatial lookup, as required for...
e.g. general collision detection.

*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

var spatialManager = {

// "PRIVATE" DATA

_nextSpatialID : 1, // make all valid IDs non-falsey (i.e. don't start at 0)

_entities : [],

// "PRIVATE" METHODS
//
// <none yet>

// PUBLIC METHODS

getNewSpatialID : function() {

    // TODO: YOUR STUFF HERE!
    return this._nextSpatialID++;
},

register: function(entity) {
    var pos = entity.getPos();
    var spatialID = entity.getSpatialID();

    // TODO: YOUR STUFF HERE!
    var w = entity.sprite.width * entity._scale,
        h = entity.sprite.height * entity._scale;
    var thisEntity = {
        posX   : pos.posX - w/2,
        posY   : pos.posY - h/2,
        width  : w,
        height : h
    };

    this._entities[spatialID] = thisEntity;
},

unregister: function(entity) {
    var spatialID = entity.getSpatialID();

    // TODO: YOUR STUFF HERE!
    var e = this._entities[spatialID];
    if(e){
        e.posY = undefined;
        e.posX = undefined;
    }
},

findEntityInRange: function(posX, posY, radius) {

    // TODO: YOUR STUFF HERE!
    entityManager.deferredSetup();
    /*
    var entities = entityManager._categories;
    var closest,
        closestPos = Number.POSITIVE_INFINITY,
        indx,
        theCategory;

    for(var c = 0; c < entities.length; c++){
        var aCategory = entities[c];
        var i = 0;
        while (i < aCategory.length) {
            var e = aCategory[i];

            //Checking if the object collides with it self, we don't want that to happen
            if(e.cx === posX && e.cy === posY){
                i++;
                continue;
            }
            var distBetween =   util.wrappedDistSq(
                                    posX, posY,
                                    e.cx, e.cy,
                                    g_canvas.width, g_canvas.height
                                );
            if(distBetween < closestPos){
                indx = i;
                theCategory = aCategory;
                closest = e;
                closestPos = distBetween;
            }
            i++;
        }
    }

    if( util.circlesCollides(posX, posY, radius, closest.cx, closest.cy, closest.getRadius()) ){
        return closest;
    }
    */
    return false;
},

render: function(ctx) {
    var oldStyle = ctx.strokeStyle;
    ctx.strokeStyle = "red";

    for (var ID in this._entities) {
        var e = this._entities[ID];
        util.strokeBox(ctx,e.posX, e.posY, e.width, e.height);
    }
    ctx.strokeStyle = oldStyle;
}

}
