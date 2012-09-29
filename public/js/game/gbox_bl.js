
gbox._keymap = help.mergeWithModel({
    ctrl: 17
}, gbox._keymap);

gbox.loadAll = function(cb) {
		// Setup logger
		if (this._canlog) this.log=console.log;
		// Set the callback function, which is called after the resources are loaded.
		if (!this._cb) this._cb = cb;
		// Default stuff
		this.addImage("_dbf",this._debugfont);
		if (this._splash.background) this.addImage("_splash",this._splash.background);
		gbox.addFont({id:"_dbf",image:"_dbf",firstletter:" ",tileh:5,tilew:4,tilerow:16,gapx:0,gapy:0});
		if (!gbox._splash.minimalTime)
		gbox._minimalexpired=2;
		this._waitforloaded();
};
gbox._loaderqueue.peek = function() {
  return this._data[this._tail];
};
gbox.__loadnext = gbox._loadnext;
gbox._loadnext = function() {
  var next=gbox._loaderqueue.peek();
  if(next) {
    switch (next.type) {
      case "json": {
        next = gbox._loaderqueue.pop();
        $.ajax({
          url: next.url,
          type: 'get',
          contentType: "text/json",
          dataType: "json",
          success: function(response) {
            next.success(response);
            gbox._loaderloaded();
          },
          error: function() {
            console.error("error loading a resource: " + next.url);
            gbox._loaderloaded();
          }
        });
        break;
      }
      default: {
        gbox.__loadnext();
      }
    }
  } else {
    gbox._loaderqueue.pop();
  }  
}
help.mergeWithModel(gbox, {

  _debugfont:"akihabara/debugfont.png",
  setDebugFont:function(a) { this._debugfont=a; },

  getGroup: function(group) {
    return this._objects[group]
  },

  getRoom: function() {
    for(var i in this._rooms)
      return this._rooms[i];
  },
  
  _rooms: {},
  _loadRoom: function(opt) {
    gbox._addtoloader({
      type: "json",
      url: opt.url,
      success: this.addRoom
    });
  },
  addRoom: function(room) {
    if(room.url) {
      gbox._loadRoom(room);
    } else {
      var map = new Map(room.room);
      gbox._rooms[map.id] = map;
      if(map.backgroundImageUrl)
        gbox.addImage(map.backgroundImageUrl, map.backgroundImageUrl);
      gbox.addGems(room.gems);
    }
  },
  
  _gems: {},
  addGems: function(gems) {
    gems = gems || {};
    for(var i in gems) {
      var gem = new Gem(gems[i]);
      this._gems[gem.id] = gem;
    }
  },
  removeGem: function(gemId) {
    var gem = this._gems[gemId];
    if(gem) {
      gem.unblit();
      gem.status = false;
      gbox.trashObject(this._gems[gemId]);
    }
  },
  
  _characters: {},
  _loadCharacter: function(opt) {
    gbox._addtoloader({
      type: "json",
      url: opt.url,
      success: gbox.addCharacter
    });
  },
  addCharacter: function(character) {
    if(character.url) {
      gbox._loadCharacter(character);
    } else {
      gbox.addCharacterType(character.characterType);
      gbox._characters[character.id] = new Character(character);
    }
  },
  
  _characterTypes: {},
  addCharacterType: function(opt) {
    if(!gbox._characterTypes[opt.id]) {
      gbox.addImage(opt.spriteSheetUrl, opt.spriteSheetUrl);
      gbox.addTiles(opt.tileset);
      help.hwhh(opt.collisions);
      help.hwhh(opt.strikeCollisions);
      gbox._characterTypes[opt.id] = new CharacterType(opt);
    }
  },
  
  player: null,
  _loadPlayer: function(opt) {
    gbox._addtoloader({
      type: "json",
      url: opt.url,
      success: gbox.addPlayer
    });
  },
  addPlayer: function(player) {
    if(player.url) {
      gbox._loadPlayer(player);
    } else {
      gbox.addCharacterType(player.characterType);
      gbox.player = new Player(player);
    }
  }

  
});