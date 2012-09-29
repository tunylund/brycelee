var Spawner = function(opt) {

  help.mergeWithModel(this, opt);
  this.showCounter = opt.showCounter;
  this.spawntime = opt.spawntime || this.spawntime;
  this.starttime = new Date().getTime();

};

Spawner.prototype = {
  id: 'spawner',
  group: 'foreground',
  spawntime: 5,
  starttime: null,
  requestTime: 0,
  showCounter: false,
  count: 0,
  
  first: function() {
    var now = new Date().getTime();
    this.count = Math.ceil((now - this.starttime) / 1000);
    this.font = gbox.getFont('small');
    this.txt = this.spawntime - this.count;
    if(this.txt <= 0)
      this.txt = "spawning...";
    this.w = this.font.tilew*this.txt.length;
    this.h = this.font.tileh;
  },
  
  blit: function() {
    if(this.showCounter) {
      var ctx = gbox.getBufferContext();
      gbox.blitText(ctx, {
        font: 'small',
        text: this.txt,
        dx: gbox.getScreenHW()-(this.w/2),
        dy: gbox.getScreenHH(),
        dw: this.w,
        dh: this.h,
        alpha: 0.75
      });
    }
  },
  unblit: function() {
    game.map.cover({
      x: gbox.getScreenHW()-(this.w/2),
      y: gbox.getScreenHH(),
      w: this.w,
      h: this.h
    });
  }
  
};