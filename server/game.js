const Player = require('./player.js'),
      rooms = require('./rooms.js'),
      characterTypes = require('./charactertypes.js').characterTypes

module.exports.game = {

  players: [],
  startTime: new Date().getTime(),
  rooms: [],
  
  initNewGame: function () {
    const room = rooms.buildRoom(1, this)
    this.rooms.push(room)
  },
  
  status: function () {
    return {
      players: this.players.length,
      rooms: this.rooms.length,
      startTime: this.startTime
    }
  },
  
  connect: function (client) {
  
    if(this.players.length == 0) {
      this.initNewGame()
    }
  
    const player = new Player(client)
    this.players.push(player)

    const on = (ev, fn) => {
      client.on(ev, (...args) => {
        console.log(`${ev} received from ${player.id}`)
        fn(...args)
      })
    }

    on('joinRequest', (...args) => this.onJoinRequest(...args, player))
    client.on('update', (...args) => player.update(...args))
    on('kill', (...args) => this.onKill(...args, player))
    client.on('getLag', () => this.onGetLag(player))
    on('message', (...args) => this.onMessage(...args, player))
    on('disconnect', (...args) => this.onDisconnect(...args, player))
  },
  
  onJoinRequest: function (request, player) {
    player = player || request
    request = request || {}
    
    for(let i in characterTypes) {
      if(request.characterType == i)
        player.characterType = characterTypes[i]
    }
    
    const room = this.rooms[0]
    room.addPlayer(player)
    player.name = request.name || "Anonyymy lyyli"
    player.client.json.emit('join', {
      room: room.toJson(),
      player: player.toJson(),
      enemies: this.players
        .filter(p => p.id !== player.id && !p.isDead)
        .map(p => p.toJson())
    })
    player.spawn()
  },

  onGetLag: function (player) {
    const now = new Date(),
          lag = now.getTime() + now.getTimezoneOffset()*60000
    player.client.json.emit("lagCheck", { lag })
  },
  
  onMessage: function (message, player) {
    switch(message) {
      case "requestSpawn":
        player.spawn()
        break
    }
  },
  
  onKill: function (victimId, player) {
    let victim = this.players.find(p => p.id === victimId)
    if(this.isKillable(victim, player)) {
      victim.die()
    }
  },
  
  onDisconnect: function (something, player) {
    player.client.broadcast.emit("enemyDisconnect", player.id)
    
    if(player.room) {
      player.room.removePlayer(player)
    }
    
    this.players.splice(this.players.findIndex(p => p.id === player.id), 1)
    
    if(this.players.length == 0) this.rooms = []
  },
  
  isKillable: function (victim, player) {
    return !victim.isDead
  }

}
