// connection

class Player extends Character {
  
  constructor (options) {
    super(options)
    this.gemCount = 0
    this._previousStatus = {}
  }

  first () {
    this.counter=(this.counter+1)%64 
    
    toys.platformer.applyGravity(this) 
    this._horizontalKeys() 
    this._verticalTileCollision(); // vertical tile collision (i.e. floor)
    this._horizontalTileCollision(); // horizontal tile collision (i.e. walls)
    this._ladderTileCollision() 
    this._gemCollision() 
    this._strikeKeys() 
    this._strikeCollision()
    this._jumpKeys() 
    this._climbKeys() 
    this._handleAccellerations()

    toys.platformer.setSide(this) // set horizontal side
    this._setFrame() // set the right animation frame
    this._setCollision() 
    
    if(this.isStriking && help.isLastFrameOnce(this.counter, this.frames.strike)) {
       this.isStriking = false 
       Player.clearKillOrders()
    }
    
    const status = this.status()
    if(!this.isDead && this._stateChanged(status, this._previousStatus)) {
      Connection.update(status)
      this._previousStatus = status
    }
  }
  
  status () {
    return {
      accx: this.accx,
      accy: this.accy,
      x: this.x,
      y: this.y,
      isStriking: this.isStriking,
      frame: this.frame
    }
  }
  
  die () {
    this.isDead = true 
    this.isStriking = false 
    this.vaitingForKillOrder = false
    this._setFrame() // set the right animation frame
    Connection.update(this.status()) 
  }

  static clearKillOrders  () {
    const players = gbox.getGroup("players") 
    for(let id in players) {
      let p = players[id] 
      p.vaitingForKillOrder = false 
    }
  }

  _horizontalKeys  () {
    const keys = { left: 'left', right: 'right' },
          maxaccx = this.touchedLadder ? this.climbaccx : this.maxaccx 
    
    if (this.isStriking || this.isDead) {
      this.pushing=toys.PUSH_NONE 
    } 
    
    else if (gbox.keyIsPressed(keys.left)) {
      this.pushing=toys.PUSH_LEFT 
      this.accx=help.limit(this.accx-1,-maxaccx,maxaccx) 
    } 
    
    else if (gbox.keyIsPressed(keys.right)) {
      this.pushing=toys.PUSH_RIGHT 
      this.accx=help.limit(this.accx+1,-maxaccx,maxaccx) 
    } 
    
    else this.pushing=toys.PUSH_NONE 
    
  }

  _strikeKeys () {
    const key = {strike: 'ctrl', b: 'b'} 
    if (this._canStrike()
        && (gbox.keyIsHit(key.strike) || gbox.keyIsHit(key.b))) {
        this.counter = 0 
        this.isStriking = true 
        return true 
    }
  }
  
  _jumpKeys () {
      const key = { jump: 'up', a: 'a' } 
      if (this._canJump()
        && (gbox.keyIsHold(key.jump) || gbox.keyIsHold(key.a))
        && (this.curjsize==0)) {
        this.accy=-this.jumpaccy 
        this.curjsize=this.jumpsize 
        this.isStriking = false 
      } else if (this.curjsize
        && (gbox.keyIsHold(key.jump) || gbox.keyIsHold(key.a))) { // Jump modulation
        this.accy-- 
        this.curjsize-- 
        this.isStriking = false 
      } else
        this.curjsize=0 
  }

  _stateChanged (a, b) {
    for(let i in a) {
      if(i != "frame" && i != "time" && a[i] !== b[i])
        return true
    }
    return false
  }

}