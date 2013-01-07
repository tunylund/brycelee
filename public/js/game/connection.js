var Connection = {
  
  init: function() {
    this.noConnection = true;
    this.waitMsgTimeout = setTimeout(function() {
      $("body").prepend("<div class='msg'>Wait for it...</div>");
    }, 3000);
    
    try {
      this.socket = io.connect();

      this.socket.on('connect', this.onConnect);
      this.socket.on('connect_failed', this.onConnectFailed);
      this.socket.on('join', this.onJoin);
      this.socket.on('message', this.onMessage);
      this.socket.on('disconnect', this.onDisconnect);
      this.socket.on('error', this.onError);
      this.socket.on('spawn', this.onSpawn);
      this.socket.on('death', this.onDeath);
      this.socket.on('enemySpawn', this.onEnemySpawn);
      this.socket.on('enemyUpdate', this.onEnemyUpdate);
      this.socket.on('enemyDeath', this.onEnemyDeath);
      this.socket.on('enemyDisconnect', this.onEnemyDisconnect);
      this.socket.on('gemBirth', this.onGemBirth);
      this.socket.on('gemRemove', this.onGemRemove);
      this.socket.on('lagCheck', this.onLagCheck);
    } catch(e) {
      console.error(e);
    }
  },
    
  onConnect: function(response) {
    clearTimeout(Connection.waitMsgTimeout);
    $(".msg").remove();
    console.log("connectino established");
    if(Connection.noConnection) {
      Connection.join();
      Connection.noConnection = false;
      Connection.getLag();
    }

  },
  
  onConnectFailed: function(response) {
    console.error("failed to connect", response);
    clearTimeout(this.waitMsgTimeout);
    $(".msg").remove();
    $("body").prepend("<div class='msg'>Oh that's too bad.. It seems that your browser or network does not support web sockets properly. Are you using some old evil browser or are ou behind an evil evil proxy? </div>");
    
  },

  onJoin: function(response) {
    console.log('join received: ', response);
    gbox.addRoom(response.room);
    gbox.addPlayer(response.player);
    for(var i=0; i<response.enemies.length; i++) {
      gbox.addCharacter(response.enemies[i]);
    }

    if(response.enemies.length == 0) {      
      var charType = null;
      while(!charType) {
        for(var i in characterTypes) {
          if(Math.random() > 0.75)
            charType = characterTypes[i]
        }
      }
      setTimeout(function() {
        gbox.addCharacterType(charType);
        gbox.addObject(new AutoPlayer({
          id: "autoplayer",
          characterType: charType,
          x: 40, y: 40
        }));
      },7000);
    }
    /*
    game.spawner = new Spawner({
      spawntime: response.spawntime,
      showCounter: true,
      onSpawn: function() {
        gbox.addObject(gbox.player);
      }
    });
    */
    game.onConnectionReady();
  },

  onMessage: function(message) {
    console.log('message received: ', message);
  },

  onDisconnect: function() {
    console.log("connection broken");
    window.location = "index.html";
  },
  
  onError: function() {
    console.error(arguments);
    //window.location = "index.html";
  },
  
  onSpawn: function(player) {
    gbox.player.x = player.x;
    gbox.player.y = player.y;
    
    clearTimeout(Connection.requestSpawnTimeout);
    /*
    if(game.spawner 
      && gbox.getGroup(game.spawner.group) 
      && gbox.getObject(game.spawner.group, game.spawner.id)) {
      gbox.trashObject(game.spawner);
      game.spawner.unblit();
    }
    */
    if(gbox.getObject(gbox.player.group, gbox.player.id)) {
      gbox.player.isDead = false;
    } else {
      gbox.addObject(gbox.player);
    }
  },
  
  onEnemySpawn: function(enemy) {
    gbox.addCharacter(enemy);
    gbox.addObject(gbox._characters[enemy.id]);
  },
  
  onEnemyUpdate: function(msg) {
    var status = msg;
    //var status = msgs.parse(msg, msgs.formats.update);
    gbox._characters[status.id].update(status);
  },
  
  onDeath: function() {
    gbox.player.die();
    //gbox.addObject(game.spawner);
  },

  onEnemyDeath: function(id) {
    console.log("onEnemyDeath " + id);
    gbox._characters[id].die();
  },
  
  onEnemyDisconnect: function(id) {
    gbox.trashObject(gbox._characters[id]);
    gbox._characters[id] = null;
  },
  
  onGemBirth: function(gems) {
    gbox.addGems(gems);
    for(var i=0; i<gems.length; i++) {
      gbox._gems[gems[i]].status = true;
      gbox.addObject(gbox._gems[gems[i]]);
    }
  },
  
  onGemRemove: function(gemId) {
    gbox.removeGem(gemId);
  },
  
  onLagCheck: function(serverTime) {
    var lag = new Date().getTime() - Connection.lagCheckTime;
    console.log("lagCheck " + lag, serverTime);
    $("#lag span:nth-child(2)").html(lag /* + " updateLag: " + serverTime.updateLag*/);
  },

  requestSpawn: function() {
    this.send("requestSpawn");
    this.requestSpawnTimeout = setTimeout(function() {
      Connection.requestSpawn();
    },1000);
  },
  
  getLag: function() {
    this.lagCheckTime = new Date().getTime();
    this.socket.send("getLag");
    setTimeout($.proxy(this.getLag, this), 15000);
  },
  
  send: function(message) {
    this.socket.send(message);
  },
  
  kill: function(victimId) {
    console.log("kill " + victimId);
    this.socket.emit("kill", victimId);
  },
  
  update: function(status) {
    //var now = new Date();
    //status.time = now.getTime() + now.getTimezoneOffset()*60000;
    this.socket.emit("update", status);
    //this.socket.emit("update", msgs.format(status, msgs.formats.update));
  },
  
  join: function() {
    var character = {};
    try {
      character = JSON.parse(localStorage.getItem("character"));
    } catch(e){
      console.warn("no character selected, using defaults");
    };
    this.socket.emit("joinRequest", character);
  },
  
  pickGem: function(gem) {
    this.socket.emit('gemPicked', gem.id);
  }
  
};

/* Log connection*/
/*
for(var i in Connection) {
  Connection["_" + i] = Connection[i];
  Connection[i] = new Function(
    "console.log(arguments);" +
    "return Connection['_" + i + "'].apply(Connection, arguments);"
  );
}
*/
