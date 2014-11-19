// =====
// SPAWNER
// =====

// spawner relies on the global.mapPart and megamans position to
// pick which enemies should spawn

"use strict";

var Spawner = {
//[lvl1 dada, lvl1 snake, lvl1 snake, lvl1 snake]
_possibleEnemies : [[],[
						{type: 'dada',cx:590, cy:3620,alive:false,canSpawnAgain:true,velX:0,velY:-0.5},
						{type: 'petiteSnakey',cx:648, cy:3560,alive:false,canSpawnAgain:true},
						{type: 'dada',cx:900, cy:3750,alive:false,canSpawnAgain:true,velX:0,velY:-0.5},
						{type: 'petiteSnakey',cx:1065, cy:3688,alive:false,canSpawnAgain:true},
						{type: 'petiteSnakey',cx:1353, cy:3624,alive:false,canSpawnAgain:true},
						{type: 'dada',cx:1520, cy:3580,alive:false,canSpawnAgain:true,velX:0,velY:-0.5},
						{type: 'dada',cx:1884, cy:3750,alive:false,canSpawnAgain:true,velX:0,velY:-0.5}],
					[
						{type: 'petiteSnakey',cx:1832, cy:3208,alive:false,canSpawnAgain:true,isFlipped:true},
						{type: 'petiteSnakey',cx:1768, cy:3144,alive:false,canSpawnAgain:true,isFlipped:true},
						{type: 'petiteSnakey',cx:1704, cy:3080,alive:false,canSpawnAgain:true,isFlipped:true}],
					[
						{type: 'bigsnakey', cx: 1972, cy: 2536, alive: false, canSpawnAgain: true},
						{type: 'potton',cx:2400, cy:2460,alive:false,canSpawnAgain:true},
						{type: 'petiteSnakey',cx:2440, cy:2644,alive:false,canSpawnAgain:true,flippY:true},
						{type: 'petiteSnakey',cx:2504, cy:2708,alive:false,canSpawnAgain:true,flippY:true},
						{type: 'potton',cx:2800, cy:2742,alive:false,canSpawnAgain:true},
						{type: 'petiteSnakey', cx: 2889, cy: 2794, alive: false, canSpawnAgain: true},
						{type: 'potton',cx:2950, cy:2742,alive:false,canSpawnAgain:true},
						{type: 'big_life',cx:2704,cy:2550, velX:0,velY:0,alive:false,canSpawnAgain:true,oneTime:false},
						{type: 'big_life',cx:2832,cy:2550, velX:0,velY:0,alive:false,canSpawnAgain:true,oneTime:false}
					],
					[],[],[],[],[]
					],

update : function(du) {
	console.log(this._possibleEnemies[3][7]);
	var mp = global.mapPart;
	for(var i = 0; i < this._possibleEnemies[mp].length; i++){
		var posEn = this._possibleEnemies[mp][i];
		if(posEn.alive === false){
			if(posEn.canSpawnAgain === false && 
				(global.camX+610 < posEn.cx || global.camX-100 > posEn.cx)){
				posEn.canSpawnAgain = true;
			}
			if(posEn.canSpawnAgain === false && 
				(global.camY+480 < posEn.cy || global.camY > posEn.cy)){
				posEn.canSpawnAgain = true;
			}
		}
		if(global.camX + 510 > posEn.cx && global.camX < posEn.cx){
	        if(posEn.alive === false
	        	&& posEn.canSpawnAgain === true && !posEn.oneTime){
	            this.spawnEnemy(mp,i);
	        	if(posEn.oneTime !== undefined) posEn.oneTime = true;
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
	            isFlipped : posEn.isFlipped,
	            flippY : posEn.flippY
	            });
	            posEn.alive=true;
	            posEn.canSpawnAgain = false;
},

death : function (deadPos){
	var mp = global.mapPart;
	for(var i = 0; i < this._possibleEnemies[mp].length; i++){
		var posEn = this._possibleEnemies[mp][i];
		if(posEn.cx === deadPos[0]
			&& posEn.cy === deadPos[1])
			posEn.alive = false;
	}
},

render : function(ctx){

}
}