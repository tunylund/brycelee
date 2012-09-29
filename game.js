var u = require('./utils.js'),
    Player = require('./player.js').Player,
    rooms = require('./rooms.js'),
    characterTypes = require('./charactertypes.js').characterTypes;

exports.game = {

  players: new u.HashList(),
  startTime: new Date().getTime(),
  rooms: [],
  
  initNewGame: function() {
    var room = new rooms.Room(rooms.rooms[1]);
    room.game = this;
    this.rooms.push(room);
  },
  
  status: function() {
    return {
      players: this.players.length,
      rooms: this.rooms.length,
      startTime: this.startTime
    }
  },
  
  connect: function(client) {
  
    if(this.players.length == 0) {
      this.initNewGame();
    }
  
    var player = new Player(client);
    this.players.push(player);
    client.on('joinRequest', u.proxy(this.onJoinRequest, this, player));
    client.on('update', u.proxy(player.update, player));
    client.on('kill', u.proxy(this.onKill, this, player));
    client.on('message', u.proxy(this.onMessage, this, player));
    client.on('disconnect', u.proxy(this.onDisconnect, this, player));
  },
  
  onJoinRequest: function(request, player) {
    console.log("joinrequest");
    player = player || request;
    request = request || {};
    
    for(var i in characterTypes) {
      if(request.characterType == i)
        player.characterType = characterTypes[i];
    }
    
    var room = this.rooms[0];
    room.addPlayer(player);
    player.name = request.name || "Anonyymy lyyli";
    player.client.json.emit('join', {
      room: room.toJson(),
      player: player.toJson(),
      enemies: this.players.allbut({
        id: player.id,
        isDead: true
      }).toJson(),
      spawntime: player.timeUntilRespawn/1000
    });
    //setTimeout(u.proxy(player.spawn, player), player.timeUntilRespawn);;
  },
  
  onMessage: function(message, player) {
    console.log("onMessage: " + message);
    switch(message) {
      case "requestSpawn":
        player.spawn();
        break;
      case "getLag":
        var now = new Date(),
            lag = now.getTime() + now.getTimezoneOffset()*60000,
            updateLag = 0;
        /*
        for(var i=0, l=player.lagChecks.length; i<l; i++) {
          updateLag += player.lagChecks[i];
        }
        updateLag = Math.floor(updateLag / l);
        player.lagChecks = [];
        */
        player.client.json.emit("lagCheck", {
          lag: lag
          //,updateLag: updateLag
        });
        break;
    }
  },
  
  onKill: function(victimId, player) {
    var victim = this.players.hash[victimId];
    if(this.isKillable(victim, player)) {
      victim.die();
    }
  },
  
  onDisconnect: function(something, player) {
    console.log("disconnect");
    console.log("player " + player.id + " disconnected");
    player.client.broadcast.emit("enemyDisconnect", player.id);
    
    if(player.room) {
      player.room.removePlayer(player);
    }
    
    this.players.remove(player);
    
    if(this.players.length == 0) {
      for(var i = 0; i<this.rooms.length; i++) {
        delete this.rooms.splice(0,1);
      }
    }
  },
  
  isKillable: function(victim, player) {
    if(!victim.isDead && victim.id != player.id) {
    return true;
    /* collision check always lags behind the game
      var col = player.getAbsCollision(player.strikeCollision);
      var vcol = victim.getAbsCollision();
      return (u.collides(col, vcol));
      */
    }
    return false;
  }

};
