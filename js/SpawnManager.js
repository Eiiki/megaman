// =====
// SPAWNER
// =====

// spawner relies on the global.mapPart and megamans position to
// pick which enemies should spawn

"use strict";

var Spawner = {
//[lvl1 dada, lvl1 snake, lvl1 snake, lvl1 snake]
_possibleEnemies : [{type: 'dada',cx:700, cy:3520,alive:false,canSpawnAgain:true,velX:0,velY:-0.5},
					{type: 'petiteSnakey',cx:648, cy:3560,alive:false,canSpawnAgain:true,velX:0,velY:0},
					{type: 'petiteSnakey',cx:1065, cy:3688,alive:false,canSpawnAgain:true,velX:0,velY:0},
					{type: 'petiteSnakey',cx:1353, cy:3624,alive:false,canSpawnAgain:true,velX:0,velY:0}],

update : function(du) {
	if(global.mapPart === 1){
		for(var i = 0; i < this._possibleEnemies.length; i++){
			if(this._possibleEnemies[i].alive === false){
				if(this._possibleEnemies[i].canSpawnAgain === false && 
					(global.camX + 510 < this._possibleEnemies[i].cx || global.camX > this._possibleEnemies[i].cx)){
					this._possibleEnemies[i].canSpawnAgain = true;
				}
			}
			if(global.camX + 510 > this._possibleEnemies[i].cx && global.camX < this._possibleEnemies[i].cx){
		        if(this._possibleEnemies[i].alive === false
		        	&& this._possibleEnemies[i].canSpawnAgain === true){
		            this.spawnEnemy(i);
		        }
		    }
		}
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