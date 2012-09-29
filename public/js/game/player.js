var Player = function(options) {

  if(!options || !options.id || !options.characterType)
    throw new Exception("options are lacking attributes");
    
  help.mergeWithModel(this, options);
  this.init();
  toys.brucelee.spawn(this);
  
}

Player.prototype = help.mergeWithModel({
  first: function() {
    this.counter=(this.counter+1)%64;
    
    var tb = toys.brucelee;

    tb.applyGravity(this);
    tb.horizontalKeys(this);
    tb.verticalTileCollision(this); // vertical tile collision (i.e. floor)
    tb.horizontalTileCollision(this); // horizontal tile collision (i.e. walls)
    tb.ladderTileCollision(this);
    tb.gemCollision(this);
    tb.strikeKeys(this);
    tb.strikeCollision(this);
    tb.jumpKeys(this);
    tb.climbKeys(this);
    tb.handleAccellerations(this);

    tb.setSide(this); // set horizontal side
    tb.setFrame(this); // set the right animation frame
    tb.setCollision(this);
    
    if(this.isStriking && help.isLastFrameOnce(this.counter, this.frames.strike)) {
       this.isStriking = false;
       tb.clearKillOrders();
    }
    
    if(!this.isDead && tb.stateChanged(this, this.st))
      Connection.update(this.status());
  },
  
  status: function() {
    this.st = {
      accx: this.accx,
      accy: this.accy,
      x: this.x,
      y: this.y,
      isStriking: this.isStriking,
      frame: this.frame
    };
    return this.st;
  },
  
  die: function() {
    this.isDead = true;
    this.isStriking = false;
    toys.brucelee.setFrame(this); // set the right animation frame
    Connection.update(this.status());
  }

}, Character.prototype);