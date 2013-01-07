var game = {

  voidFn: function() {
    return true;
  },
  
  init: function () {
    var d = help.getDeviceConfig();
    conf.device = help.akihabaraInit({
      title: 'Bryce Liiru', 
      width: 640, 
      height: 480, 
      zoom: d.touch && d.width < 640 ? 0.45 : 1,
      fps: 24,
      padmode: "none",
      splash: {
        minilogo: "images/grails_logo.png",
        background: "images/springsource.png",
        minimalTime: 0
      }
    });
    if ((help.geturlparameter("touch")=="yes")||conf.device.touch) {
      iphopad.initialize({
        h: d.touch && d.width < 640 ? 80 : 140
        //dpad: "js/lib/akihabara-core-1.3.1/akihabara/dpad.png",
        //buttons: "js/lib/akihabara-core-1.3.1/akihabara/buttons.png"
      }).className = "pad";
      var ctrls = document.getElementById("controls");
      ctrls.parentNode.removeChild(ctrls)
    }

    gbox.setCallback(function() {
      game.onResourcesReady();
    });
    gbox.setGroups(['background', 'gems', 'players', 'foreground']);
    Connection.init();
    $("body").css({"background-color": "transparent"});
  },
  
  onConnectionReady: function() {
    gbox.loadAll();
  },

  onResourcesReady: function() {
  
    this.map = gbox.getRoom();
    
    maingame = gamecycle.createMaingame('game', 'foreground');
    maingame.gameMenu = this.voidFn;
    maingame.gameIntroAnimation = this.voidFn;
    maingame.gameTitleIntroAnimation = this.voidFn;/*function(reset) {
      if (reset) {
        toys.resetToy(this, 'rising');
      }

      gbox.blitFade(gbox.getBufferContext(),{ alpha: 1 });
      toys.logos.linear(this, 'rising', {
        image: 'logo',
        sx:    gbox.getScreenW()/2-gbox.getImage('logo').width/2,
        sy:    gbox.getScreenH(),
        x:     gbox.getScreenW()/2-gbox.getImage('logo').width/2,
        y:     20,
        speed: 1 });
    };*/
    maingame.initializeGame = function() {
        game.map.prepare();
        //game.spawner.blit();
        //gbox.addObject(game.spawner);
        gbox.addObject(game.map);
        for(var i in gbox._characters) {
          gbox.addObject(gbox._characters[i]);
        }
        for(var i in gbox._gems) {
          gbox.addObject(gbox._gems[i]);
        }
        Connection.requestSpawn();

    };
    
    maingame.setState(102);
    
    gbox.go();
  }
};

gbox.onLoad(game.init);
