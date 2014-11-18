// =====
// SPAWNER
// =====

// spawner relies on the global.mapPart and megamans position to
// pick which enemies should spawn

"use strict";

var Spawner = {
	//[lvl1 dada]
	_possibleEnemies : [0],

update : function(du) {
	if(global.mapPart === 1){
		if(global.camX > 200 && global.camX < 800){
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
			if(global.camX < 200 || global.camX > 800){
				this._possibleEnemies[0] = 0;
			}
		}
	}
},

render : function(ctx){

}
}