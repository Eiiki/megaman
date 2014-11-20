function bigSnakey(descr) {
    // Common inherited setup logic from Entity
    this.setup(descr);
    
    // Default sprite, if not otherwise specified
    this.sprite = this.sprite || g_sprites.bigSnakey[1];
    
    // Set drawing scale
    this._scale = 1;
    this.width = this.sprite.width * this._scale;
    this.height = this.sprite.height * this._scale;
    this.isFlipped = false;
    this._bricks = {
                    neck: [
                        {x: Map.getXPosition(this.cx+this.width/2*this._scale + 1*32), y: Map.getYPosition(this.cy+this.height/2*this._scale - 1*32) + 16},
                        {x: Map.getXPosition(this.cx+this.width/2*this._scale + 0*32), y: Map.getYPosition(this.cy+this.height/2*this._scale - 1*32) + 16},
                        {x: Map.getXPosition(this.cx+this.width/2*this._scale + 1*32), y: Map.getYPosition(this.cy+this.height/2*this._scale + 0*32) + 16},
                        {x: Map.getXPosition(this.cx+this.width/2*this._scale + 0*32), y: Map.getYPosition(this.cy+this.height/2*this._scale + 0*32) + 16},
                        {x: Map.getXPosition(this.cx+this.width/2*this._scale + 1*32), y: Map.getYPosition(this.cy+this.height/2*this._scale + 1*32) + 16},
                        {x: Map.getXPosition(this.cx+this.width/2*this._scale + 0*32), y: Map.getYPosition(this.cy+this.height/2*this._scale + 1*32) + 16},
                        {x: Map.getXPosition(this.cx+this.width/2*this._scale + 1*32), y: Map.getYPosition(this.cy+this.height/2*this._scale + 2*32) + 16},
                        {x: Map.getXPosition(this.cx+this.width/2*this._scale + 0*32), y: Map.getYPosition(this.cy+this.height/2*this._scale + 2*32) + 16}
                    ],
                    wave: [
                        [
                            {x: Map.getXPosition(this.cx+this.width/2*this._scale - 1*32), y: Map.getYPosition(this.cy+this.height/2*this._scale + 3*32) + 16, 
                                lastY: Map.getYPosition(this.cy+this.height/2*this._scale + 3*32) + 16 - 32, nextY: Map.getYPosition(this.cy+this.height/2*this._scale + 3*32) + 16 + 32}
                        ],
                        [
                            {x: Map.getXPosition(this.cx+this.width/2*this._scale - 2*32), y: Map.getYPosition(this.cy+this.height/2*this._scale + 3*32) + 16 + 32, 
                                lastY: Map.getYPosition(this.cy+this.height/2*this._scale + 3*32) + 16 + 0, nextY: Map.getYPosition(this.cy+this.height/2*this._scale + 3*32) + 16 + 0}
                        ],
                        [
                            {x: Map.getXPosition(this.cx+this.width/2*this._scale - 3*32), y: Map.getYPosition(this.cy+this.height/2*this._scale + 3*32) + 16, 
                                lastY: Map.getYPosition(this.cy+this.height/2*this._scale + 3*32) + 16 + 32, nextY: Map.getYPosition(this.cy+this.height/2*this._scale + 3*32) + 16 - 32}
                        ],
                        [
                            {x: Map.getXPosition(this.cx+this.width/2*this._scale - 4*32), y: Map.getYPosition(this.cy+this.height/2*this._scale + 3*32) + 16 - 32, 
                                lastY: Map.getYPosition(this.cy+this.height/2*this._scale + 3*32) + 16 + 0, nextY: Map.getYPosition(this.cy+this.height/2*this._scale + 3*32) + 16 + 0}
                        ],
                        [
                            {x: Map.getXPosition(this.cx+this.width/2*this._scale - 5*32), y: Map.getYPosition(this.cy+this.height/2*this._scale + 3*32) + 16, 
                                lastY: Map.getYPosition(this.cy+this.height/2*this._scale + 3*32) + 16 - 32, nextY: Map.getYPosition(this.cy+this.height/2*this._scale + 3*32) + 16 + 32}
                        ],
                        [
                            {x: Map.getXPosition(this.cx+this.width/2*this._scale - 6*32), y: Map.getYPosition(this.cy+this.height/2*this._scale + 3*32) + 16 + 32, 
                                lastY: Map.getYPosition(this.cy+this.height/2*this._scale + 3*32) + 16 + 0, nextY: Map.getYPosition(this.cy+this.height/2*this._scale + 3*32) + 16 + 0}
                        ],
                        [
                            {x: Map.getXPosition(this.cx+this.width/2*this._scale - 7*32), y: Map.getYPosition(this.cy+this.height/2*this._scale + 3*32) + 16, 
                                lastY: Map.getYPosition(this.cy+this.height/2*this._scale + 3*32) + 16 + 32, nextY: Map.getYPosition(this.cy+this.height/2*this._scale + 3*32) + 16 - 32}
                        ],
                        [
                            {x: Map.getXPosition(this.cx+this.width/2*this._scale - 8*32), y: Map.getYPosition(this.cy+this.height/2*this._scale + 3*32) + 16 - 32, 
                                lastY: Map.getYPosition(this.cy+this.height/2*this._scale + 3*32) + 16 + 0, nextY: Map.getYPosition(this.cy+this.height/2*this._scale + 3*32) + 16 + 0}
                        ]
                    ]
                };
};

bigSnakey.prototype = new Enemy();

bigSnakey.prototype.health = 10;
bigSnakey.prototype.type = 'bigsnakey';
bigSnakey.prototype.timeSinceShot = 0;
bigSnakey.prototype.timeForBrickUpdate = 0;
bigSnakey.prototype.hasShot = false;

bigSnakey.prototype.megamanBehind = function() {
    return this.isFlipped ? global.megamanX < this.cx : global.megamanX > this.cx;
};

bigSnakey.prototype._updateBrickInWave = function(brick){
    var zeroBrick1 = 0;
    var zeroBrick2 = 0;
    var downOneBrick = 0;
    var plusTile = 0;
    if(brick.y > brick.lastY && brick.y < brick.nextY){
        //in middle going down        downOneBrick = 32;
        brick.y += 32;
        brick.nextY -= 32;
        brick.lastY += 32;
        zeroBrick1 = brick.y - 1*32;
        zeroBrick1 = brick.y - 2*32;
    }else if(brick.y < brick.lastY && brick.y > brick.nextY){
        //in middle going up
        brick.y -= 32;
        brick.nextY += 32;
        brick.lastY -= 32;
        zeroBrick1 = brick.y + 1*32;
        zeroBrick1 = brick.y + 2*32;
    }else if(brick.y > brick.lastY && brick.y > brick.nextY){
        //Lowest Pos
        plusTile = 32;
        downOneBrick = 32;
        brick.y -= 32;
        brick.nextY -= 32;
        brick.lastY += 32;
        zeroBrick1 = brick.y - 1*32;
        zeroBrick1 = brick.y + 2*32;
    }else if(brick.y < brick.lastY && brick.y < brick.nextY){
        //highest pos
        brick.y += 32;
        brick.nextY += 32;
        brick.lastY -= 32;
        zeroBrick1 = brick.y - 1*32;
        zeroBrick1 = brick.y + 2*32;
    }

    Map.changeTile(brick.x, brick.y, 5);
    Map.changeTile(brick.x, brick.y + 32, 1);
    Map.changeTile(brick.x, brick.y - 32, 0);
    Map.changeTile(brick.x, zeroBrick1, 0);
    Map.changeTile(brick.x, zeroBrick2, 0);

    var megamanLM = global.megamanX - global.megamanWidth/2;
    var megamanRM = global.megamanX + global.megamanWidth/2;
    if(util.isBetween(megamanLM, brick.x - 16, brick.x + 16) || util.isBetween(megamanRM, brick.x - 16, brick.x + 16)){
        if(global.mapPart === 3 || global.mapPart === 6)global.collisionUpdate.shouldUpdate = true;
        if(global.collisionUpdate.cy === 0) {
            global.collisionUpdate.cy = global.megamanY;
            global.collisionUpdate.lastY = global.megamanY;
        }

        if(global.collisionUpdate.cy + global.megamanHeight/2 !== brick.y - 16){
            global.collisionUpdate.cy = brick.y - 16 - global.megamanHeight/2;
        }
        if(global.collisionUpdate.lastX && global.collisionUpdate.lastY < global.collisionUpdate.cy){
            global.collisionUpdate.cy = global.collisionUpdate.lastY + plusTile;
        }
        global.collisionUpdate.lastY = global.collisionUpdate.cy;
        global.collisionUpdate.lastX = true;
    }else{
        global.collisionUpdate.lastX = false;
    }

    return brick;
};

bigSnakey.prototype.drawNeck = function(value) {
    var bricks = this._bricks;
    var neck = bricks.neck;
    for(var n = 0; n < neck.length; n++){
        Map.changeTile(neck[n].x, neck[n].y, value);
        if(n%2 === 0 && n!== 0){
            g_sprites.snake_part.drawWrappedCentredAt(ctx, neck[n].x - 16, neck[n].y, false, false, -Math.PI/2);
        }
    }

};

bigSnakey.prototype.updateWave = function(){
    var bricks = this._bricks;
    var wave = bricks.wave;
    var last_nextChanges = 0;
    for(var n = 0; n < wave.length; n++){
        for(var brickIdx in wave[n]){
            var brick = wave[n][brickIdx];
            this._bricks.wave[n][brickIdx] = this._updateBrickInWave(brick);
        }
    }
};

bigSnakey.prototype._updateSprite = function () {
    if (this.timeSinceShot >= 100) { this.sprite = g_sprites.bigSnakey[2]; }
    if (this.timeSinceShot >= 120) { this.sprite = g_sprites.bigSnakey[0]; }
    if (this.timeSinceShot >= 140 && !this.megamanBehind()) { this.sprite = g_sprites.bigSnakey[1]; }
    if (this.timeSinceShot >= 160) { this.timeSinceShot = 0; }
    if (this.timeSinceShot  < 100) { this.sprite = g_sprites.bigSnakey[0]; }
};

bigSnakey.prototype.fireBullet = function () {
    var numBullets = Math.random() > 0.6 ? 2 : 4;
    var xVector = (global.megamanX - this.cx);
    var yVector = (global.megamanY - this.cy);
    
    var yToxRatio = yVector / xVector;
    
    var xVel = this.isFlipped ? 6 : -6;
    var yVel = xVel * yToxRatio;

    // 5 is to make it look good when snakey fires, otherwise when he is
    // flipped the shot will start outside of his sprite
    for(var n = 0; n < numBullets; n++){
        var randomX = n%2 === 0 ? Math.random() : -Math.random();
        var randomY = n%2 === 0 ? Math.random() : -Math.random();
        entityManager.fireBullet(this.cx + 5, this.cy, xVel+randomX, yVel+randomY, this.type);
    }
    
    //audioManager.play(this.fireSound);
    this.hasShot = true;
};

bigSnakey.prototype.update = function (du) {
    spatialManager.unregister(this);
    if (this._isDeadNow){
        this.drawNeck(0);
        return entityManager.KILL_ME_NOW;
    }
    // update time
    this.timeSinceShot += du;
    this.timeForBrickUpdate += du;

    if(this.timeForBrickUpdate > 20){
        this.updateWave();
        this.timeForBrickUpdate = 0;
    }

    if (this.timeSinceShot >= 145 && !this.hasShot && !this.megamanBehind()) { this.fireBullet(); } 
    if (this.timeSinceShot >= 160) { this.hasShot = false; }

    if (this.health <= 0) {
        this.onDeath(); // make bombs and goodies 
        this.kill();
    }

    spatialManager.register(this);

    //Update the sprite
    this._updateSprite();
};

bigSnakey.prototype.render = function (ctx) {
    var offSet = this.isFlipped ? this.sprite.width/2 : 0;
    this.sprite.drawWrappedCentredAt(ctx, this.cx + offSet, this.cy, this.isFlipped);
    this.drawNeck(1);
};