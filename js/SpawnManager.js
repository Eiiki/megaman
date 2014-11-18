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

update : function(du) {
	if(global.mapPart === 1){
		if(this._possibleEnemies[0] === 1){
			if(this.canSpawnAgain === true && (global.camX < 200 || global.camX > 800)){
				this._possibleEnemies[0] = 0;
			}
		}
		if(global.camX > 200 && global.camX < 800){
			console.log(this._possibleEnemies);
	        if(this._possibleEnemies[0] === 0){
	            entityManager.generateEnemy('dada', {
	            cx : 700,
	            cy : 3520,
	            velX : 0,
	            velY : -0.5
	            });
	            this._possibleEnemies[0] = 1;
	        }
	    }
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