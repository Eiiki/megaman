// ==========
// GROUND STUFF
// ==========

"use strict";

// A generic contructor which accepts an arbitrary descriptor object
function Ground(descr) {
    // Common inherited setup logic from Entity
    this.setup(descr);
    
    // Default sprite, if not otherwise specified
    this.sprite = this.sprite || g_sprites.brick;
    
    // Set drawing scale
    this._scale = 1;
};

Ground.prototype = new Entity();

Ground.prototype.height = 0;
Ground.prototype.width = 0;
/*
Ground.prototype.updateBricks = function(oldBrickX, oldBrickY, nextBrickX, nextBrickY){

	var pX = oldBrickX,  pY = oldBrickY,
		nX = nextBrickX, nY = nextBrickY;

	var alien = this.aliens[this.drawAlien];

	// check wether the next brick exists
	if(alien && alien[nY] && alien[nY][nX]){
 
		//A pretty shitty approximation for left/right or top/bottom bounce
		if(pX === nX){
			//It's a hit on the top or the bottom sides
			g_ball.yVel *= -1;
			alien[nY][nX] -= 1;
			if(this._hasWonGame()){
				g_hasWon = true;
			}

		}else{
			//It's a hit on the left or right sides
			g_ball.xVel *= -1;
			alien[nY][nX] -= 1;
			if(this._hasWonGame()){
				g_hasWon = true;
			}
		}		
	}
};

Ground.prototype.collidesWithBrick = function(prevX, prevY, nextX, nextY){

	var oldBrickX = Math.floor( (prevX - this.xBase) / (this.brickWidth  + this.brickMargin));
	var oldBrickY = Math.floor( (prevY - this.yBase) / (this.brickHeight + this.brickMargin));

	var nextBrickX = Math.floor( (nextX - this.xBase) / (this.brickWidth  + this.brickMargin));
	var nextBrickY = Math.floor( (nextY - this.yBase) / (this.brickHeight + this.brickMargin));

	this.updateBricks(oldBrickX, oldBrickY, nextBrickX, nextBrickY);
};


Ground.prototype.render = function(ctx){
	var bricks = this.gatherBricks();
	this.drawWallFromBricks(ctx, bricks);
};
*/