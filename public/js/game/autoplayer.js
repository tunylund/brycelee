var AutoPlayer = function(options) {

  if(!options || !options.id || !options.characterType)
    throw new Exception("options are lacking attributes");
    
  help.mergeWithModel(this, options);
  this.init();
  toys.brucelee.spawn(this);
  
}

AutoPlayer.prototype = help.mergeWithModel({

  spawnTime: 15000,

  first: function() {
    this.counter=(this.counter+1)%64;
    
    var tb = toys.brucelee;
    
    tb.applyGravity(this);
    tb.autoEnemy.horizontalKeys(this);
    tb.verticalTileCollision(this); // vertical tile collision (i.e. floor)
    tb.horizontalTileCollision(this); // horizontal tile collision (i.e. walls)
    tb.ladderTileCollision(this);
    tb.gemCollision(this);
    tb.strikeCollision(this);
    tb.autoEnemy.jumpKeys(this);
    tb.climbKeys(this);
    tb.autoEnemy.strikeKeys(this);
    tb.handleAccellerations(this);

    tb.setSide(this); // set horizontal side
    tb.setFrame(this); // set the right animation frame
    tb.setCollision(this);
    
    if(this.isStriking && help.isLastFrameOnce(this.counter, this.frames.strike)) {
       this.isStriking = false;
    }
  },
  
  die: function() {
    this.isDead = true;
    this.isStriking = false;
    toys.brucelee.setFrame(this); // set the right animation frame
    setTimeout($.proxy(function() {
      this.isDead = false;
      toys.brucelee.setFrame(this); // set the right animation frame
    }, this), this.spawnTime);
  }

}, Character.prototype);