import game from './game.mjs'

class Gem {
  
  constructor(id, status, x, y) {
    this.id = id
    this.status = status
    this.x = x
    this.y = y
    this.group = 'gems'
    this.delta = 0.025
    let map = gbox.getRoom()
    this.tileset = map.tileset
    this.blitOpts = {
      tileset: map.tileset,
      tile: map.treasureTile,
      dx: this.x*gbox.getTiles(map.tileset).tilew,
      dy: this.y*gbox.getTiles(map.tileset).tileh,
      alpha: 0.75
    }
  }

  first () {
    this.blitOpts.alpha -= this.delta
    if(this.blitOpts.alpha > 1 || this.blitOpts.alpha < 0.75)
      this.delta = -1*this.delta
  }

  blit () {
    if(this.status) {
      let ctx = gbox.getBufferContext()
      gbox.blitTile(ctx, this.blitOpts)
    }
  }
  unblit () {
    game.map.cover({
      x: this.blitOpts.dx,
      y: this.blitOpts.dy,
      w: this.w,
      h: this.h
    })
  }
}

export default Gem