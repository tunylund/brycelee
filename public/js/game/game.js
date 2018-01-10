const game = {

  init: function () {
    const d = help.getDeviceConfig()
    const device = help.akihabaraInit({
      title: 'Bryce Liiru', 
      width: 640, 
      height: 480, 
      zoom: d.touch && d.width < 640 ? 0.45 : 1,
      fps: 24,
      padmode: "none",
      splash: {
        background: "images/bg.png",
        minimalTime: 0
      }
    })

    if ((help.geturlparameter("touch")=="yes") || device.touch) {
      iphopad.initialize({ h: d.touch && d.width < 640 ? 80 : 140 }).className = "pad"
    }
    gbox.setCallback(() => game.onResourcesReady())
    gbox.setGroups(['background', 'gems', 'players', 'foreground'])
    Connection.init()
    document.body.style.backgroundColor = 'transparent'
  },
  
  onConnectionReady: function() {
    gbox.loadAll()
  },

  onResourcesReady: function() {
  
    this.map = gbox.getRoom()
    game.map.prepare()
    gbox.addObject(game.map)
    for(let i in gbox._characters) {
      gbox.addObject(gbox._characters[i])
    }
    for(let i in gbox._gems) {
      gbox.addObject(gbox._gems[i])
    }
    
    gbox.go()
  }
}

gbox.onLoad(game.init)
