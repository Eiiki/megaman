
function hammerJoe(descr) {
    // Common inherited setup logic from Entity
    this.setup(descr);
    
    // Default sprite, if not otherwise specified
    this.sprite = this.sprite || g_sprites.hammer_joe[0];
    
    // Set drawing scale
    this._scale = 2;
    this.width = this.sprite.width;
    this.height = this.sprite.height;
    console.log("it's hammer time, hammer joe time!");
    
    this.offSets = [0, -14, -10, 5, -14];
    this.offSetsFlipped = [-32, -18, -22, -37, -16];
    this.currentOffSet = 0;
    this.spriteIndex = 16;
};

hammerJoe.prototype = new Enemy();

hammerJoe.prototype.health = 10;
hammerJoe.prototype.type = 'hammer_joe';
hammerJoe.prototype.timeSinceShot = 0;
hammerJoe.prototype.hasShot = false;
hammerJoe.prototype.fire = false;
hammerJoe.prototype.invulnerable = true;

hammerJoe.prototype._updateSprite = function () {
	var i = this.spriteIndex;
	var len = g_sprites.hammer_joe.length;
	var offSets = this.isFlipped ? this.offSetsFlipped : this.offSets;
	
	this.sprite = g_sprites.hammer_joe[i];
	this.currentOffSet = offSets[i !== 17 ? i % 4 : 4];

	if (this.timeSinceShot >= 3 && i !== 17) {
		this.spriteIndex++;
		this.timeSinceShot = 0;
	}
	if (this.timeSinceShot >= 50) {
		this.spriteIndex = 0;
		this.timeSinceShot = 0;
	}
	return i;

};

hammerJoe.prototype.fireBullet = function () {
   	var xVel;
   	var yVel = 0;
   	var fixxer;
    
    if (this.isFlipped) {
    	xVel = 7;
    	fixxer = 35;
    } else {
    	xVel = -7;
    	fixxer = -60
    }

    // 60 is to make it look good when joe fires
    entityManager.fireBullet(this.cx + fixxer, this.cy, xVel, yVel, this.type, this.isFlipped);
    
    audioManager.play(this.fireSound);
    this.hasShot = true;
}

hammerJoe.prototype.takeBulletHit = function() {
    if (!this.invulnerable) this.health -= 1;
};

hammerJoe.prototype.update = function (du) {

    spatialManager.unregister(this);
    if (this._isDeadNow) return entityManager.KILL_ME_NOW;

    this.isFlipped = this.cx < global.megamanX ? true : false;

    if (this.timeSinceShot === 0) this.hasShot = false;

    // update time
    this.timeSinceShot += du;
    
    if (this.timeSinceShot >= 5 && !this.hasShot) { 
    	this.fireBullet(); 
    	this.hasShot = true;
    } 


    if (this.health <= 0) {
        this.onDeath(); // make bombs and goodies 
        this.kill();
    }

    spatialManager.register(this);

    this.invulnerable =  this._updateSprite() < 12 ? true : false;
};

hammerJoe.prototype.render = function (ctx) {
    var origScale = this.sprite.scale;
    this.sprite.scale = this._scale;

    this.sprite.drawWrappedCentredAt(ctx, this.cx + this.currentOffSet, this.cy, this.isFlipped, this.flippY);
    this.sprite.scale = origScale;
};