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

    // This needs better implementation
    var w = entity.width  || entity.sprite.width * entity._scale,
        h = entity.height || entity.sprite.height * entity._scale;

    this._entities[spatialID] = {
        posX   : pos.posX - w/2,
        posY   : pos.posY - h/2,
        width  : w,
        height : h,
        entity : entity
    };
},

unregister: function(entity) {
    var spatialID = entity.getSpatialID();

    // This needs better implementation
    delete this._entities[spatialID];
},

findEntityInRange: function(posX, posY, radius) {
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
