var u = require('./utils.js');

exports.Room = function(room) {
  this.room = room;
  this.players = [];
  this.gems = {};
  this.init();
};
exports.Room.prototype = {

  treasureOriginTile: '+',
  gemInterval: 30000,
  characterCheckInterval: 30000,
  game: null,

  init: function() {
    this.createGems();
  },
  
  createGems: function() {
    for(var y=0, l=this.room.map.length; y<l; y++) {
      for(var x=0, k=this.room.map[y].length; x<k; x++) {
        if(this.room.map[y][x] == this.treasureOriginTile) {
          var gem = {
            id: x + "," + y, 
            x: x, 
            y: y,
            status: true
          };
          this.gems[gem.id] = gem;
        }
      }
    }
  },
  
  checkGems: function() {
    var newGems = [];
    for(var i in this.gems) {
      var gem = this.gems[i];
      if(!gem.status) {
        gem.status = true;
        newGems.push(gem.id);
      }
    }
    if(newGems.length > 0)
      this.sendGems(newGems);
  },
  
  checkGem: function(gemId) {
    var gem = this.gems[gemId],
        newGems = [];
    if(gem && !gem.status) {
        gem.status = true;
        newGems.push(gem.id);
        this.sendGems(newGems);
    }
  },
  
  sendGems: function(gems) {
    for(var i=0; i<this.players.length; i++) {
      this.players[i].client.emit("gemBirth", gems);
    }
  },

  sendGemRemove: function(gemId) {
    for(var i=0; i<this.players.length; i++) {
      this.players[i].client.emit("gemRemove", gemId);
    }
  },

  addPlayer: function(player) {
    this.players.push(player);
    player.room = this;
    player.client.on('gemPicked', u.proxy(this.pickGem, this, player));
  },
  
  removePlayer: function(player) {
    for(var i=0; i<this.players.length; i++) {
      if(this.players[i].id == player.id) {
        this.players.splice(i,1);
        break;
      }
    }
  },
  
  pickGem: function(gemId, player) {
    if(this.gems[gemId] && this.gems[gemId].status) {
      player.gemCount++;
      this.gems[gemId].status = false;
      this.sendGemRemove(gemId);
      setTimeout(u.proxy(this.checkGem, this, gemId), this.gemInterval);
    }
  },
  
  toJson: function() {
    return {
      room: this.room,
      gems: this.gems
    }
  }
  
}

exports.rooms = [
  {
    id: "room_1",
    backgroundImageUrl: "images/bg.png",
    tileset: 'mapTiles',
    characterMap: [ 
      [null, ' '], 
      [0, 'a'], 
      [1, 'b'], 
      [2, 'x'], 
      [3, '%'], 
      [4, '#'] 
    ],
    map: [
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "                                        ",
          "aaaaaaaaa        ######        aaaaaaaaa",
          "b                ######                b",
          "b                ######                b",
          "b                ######                b",
          "b                ######                b",
          "aaaaaaaaa         ####         aaaaaaaaa",
          "b                  ##                  b",
          "b                  ##                  b",
          "b                                      b",
          "b                                      b",
          "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
    ]
  },
  {
    id: "room_0",
    treasureOriginTile: '+',
    treasureTile: 9,
    tileset: 'asiaTiles',
    backgroundImageUrl: 'images/maps/asia_bg.jpg',
    characterMap: [
      [null, ' '],
      [0, '%'],
      [1, '-'],
      [2, '/'],
      [3, '\\'],
      [4, '+'],
      [5, '#'],
      [6, 'm'],
      [7, '['],
      [8, ']'],
      [9, '*']
    ],
    map: ["/+---+---+---+          +++++++++++++++\\",
          "[                                      ]",
          "[                                      ]",
          "[                                      ]",
          "[                       ++--++--++--++-\\",
          "[                                      ]",
          "[                                      ]",
          "[                                      ]",
          "/---%%---+---+                         ]",
          "[   ##                                 ]",
          "[   ##                                 ]",
          "[   ##                  %%---------%%++\\",
          "[   ##                  ##         ##  ]",
          "[   ##   +---+          ##         ##  ]",
          "[   ##                  ##         ##  ]",
          "[   ##                                 ]",
          "[   ##                                 ]",
          "[   ##                                 ]",
          "/---++----------%%%%%%%%--        ++---\\",
          "[               ########               ]",
          "[               ########               ]",
          "[               ########               ]",
          "[                ######                ]",
          "[                ######                ]",
          "/-+    +-\\        ####        /-+    +-\\",
          "[        ]        ####        [        ]",
          "[        ]                    [        ]",
          "[        ]                    [        ]",
          "[        ]                    [        ]",
          "mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm"]
          
  }
];
