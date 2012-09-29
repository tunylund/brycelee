var Gem = function(gem) {
  help.mergeWithModel(this, gem);
  this.init();
};

Gem.prototype = {
  group: 'gems',
  delta: 0.025,
  init: function() {
    var map = gbox.getRoom();
    this.tileset = map.tileset;
    this.blitOpts = {
      tileset: map.tileset,
      tile: map.treasureTile,
      dx: this.x*gbox.getTiles(map.tileset).tilew,
      dy: this.y*gbox.getTiles(map.tileset).tileh,
      alpha: 0.75
    };
  },
  first: function() {
    this.blitOpts.alpha -= this.delta;
    if(this.blitOpts.alpha > 1 || this.blitOpts.alpha < 0.75)
      this.delta = -1*this.delta;
  },
  blit: function() {
    if(this.status) {
      var ctx = gbox.getBufferContext();
      gbox.blitTile(ctx, this.blitOpts);
    }
  },
  unblit: function() {
    game.map.cover({
      x: this.blitOpts.dx,
      y: this.blitOpts.dy,
      w: this.w,
      h: this.h
    });
  }
};

