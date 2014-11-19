// =====
// SPAWNER
// =====

// spawner relies on the global.mapPart and megamans position to
// pick which enemies should spawn

"use strict";

var Spawner = {
//[lvl1 dada, lvl1 snake, lvl1 snake, lvl1 snake]
_possibleEnemies : [[],[
					{type: 'dada',cx:700, cy:3520,alive:false,canSpawnAgain:true,velX:0,velY:-0.5},
					{type: 'petiteSnakey',cx:648, cy:3560,alive:false,canSpawnAgain:true},
					{type: 'petiteSnakey',cx:1065, cy:3688,alive:false,canSpawnAgain:true},
					{type: 'petiteSnakey',cx:1353, cy:3624,alive:false,canSpawnAgain:true}]
					],

update : function(du) {
	var mp = global.mapPart;
	for(var i = 0; i < this._possibleEnemies.length; i++){
		var posEn = this._possibleEnemies[mp][i];
		if(posEn.alive === false){
			if(posEn.canSpawnAgain === false && 
				(global.camX + 510 < posEn.cx || global.camX > posEn.cx)){
				posEn.canSpawnAgain = true;
			}
		}
		if(global.camX + 510 > posEn.cx && global.camX < posEn.cx){
	        if(posEn.alive === false
	        	&& posEn.canSpawnAgain === true){
	            this.spawnEnemy(mp,i);
	        }
	    }
	}
},

spawnEnemy : function(mapPart,index){
	var posEn = this._possibleEnemies[mapPart][index];
	entityManager.generateEnemy(posEn.type, {
	            cx : posEn.cx,
	            cy : posEn.cy,
	            spawncx : posEn.cx,
	            spawncy : posEn.cy,
	            velX : posEn.velX,
	            velY : posEn.velY,
	            });
	            posEn.alive=true;
	            posEn.canSpawnAgain = false;
},

death : function (deadPos){
	var mp = global.mapPart;
	for(var i = 0; i < this._possibleEnemies.length; i++){
		var posEn = this._possibleEnemies[mp][i];
		if(posEn.cx === deadPos[0]
			&& posEn.cy === deadPos[1])
			posEn.alive = false;
	}
},

render : function(ctx){

}
}