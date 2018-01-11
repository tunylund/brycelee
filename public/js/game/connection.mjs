import game from './game.mjs'

const Connection = {
  
  init: function() {

    const msg = document.querySelector('#msg')
    let waitMsgTimeout = setTimeout(() => msg.innerHTML = 'Wait for it...', 3000)
    
    this.socket = io.connect({ transports: ['websocket'] })

    const on = (ev, fn) => {
      this.socket.on(ev, (...args) => {
        console.log(`${ev} received`, ...args)
        fn(...args)
      })
    }

    on('connect', response => {
      clearTimeout(waitMsgTimeout)
      document.body.removeChild(msg)
      Connection.join()
      Connection.getLag()
    })

    on('connect_failed', response => {
      clearTimeout(waitMsgTimeout)
      msg.innerHTML = "Oh that's too bad.. It seems that your browser or network does not support web sockets properly. Are you using some old evil browser or are ou behind an evil evil proxy?"
    })

    on('join', response => {
      gbox.addRoom(response.room)
      gbox.addPlayer(response.player)
      for(let enemy of response.enemies) {
        gbox.addCharacter(enemy)
      }
      game.onConnectionReady()
    })

    on('message', () => {})
    on('disconnect', () => window.location = "index.html")
    on('error', (...args) => console.error(...args))
    on('spawn', player => {
      gbox.player.x = player.x
      gbox.player.y = player.y
      
      if(gbox.getObject(gbox.player.group, gbox.player.id)) {
        gbox.player.isDead = false
      } else {
        gbox.addObject(gbox.player)
      }
    })

    on('death', () => gbox.player.die())
    on('enemySpawn', enemy => {
      gbox.addCharacter(enemy)
      gbox.addObject(gbox._characters[enemy.id])
      gbox.removeAutoPlayers()
    })
    on('enemyDeath', id => gbox._characters[id].die())
    on('enemyDisconnect', id => {
      gbox.trashObject(gbox._characters[id])
      gbox._characters[id] = null
    })
    on('gemBirth', gems => gbox.addGems(gems))
    on('gemRemove', id => gbox.removeGem(id))
    on('gemCount', gemCount => {
      gbox.player.gemCount = gemCount
    })

    this.socket.on('enemyUpdate', status => gbox._characters[status.id].update(status))
    this.socket.on('lagCheck', () => {
      const lag = new Date().getTime() - Connection.lagCheckTime
      document.querySelector("#lag span:nth-child(2)").innerHTML = lag
    })
  },

  requestSpawn: function() {
    this.socket.send("requestSpawn")
  },
  
  getLag: function() {
    this.lagCheckTime = new Date().getTime()
    this.socket.emit("getLag")
    setTimeout(() => this.getLag(), 15000)
  },
  
  kill: function(victimId) {
    this.socket.emit("kill", victimId)
  },
  
  update: function(status) {
    this.socket.emit("update", status)
  },
  
  join: function() {
    var character = {}
    try {
      character = JSON.parse(localStorage.getItem("character"))
    } catch(e){
      console.warn("no character selected, using defaults")
    }
    this.socket.emit("joinRequest", character)
  },
  
  pickGem: function(gem) {
    this.socket.emit('gemPicked', gem.id)
  }
  
}

export default Connection