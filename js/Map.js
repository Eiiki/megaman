// =========
// MAP STUFF
// =========

"use strict";

// Map is just a single big object
var Map = {

// private variables

// 8x10 test grid
_tiles : [
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1,1, 1, 1, 1, 1, 1, 1, 1, 1, 1,1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
],

tileWidth  : 70,
tileHeight : 66,

calculateTileCoords : function(x, y) {
	var xTileCoords = Math.floor(x / this.tileWidth);
	var yTileCoords = Math.floor(y / this.tileHeight);

	return { x : xTileCoords, y : yTileCoords };
},

isColliding : function(x, y) {
	var tileCoords = this.calculateTileCoords(x, y);
	return this._tiles[tileCoords.y][tileCoords.x];
},

getYPosition : function(y) {
	var yTileCoords = Math.floor(y / this.tileHeight);

	// 38 er bara fasti sem virkar i.e. magic number
	return yTileCoords * this.tileHeight + 36;
},

toggleTile : function(x, y) {
	var tileCoords = this.calculateTileCoords(x, y);
	this._tiles[tileCoords.y][tileCoords.x] = !this._tiles[tileCoords.y][tileCoords.x];
},


update : function(du) {

},


render : function(ctx) {
	ctx.save();
	ctx.fillStyle   = 'red';
	ctx.strokeStyle = 'white';
	for (var i = 0; i < this._tiles.length; i++) {
		for (var j = 0; j < this._tiles[0].length; j++) {
			if (this._tiles[i][j]) {
				ctx.fillRect(j*this.tileWidth, i*this.tileHeight,
							this.tileWidth, this.tileHeight);
				ctx.strokeRect(j*this.tileWidth, i*this.tileHeight,
							this.tileWidth, this.tileHeight);
			}
		}
	}
	ctx.restore();
}
}
