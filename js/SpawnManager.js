// =====
// SPAWNER
// =====

// spawner relies on the global.mapPart and megamans position to
// pick which enemies should spawn

"use strict";

var Spawner = {
//[lvl1 dada]
_possibleEnemies : [0],
canSpawnAgain    : false,

// special handling stuff for the petiteSnakeys
_petiteSnakeys : [],
_prevX : 0,

spawnPetiteSnakeys : function(prevX) {
    var xLeft = global.camX;
    var xRight = xLeft + g_canvas.width;
    var coords = global.petiteSnakeysCoords;
    //this is the halfwidth of the petiteSnakeySprite
    // will be used to adjust spawning visuals
    var hw = 30;
    for (var i = 1; i < coords.length; i++) {
	    // left and right edges of the petiteSnakey sprite
	    var leftEdge = coords[i].cx
	    var rightEdge = coords[i].cx

	    if (xRight > leftEdge && xLeft < leftEdge && !this._petiteSnakeys[i]) {
	    	coords[i].isFlipped = prevX > leftEdge ? true : false;
	    	
	    	this._petiteSnakeys[i] = entityManager.generateEnemy('petiteSnakey',
	    		coords[i]
	    	)
	    }
	   	if ((xLeft > leftEdge || xRight < leftEdge) && this._petiteSnakeys[i]) {
	    	this._petiteSnakeys[i].kill();
	    	delete this._petiteSnakeys[i];
	    }
	}
	return xLeft;
},

update : function(du) {
	if(global.mapPart === 1){
		if(this._possibleEnemies[0] === 1){
			if(this.canSpawnAgain === true && (global.camX < 200 || global.camX > 800)){
				this._possibleEnemies[0] = 0;
			}
		}
		if(global.camX > 200 && global.camX < 800){
	        if(this._possibleEnemies[0] === 0){
	            this._possibleEnemies[0] = 1;
	            this.canSpawnAgain=false;
	            entityManager.generateEnemy('dada', {
	            cx : 700,
	            cy : 3520,
	            velX : 0,
	            velY : -0.5
	            });
	        }
	    }
	    // spawn petiteSnakeys for map part 1
	    this._prevX = this.spawnPetiteSnakeys(this._prevX);
	}
},

death : function (enemiesLeft){
	if(global.mapPart === 1){
		if(enemiesLeft < 1){
			this.canSpawnAgain = true;
		}
	}
},

render : function(ctx){

}
}