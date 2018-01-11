import game from './game.mjs'
import Connection from './connection.mjs'

function getAbsCollision (th,col) {
  col = col || th.collision
  return {
      x: th.x + col.x,
      y: th.y + col.y,
      w: col.w,
      h: col.h,
      hw: col.hw,
      hh: col.hh,
  }
}

 function mirror (origin, collision) {
  return {
    x: origin.w - collision.x - collision.w,
    y: collision.y,
    h: collision.h,
    w: collision.w,
    hw: collision.hw,
    hh: collision.hh
  }
}

class Character {
  
  constructor (options) {
    this.id = null
    this.group = 'players'
    this.tileset = null
    this.counter = 0
    this.collision = null
    this.isDead = false
    this.isStriking = false
    
    this.camera = true
    this.flipv = false
    this.side = false

    if(!options || !options.id || !options.characterType)
      throw new Exception("options are lacking attributes")
      
    help.mergeWithModel(this, options)

    this.characterType = gbox._characterTypes[this.characterType.id]
    this.tileset = this.characterType.tileset.id
    this.frames = this.characterType.frames
    this.maxaccx = this.characterType.maxaccx
    this.maxaccy = this.characterType.maxaccy
    this.jumpsize = this.characterType.jumpsize
    this.jumpaccy = this.characterType.jumpaccy
    this.climbaccy = this.characterType.climbaccy
    this.climbaccx = this.characterType.climbaccx

    this._spawn()
  }

  first () {
    this.counter=(this.counter+1)%64
    
    toys.platformer.applyGravity(this)
    this._verticalTileCollision() // vertical tile collision (i.e. floor)
    this._horizontalTileCollision() // horizontal tile collision (i.e. walls)
    this._ladderTileCollision()
    this._strikeCollision()
    this._handleAccellerations()
    this._guessPushing()

    toys.platformer.setSide(this) // set horizontal side
    this._setFrame() // set the right animation frame
    this._setCollision()

    if(this.isStriking && help.isLastFrameOnce(this.counter, this.frames.strike)) {
       this.isStriking = false
    }
    
  }

  die () {
    this.isDead = true
    this.isStriking = false
    this._setFrame()
  }

  blit () {
    gbox.blitTile(gbox.getBufferContext(), {
      tileset: this.tileset,
      tile:    this.frame,
      dx:      this.x,
      dy:      this.y,
      fliph:   !this.side,
      flipv:   this.flipv,
      camera:  this.camera,
      alpha:   1.0
    })
  }
  
  update (status) {
    this.accx = status.accx <= this.maxaccx ? status.accx : this.maxaccx
    this.accy = status.accy <= this.maxaccy ? status.accy : this.maxaccy
    this.x = status.x
    this.y = status.y
    this.isDead = status.isDead
    if(status.isStriking && !this.isStriking) {
      this.counter = 0
      this.isStriking = true
    }
      
  }

  _handleAccellerations () {
      // Gravity
      if (!this.touchedfloor && !this.touchedLadder) this.accy++
      // Attrito
      if (this.pushing==toys.PUSH_NONE) 
        if (this.accx) this.accx = help.goToZero(this.accx)
  }

  _verticalTileCollision () {
    let col = getAbsCollision(this),
        map = game.map,
        t = col.hw/2
    this.touchedfloor=false
    this.touchedceil=false
    this.walkingOnLadder=false

    while (t<col.w) {
      let top = help.getTileInMap(col.x + t, col.y, map, -1),
          bottom = help.getTileInMap(col.x + t, col.y + col.h, map, -1)
      
      if (!this.touchedceil && this.accy<0 && map.tileIsSolidCeil(top)) {
        this.accy=0
        this.y=help.yPixelToTile(map,col.y,1) - this.collision.y
        this.touchedceil=true
      }
      
      if (!this.touchedfloor && map.tileIsSolidFloor(bottom)) {
        this.accy=0
        this.y=help.yPixelToTile(map,col.y+col.h) - this.collision.y - this.collision.h
        this.touchedfloor=true
      }
      
      if (!this.touchedfloor && map.tileIsClimbthroughFloor(bottom)) {
        this.accy=0
        this.touchedfloor=true
        this.walkingOnLadder=true
      }
      t+=col.hw
    }
  }
  
  _horizontalTileCollision () {

      let t=0,
          col = getAbsCollision(this),
          map = game.map,
          tileh = gbox.getTiles(map.tileset).tileh

      this.touchedleftwall=false
      this.touchedrightwall=false

      while (t<col.h) {
        let left=help.getTileInMap(col.x,col.y+t,map,-1),
            right=help.getTileInMap(col.x+col.w-1,col.y+t,map,-1)

        if (!this.touchedleftwall && this.accx<0 && map.tileIsSolidFloor(left)) {
          this.accx=0
          this.x=help.xPixelToTile(map,col.x,1) - this.collision.x
          this.touchedleftwall=true
        } 
        if (!this.touchedrightwall && this.accx>0 && map.tileIsSolidFloor(right)) {
          this.accx=0
          this.x=help.xPixelToTile(map,col.x + col.w,0) - this.collision.x - col.w
          this.touchedrightwall=true
        }
        t+=tileh
      }

  }

  _ladderTileCollision () {
      let col = getAbsCollision(this),
          map =game.map,
          x = col.x+col.hw,
          t = 0,
          tileh = gbox.getTiles(map.tileset).tileh/2

      this.touchedLadder=false
      while (t<col.h) {
        let tile = help.getTileInMap(x, col.y+t, map, -1)
        
        if (map.tileIsLadder(tile)) {
          this.isStriking=false
          this.touchedLadder=true
        }
        t+=tileh
      }
  }
  
  _gemCollision () {
    
    let col = getAbsCollision(this),
        map = game.map,
        t = 0,
        ts = gbox._tiles[map.tileset],
        ty = Math.floor((col.y-1)/ts.tileh)
        
    while (t<col.w) {

      let top = help.getTileInMap(col.x + t, col.y-1, map, -1)
      if (map.tileIsGemOrigin(top)) {
        
        let tx = Math.floor((col.x + t)/ts.tilew),
            gem = gbox._gems[tx+","+ty]
            
        if(gem && gem.status) {
          Connection.pickGem(gem)
          gem.status = false
        }
      }
      t += col.hw
    }
      
  }

  _strikeCollision () {
    if(this.isStriking && this.strikeCollision) {
      let col = getAbsCollision(this, this.strikeCollision)
      let players = gbox.getGroup("players")
      for(let id in players) {
        let p = players[id]
        if(p.id != this.id && !p.isDead && gbox.collides(col, getAbsCollision(p)) && !p.vaitingForKillOrder) {
          if(p.constructor.name === 'AutoPlayer') {
            p.die()
          } else {
            p.vaitingForKillOrder = true
            Connection.kill(p.id)
          }
        }
      }
    }
  }
  
  _setFrame () {
    if(this.prep) {
      if(this.frame == this.prep.frames[this.prep.frames.length-1]) {
        this.prep = null
      } else {
        this.frame = help.decideFrameOnce(this.counter, this.prep)
        return
      }
    }
    
    let anim = null
  
    if (this.isDead) {
      if(this.anim != this.frames.die)
        this.counter = 0
      anim = this.frames.die
    } 
    
    else if (this.touchedLadder) {
      if(this.accy!=0 || this.accx!=0)
        anim = this.frames.climb
    } 
    
    else if (this.isStriking) {
      anim = this.frames.strike
    }
    
    else if (this.touchedfloor) {
      anim = this.accx != 0 ? this.frames.run : this.frames.stand
    }
    
    else if (this.accy>0) {
      anim = this.frames.fall
    }
        
    else if (this.accy<0) {
      anim = this.frames.jump
    }
    
    if(anim && this.anim)
      this.prep = this.frames["prep_for_" + anim.id + "_from_" + this.anim.id]
    
    if(this.prep)
      this.counter = 0
    
    this.anim = anim
    let a = this.prep || this.anim
    if(a) {
      if(a.loop)
        this.frame = help.decideFrame(this.counter, a)
      else 
        this.frame = help.decideFrameOnce(this.counter, a)
    }
    
  }

  _setCollision () {
    this.collision = help.cloneObject(this.characterType.collisions[this.frame])
    this.strikeCollision = help.cloneObject(this.characterType.strikeCollisions[this.frame])

    if(!this.side) {
      this.collision = mirror(this, this.collision)
      if(this.strikeCollision)
        this.strikeCollision = mirror(this, this.strikeCollision)
    }
    
  }

  _spawn (data) {
    this.collision = this.characterType.collisions[0]
    this.accx = 0
    this.accy = 0
    this.side = true
    this.frame = 0
    this._setCollision()
    return toys.platformer.spawn(this, data)
  }

  _guessPushing () {
    if (this.isStriking || this.isDead) {
      this.pushing=toys.PUSH_NONE
    } else if (this.accx < 0) {
      this.pushing=toys.PUSH_LEFT
    } else if (this.accx > 0) {
      this.pushing=toys.PUSH_RIGHT
    } else this.pushing=toys.PUSH_NONE
  }
  
  _canJump () {
    return this.touchedfloor && !this.isStriking && (!this.touchedLadder || this.walkingOnLadder)&& !this.isDead
  }

  _canStrike () {
    return !this.isStriking && !this.isDead && !this.touchedLadder
  }

  _canClimb () {
    return this.touchedLadder && !this.isStriking && !this.isDead
  }

  _canDescend () {
    return (this.walkingOnLadder || this.touchedLadder) && !this.isStriking && !this.isDead
  }

  _climbKeys () {
    let key = { climb: 'up', descend: 'down' }
    
    if(this._canDescend()) {
      if(gbox.keyIsPressed(key.descend))
        this.accy=this.climbaccy
      else if(this._canClimb()) {
        if(gbox.keyIsPressed(key.climb))
          this.accy=-this.climbaccy
        else
          this.accy=0
      }
    }
  }

}

export default Character