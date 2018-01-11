class Map {

  get group () { return 'background' }
  
  constructor (room) {
    this.id = room.id
    this.tileset = room.tileset
    this.treasureTile = room.treasureTile
    this._redraw = true
    this.backgroundImageUrl = room.backgroundImageUrl
    this.map = help.asciiArtToMap(room.map, room.characterMap)
    this._coverables = []
    this._previousDraws = []
    help.finalizeTilemap(this)
  }

  prepare () {
    gbox.createCanvas('map_canvas', { w: this.w, h: this.h })
     this._tilecanvas = gbox.getCanvas('map_canvas')
     gbox.blitTilemap(gbox.getCanvasContext('map_canvas'), this)
     this._bgimg = gbox.getImage(this.backgroundImageUrl)
   }
    
  blit () {
    const ctx = gbox.getBufferContext(),
          s = this._bgSize,
          chars = gbox.getGroup('players')

    if (this._redraw) {
      const draw = {
        dx: 0, dy: 0, dw: this.w, dh: this.h,
        sourcecamera: true,
        parallaxx: 0.5, 
        parallaxy: 0.5
      }
      gbox.blit(ctx, this._bgimg, draw)
      gbox.blit(ctx, this._tilecanvas, draw)
      this._redraw = false
    }
      
    while(this._coverables.length > 0) {
      const draw = this._coverables.splice(0,1)[0]
      gbox.blit(ctx, this._bgimg, draw)
      gbox.blit(ctx, this._tilecanvas, draw)
    }

    while(this._previousDraws.length > 0) {
      const draw = this._previousDraws.splice(0,1)[0]
      gbox.blit(ctx, this._bgimg, draw)
      gbox.blit(ctx, this._tilecanvas, draw)
    }

    for(let id in chars) {
      const c = chars[id],
            draw = {
              x: c.x, y: c.y,
              w: c.w, h: c.h,
              dx: c.x, dy: c.y,
              dw: c.w, dh: c.h
            }
      this._previousDraws.push(draw)
      gbox.blit(ctx, this._bgimg, draw)
      gbox.blit(ctx, this._tilecanvas, draw)
    }

  }
  
  cover (item) {
    this._coverables.push({
      x: item.x, y: item.y,
      w: item.w, h: item.h,
      dx: item.x, dy: item.y,
      dw: item.w, dh: item.h
    })
  }
  
  tileIsSolid (t) {
    return this.tileIsSolidCeil(t) || tileIsSolidFloor(t)
  }
  
  tileIsNonSolid (t) {
    return this.tileIsClimbthroughFloor(t) || tileIsLadder(t)
  }

  tileIsSolidCeil (t) {
    return t !== null && ((t >= 1 && t<=4) || (t >=7 && t <=8))
  }
  
  tileIsSolidFloor (t) {
    return t !== null && ((t >= 1 && t<=4) || (t >=6 && t <=8))
  }
  
  tileIsClimbthroughFloor (t) {
    return t === 0
  }
  
  tileIsLadder (t) {
    return t !== null && (t === 0 || t == 5)
  }
  
  tileIsGemOrigin (t) {
    return t !== null && t == 4
  }
    
}
