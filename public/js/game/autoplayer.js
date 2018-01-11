class AutoPlayer extends Character {
  
  constructor (options) {
    super(options)
  }

  get spawnTime() { return 15000 }

  first () {
    this.counter=(this.counter+1)%64
    
    toys.platformer.applyGravity(this)
    this._horizontalKeys()
    this._verticalTileCollision(); // vertical tile collision (i.e. floor)
    this._horizontalTileCollision(); // horizontal tile collision (i.e. walls)
    this._ladderTileCollision()
    this._gemCollision()
    this._jumpKeys()
    this._climbKeys()
    this._strikeKeys()
    this._strikeCollision()
    this._handleAccellerations()

    toys.platformer.setSide(this); // set horizontal side
    this._setFrame(); // set the right animation frame
    this._setCollision()
    
    if(this.isStriking && help.isLastFrameOnce(this.counter, this.frames.strike)) {
       this.isStriking = false
    }
  }
  
  die () {
    this.isDead = true
    this.isStriking = false
    this._setFrame() // set the right animation frame
    setTimeout(() => {
      this.isDead = false
      this._setFrame() // set the right animation frame
    }, this.spawnTime)
  }

  _horizontalKeys () {
    const pl = gbox.player,
          maxaccx = this.touchedLadder ? this.climbaccx : this.maxaccx
    
    if (this.isStriking || this.isDead) {
      this.pushing=toys.PUSH_NONE
    } else if (pl.x < this.x) {
        this.pushing=toys.PUSH_LEFT
        this.accx=help.limit(this.accx-1,-maxaccx,maxaccx)
    } else if (pl.x > this.x) {
        this.pushing=toys.PUSH_RIGHT
        this.accx=help.limit(this.accx+1,-maxaccx,maxaccx)
    } else this.pushing=toys.PUSH_NONE
  }

  _jumpKeys () {
    const pl = gbox.player
    if (this._canJump()&&pl.y<this.y&&(this.curjsize==0)) {
        this.accy=-this.jumpaccy
        this.curjsize=this.jumpsize
    } else if (this.curjsize&&pl.y<this.y) { // Jump modulation
        this.accy--
        this.curjsize--
    } else
        this.curjsize=0
  }

  _strikeKeys () {
    if(this._canStrike()) {
      const aColl = getAbsCollision(this)
      let players = gbox.getGroup("players")
      for(let id in players) {
        let p = players[id]
        const pColl = getAbsCollision(p)
        let dist = trigo.getDistance({
          x: aColl.x + aColl.hw,
          y: aColl.y + aColl.hh,
        }, {
          x: pColl.x + pColl.hw,
          y: pColl.y + pColl.hh,
        })
        if(p.id != this.id && !p.isDead && dist <= this.hw) {
          this.counter = 0 
          this.isStriking = true 
        }
      }
    }
  }

}