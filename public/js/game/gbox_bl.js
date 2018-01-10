
function hwhh(arr) {
  if(arr && arr.length) {
    for(let item of arr) {
      if(item && item.h && item.w) {
        item.hw = item.w/2
        item.hh = item.h/2
      }
    }
  } else if(arr && arr.h && arr.w) {
    arr.hw = arr.w/2
    arr.hh = arr.h/2
  }
}

gbox._keymap.ctrl = 17

Object.assign(gbox, {

  loadAll:function(cb) {
		if (this._canlog) this.log=console.log;
		if (!this._cb) this._cb = cb;
		if (this._splash.background) this.addImage("_splash",this._splash.background);
		if (!gbox._splash.minimalTime) gbox._minimalexpired=2;
		this._waitforloaded();
	},

  getGroup: function(group) {
    return this._objects[group]
  },

  getRoom: function() {
    return Object.values(this._rooms)[0]
  },
  
  _rooms: {},
  addRoom: function(room) {
    const map = new Map(room.room)
    this._rooms[map.id] = map
    if(map.backgroundImageUrl)
      this.addImage(map.backgroundImageUrl, map.backgroundImageUrl)
    this.addGems(room.gems)
  },
  
  _gems: {},
  addGems: function(gems = {}) {
    for (id in gems) {
      const gem = new Gem(gems[id])
      this.addObject(gem)
      this._gems[id] = gem
    }
  },
  removeGem: function(gemId) {
    const gem = this._gems[gemId]
    if(gem) {
      gem.unblit()
      gem.status = false
      gbox.trashObject(this._gems[gemId])
    }
  },
  
  _characters: {},
  addCharacter: function(character) {
    this.addCharacterType(character.characterType)
    this._characters[character.id] = new Character(character)
  },
  
  _characterTypes: {},
  addCharacterType: function(opt) {
    if(!this._characterTypes[opt.id]) {
      this.addImage(opt.spriteSheetUrl, opt.spriteSheetUrl)
      this.addTiles(opt.tileset)
      hwhh(opt.collisions)
      hwhh(opt.strikeCollisions)
      this._characterTypes[opt.id] = new CharacterType(opt)
    }
  },
  
  player: null,
  addPlayer: function(player) {
    this.addCharacterType(player.characterType)
    this.player = new Player(player)
  }

  
});