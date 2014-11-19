// =====
// SPAWNER
// =====

// spawner relies on the global.mapPart and megamans position to
// pick which enemies should spawn

"use strict";

var Spawner = {
//[lvl1 dada]
_possibleEnemies : [{type: 'dada',cx:700, cy:3520,alive:false,canSpawnAgain:true,velX:0,velY:-0.5}],

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
		if(this._possibleEnemies[0].alive === false){
			if(this._possibleEnemies[0].canSpawnAgain === false && 
				(global.camX + 510 < this._possibleEnemies[0].cx || global.camX > this._possibleEnemies[0].cx)){
				this._possibleEnemies[0].canSpawnAgain = true;
			}
		}
		if(global.camX + 510 > this._possibleEnemies[0].cx && global.camX < this._possibleEnemies[0].cx){
	        if(this._possibleEnemies[0].alive === false
	        	&& this._possibleEnemies[0].canSpawnAgain === true){
	            this.spawnEnemy(0);
	        }
	    }
	    // spawn petiteSnakeys for map part 1
	    this._prevX = this.spawnPetiteSnakeys(this._prevX);
	}
},

spawnEnemy : function(index){
	entityManager.generateEnemy(this._possibleEnemies[index].type, {
	            cx : this._possibleEnemies[index].cx,
	            cy : this._possibleEnemies[index].cy,
	            spawncx : this._possibleEnemies[index].cx,
	            spawncy : this._possibleEnemies[index].cy,
	            velX : this._possibleEnemies[index].velX,
	            velY : this._possibleEnemies[index].velY,
	            });
	            this._possibleEnemies[index].alive=true;
	            this._possibleEnemies[index].canSpawnAgain = false;
},

death : function (deadPos){
	for(var i = 0; i < this._possibleEnemies.length; i++){
		if(this._possibleEnemies[i].cx === deadPos[0]
			&& this._possibleEnemies[i].cy === deadPos[1])
			this._possibleEnemies[i].alive = false;
	}
},

render : function(ctx){

}
}