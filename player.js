var u = require('./utils.js'),
    msgs = require('./public/js/game/msgformat.js'),
    characterTypes = require('./charactertypes.js').characterTypes;

exports.Player = function (client) {

  this.id = "player_" + u.id();
  this.name = "";
  this.characterType = characterTypes.ninja;
  this.w = this.characterType.tileset.tilew;
  this.hw = this.w/2;
  this.h = this.characterType.tileset.tileh;
  this.hh = this.h/2;
  this.client = client || {on: u.voidfn, emit: u.voidfn, send: u.voidfn};
  this.isDead = true;
  this.dyingTime = new Date().getTime();
  this.timeUntilRespawn = 4000;
  this.lagChecks = [];
  
};

exports.Player.prototype = {

  gemCount: 0,
  isStriking: false,
  isDead: false,
  x: 0,
  y: 0,
  accx: 0,
  accy: 0,
  side: true,

  toJson: function() {
    return {
      id: this.id,
      accx: this.accx,
      accy: this.accy,
      x: this.x,
      y: this.y,
      characterType: this.characterType
    }
  },
  
  update: function(msg) {
    if(this.isDead)
      return;

    var status = msg;
    //var status = msgs.parse(msg, msgs.formats.update);
    
    if(status.time) {
      var now = new Date();
      var utcTime = now.getTime() + now.getTimezoneOffset()*60000;
      this.lagChecks.push(utcTime - status.time);
    }
    
    status.id = this.id;
    status.isStriking = this.canStrike() ? status.isStriking : false;
    status.accx = u.limit(status.accx, this.characterType.maxaccx);
    status.accy = u.limit(status.accy, this.characterType.maxaccy);
    
    this.accx = status.accx;
    this.accy = status.accy;
    this.x = status.x;
    this.y = status.y;
    this.isStriking = status.isStriking;
    this.collision = this.characterType.collisions[status.frame];
    this.strikeCollision = this.characterType.collisions[status.frame];

    if (this.accx) {
      this.side = this.accx>0;
    }
    
    if(!this.side && this.collision) {
      this.collision = u.mirror(this, this.collision);
      if(this.isStriking && this.strikeCollision) {
        this.strikeCollision = u.mirror(this, this.strikeCollision);
      }
    }
    
    this.client.broadcast.emit("enemyUpdate", status);
    //this.client.broadcast.emit("enemyUpdate", 
    //  msgs.format(status, msgs.formats.update));
  },

  getAbsCollision: function(col) {
    col = col || this.collision;
    return {
      x: this.x + col.x,
      y: this.y + col.y,
      w: col.w,
      h: col.h
    };
  },
  
  spawn: function() {
    if(this.isDead && new Date().getTime() - this.dyingTime > this.timeUntilRespawn) {
      this.isDead = false;
      this.x = Math.floor(Math.random()*1000)%250;
      this.y = Math.floor(Math.random()*1000)%100;
      this.collision = this.characterType.collisions[0];
      this.client.json.emit("spawn", this.toJson());
      this.client.broadcast.json.emit("enemySpawn", this.toJson());
    }
  },
  
  canStrike: function() {
    return !this.isStriking && !this.isDead && !this.touchedLadder;
  },
  
  die: function() {
    this.isDead = true;
    this.isStriking = false;
    this.dyingTime = new Date().getTime();
    this.client.emit("death");
    this.client.broadcast.emit("enemyDeath", this.id);
    setTimeout(u.proxy(this.spawn, this), this.timeUntilRespawn);
  }
  
};
