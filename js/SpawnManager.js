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
						{type: 'dada',cx:1884, cy:3750,alive:false,canSpawnAgain:true,velX:0,velY:-0.5}
					],
					[
						{type: 'petiteSnakey',cx:1832, cy:3208,alive:false,canSpawnAgain:true,isFlipped:true},
						{type: 'petiteSnakey',cx:1768, cy:3144,alive:false,canSpawnAgain:true,isFlipped:true},
						{type: 'petiteSnakey',cx:1704, cy:3080,alive:false,canSpawnAgain:true,isFlipped:true},
						{type: 'potton',cx:3360, cy:3020,alive:false,canSpawnAgain:true},
						{type: 'potton',cx:3560, cy:3040,alive:false,canSpawnAgain:true},
						{type: 'potton',cx:3760, cy:3060,alive:false,canSpawnAgain:true},
						{type: 'potton',cx:3910, cy:3040,alive:false,canSpawnAgain:true},
						{type: 'bubukan',cx:3390, cy:3260,alive:false,canSpawnAgain:true,velX:0,velY:-0.5},
						{type: 'bubukan',cx:3710, cy:3260,alive:false,canSpawnAgain:true,velX:0,velY:-0.5}
					],
					[
						{type: 'bigsnakey', cx: 1972, cy: 2536, alive: false, canSpawnAgain: true},
						{type: 'potton',cx:2400, cy:2460,alive:false,canSpawnAgain:true},
						{type: 'petiteSnakey',cx:2440, cy:2644,alive:false,canSpawnAgain:true,flippY:true},
						{type: 'petiteSnakey',cx:2504, cy:2708,alive:false,canSpawnAgain:true,flippY:true},
						{type: 'potton',cx:2800, cy:2742,alive:false,canSpawnAgain:true},
						{type: 'petiteSnakey', cx: 2889, cy: 2794, alive: false, canSpawnAgain: true},
						{type: 'potton',cx:2950, cy:2742,alive:false,canSpawnAgain:true},
						{type: 'big_life',cx:2704,cy:2550, velX:0,velY:0,alive:false,canSpawnAgain:true,oneTime:false},
						{type: 'big_life',cx:2832,cy:2550, velX:0,velY:0,alive:false,canSpawnAgain:true,oneTime:false},
						{type: 'hammer_joe',cx:3920,cy:2680,alive:false,canSpawnAgain:true,velX:0,velY:0}
					],
					[
						{type: 'hammer_joe',cx:3825,cy:2136,alive:false,canSpawnAgain:true,velX:0,velY:0}
					],[
						{type: 'misteryBox',cx:3887,cy:1842,alive:false,canSpawnAgain:true,oneTime:false},
						{type: 'misteryBox',cx:3951,cy:1842,alive:false,canSpawnAgain:true,oneTime:false}
					],[
						{type: 'big_life',cx:5200,cy:1076, velX:0,velY:0,alive:false,canSpawnAgain:true,oneTime:false},
						{type: 'bubukan',cx:4400, cy:1180,alive:false,canSpawnAgain:true,velX:0,velY:-0.5},
						{type: 'bubukan',cx:4700, cy:1180,alive:false,canSpawnAgain:true,velX:0,velY:-0.5},
						{type: 'bubukan',cx:5400, cy:1348,alive:false,canSpawnAgain:true,velX:0,velY:-0.5},
						{type: 'bigsnakey', cx: 4022, cy: 1094, alive: false, canSpawnAgain: true}
					],[
						{type: 'jamacy',cx:5360, cy:550,alive:false,canSpawnAgain:true,velX:0,velY:0},
					],[
						{type: 'bomb_flier',cx:6300,cy:172,alive:false,canSpawnAgain:true,velX:0,velY:-1.5},
						{type: 'bomb_flier',cx:6480,cy:300,alive:false,canSpawnAgain:true,velX:0,velY:-1.5},
						{type: 'bomb_flier',cx:6600,cy:236,alive:false,canSpawnAgain:true,velX:0,velY:-1.5},
						{type: 'bomb_flier',cx:6710,cy:108,alive:false,canSpawnAgain:true,velX:0,velY:-1.5},
						{type: 'bomb_flier',cx:6850,cy:140,alive:false,canSpawnAgain:true,velX:0,velY:-1.5},
						{type: 'bomb_flier',cx:6950,cy:236,alive:false,canSpawnAgain:true,velX:0,velY:-1.5},
						{type: 'bomb_flier',cx:7270,cy:364,alive:false,canSpawnAgain:true,velX:0,velY:-1.5},
						{type: 'bomb_flier',cx:7408,cy:140,alive:false,canSpawnAgain:true,velX:0,velY:-1.5},
						{type: 'bomb_flier',cx:7462,cy:204,alive:false,canSpawnAgain:true,velX:0,velY:-1.5},
						{type: 'bomb_flier',cx:7558,cy:204,alive:false,canSpawnAgain:true,velX:0,velY:-1.5},
						{type: 'bomb_flier',cx:7654,cy:268,alive:false,canSpawnAgain:true,velX:0,velY:-1.5},
						{type: 'snakeman',cx:8615,cy:200,alive:false,canSpawnAgain:true,velX:0,velY:-0.5}
					], []
					],

update : function(du) {
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