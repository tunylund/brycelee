const characterTypes = require('./charactertypes.js').characterTypes

function mirror (origin, collision) {
  return {
    x: origin.w - collision.x - collision.w,
    y: collision.y,
    h: collision.h,
    w: collision.w
  }
}

let id = 0

class Player {

  constructor(client) {
    this.gemCount = 0
    this.isStriking = false
    this.x = 0
    this.y = 0
    this.accx = 0
    this.accy = 0
    this.side = true
    this.id = 'player-' + (id++)
    this.name = ''
    this.characterType = characterTypes.ninja
    this.w = this.characterType.tileset.tilew
    this.hw = this.w/2
    this.h = this.characterType.tileset.tileh
    this.hh = this.h/2
    this.client = client || {on: () => {}, emit: () => {}, send: () => {}}
    this.isDead = true
    this.timeUntilRespawn = 4000
  }

  toJson () {
    return {
      id: this.id,
      accx: this.accx,
      accy: this.accy,
      x: this.x,
      y: this.y,
      characterType: this.characterType
    }
  }
  
  update (msg) {
    if(this.isDead) return

    const status = msg
    
    status.id = this.id
    status.isStriking = this.canStrike() ? status.isStriking : false
    status.accx = Math.min(status.accx, this.characterType.maxaccx)
    status.accy = Math.min(status.accy, this.characterType.maxaccy)
    
    this.accx = status.accx
    this.accy = status.accy
    this.x = status.x
    this.y = status.y
    this.isStriking = status.isStriking
    this.collision = this.characterType.collisions[status.frame]
    this.strikeCollision = this.characterType.collisions[status.frame]

    if (this.accx) {
      this.side = this.accx > 0
    }
    
    if(!this.side && this.collision) {
      this.collision = mirror(this, this.collision)
      if(this.isStriking && this.strikeCollision) {
        this.strikeCollision = mirror(this, this.strikeCollision)
      }
    }
    
    this.client.broadcast.emit("enemyUpdate", status)
  }

  getAbsCollision (col) {
    col = col || this.collision
    return {
      x: this.x + col.x,
      y: this.y + col.y,
      w: col.w,
      h: col.h
    }
  }
  
  spawn () {
    this.isDead = false
    this.x = Math.floor(Math.random()*1000)%250
    this.y = Math.floor(Math.random()*1000)%100
    this.collision = this.characterType.collisions[0]
    this.client.json.emit("spawn", this.toJson())
    this.client.broadcast.json.emit("enemySpawn", this.toJson())
  }
  
  canStrike () {
    return !this.isStriking && !this.isDead && !this.touchedLadder
  }
  
  die () {
    this.isDead = true
    this.isStriking = false
    this.client.emit("death")
    this.client.broadcast.emit("enemyDeath", this.id)
    setTimeout(() => this.spawn(), this.timeUntilRespawn)
  }
  
}

module.exports = Player