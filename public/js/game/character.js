var Character = function(options) {

  if(!options || !options.id || !options.characterType)
    throw new Exception("options are lacking attributes");
    
  help.mergeWithModel(this, options);
  this.init();
  toys.brucelee.spawn(this);

};

Character.prototype = {

  id: null,
  group: 'players',
  tileset: null,
  counter: 0,
  collision: null,
  isDead: false,
  isStriking: false,
  
  camera: true,
  flipv: false,
  side: false,
  
  init: function() {
    this.characterType = gbox._characterTypes[this.characterType.id];
    this.tileset = this.characterType.tileset.id;
    this.frames = this.characterType.frames;
    this.maxaccx = this.characterType.maxaccx;
    this.maxaccy = this.characterType.maxaccy;
    this.jumpsize = this.characterType.jumpsize;
    this.jumpaccy = this.characterType.jumpaccy;
    this.climbaccy = this.characterType.climbaccy;
    this.climbaccx = this.characterType.climbaccx;
  },

  first: function() {
    this.counter=(this.counter+1)%64;
    
    var tb = toys.brucelee;

    tb.applyGravity(this);
    tb.verticalTileCollision(this); // vertical tile collision (i.e. floor)
    tb.horizontalTileCollision(this); // horizontal tile collision (i.e. walls)
    tb.ladderTileCollision(this);
    tb.strikeCollision(this);
    tb.handleAccellerations(this);
    tb.guessPushing(this);

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
  },

  blit: function() {
    /*
    if(this.collision) {
      var c = help.getAbsCollision(this);
      gbox.blitRect(gbox.getBufferContext(), {
        alpha: 0.4,
        color: "rgb(244,244,244)",
        x: c.x, y: c.y,
        w: c.w, h: c.h
      });
    }
    if(this.strikeCollision) {
      var c = help.getAbsCollision(this, this.strikeCollision);
      gbox.blitRect(gbox.getBufferContext(), {
        alpha: 0.5,
        x: c.x, y: c.y,
        w: c.w, h: c.h
      });
    }
    */
    
    gbox.blitTile(gbox.getBufferContext(), {
      tileset: this.tileset,
      tile:    this.frame,
      dx:      this.x,
      dy:      this.y,
      fliph:   !this.side,
      flipv:   this.flipv,
      camera:  this.camera,
      alpha:   1.0
    });

  },
  
  update: function(status) {
    this.accx = status.accx <= this.maxaccx ? status.accx : this.maxaccx;
    this.accy = status.accy <= this.maxaccy ? status.accy : this.maxaccy;
    this.x = status.x;
    this.y = status.y;
    this.isDead = status.isDead;
    if(status.isStriking && !this.isStriking) {
      this.counter = 0;
      this.isStriking = true;
    }
      
  }

}
