// =====
// SPAWNER
// =====

// spawner relies on the global.mapPart and megamans position to
// pick which enemies should spawn

"use strict";

var Spawner = {
	didSpawnDada : false,

update : function(du) {
	if(global.mapPart === 1){
		if(global.camX > 200 && global.camX < 800){
	        if(entityManager._enemies.length === 0 && this.didSpawnDada === false){
	            entityManager.generateEnemy('dada', {
	            cx : 700,
	            cy : 3520,
	            velX : 0,
	            velY : -0.5
	            });
	            this.didSpawnDada = true;
	        }
	    } else if(this.didSpawnDada === true && entityManager._enemies.length === 0){
	        this.didSpawnDada = false;
	    }
	}
},

render : function(ctx){

}
}