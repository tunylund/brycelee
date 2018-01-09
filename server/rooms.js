const gemInterval = 30000
const characterCheckInterval = 30000
const treasureOriginTile = '+'

class Room {

  constructor(room, game) {
    this.game = game
    this.room = room
    this.players = []
    this.gems = {}
    this.createGems()
  }

  createGems () {
    for(let y=0, l=this.room.map.length; y<l; y++) {
      for(let x=0, k=this.room.map[y].length; x<k; x++) {
        if(this.room.map[y][x] == this.treasureOriginTile) {
          const gem = { id: x + "," + y,  status: true, x, y }
          this.gems[gem.id] = gem
        }
      }
    }
  }
  
  checkGems () {
    const newGems = []
    for(let i in this.gems) {
      const gem = this.gems[i]
      if(!gem.status) {
        gem.status = true
        newGems.push(gem.id)
      }
    }
    if(newGems.length > 0)
      this.sendGems(newGems)
  }
  
  checkGem (gemId) {
    const gem = this.gems[gemId],
          newGems = []
    if(gem && !gem.status) {
        gem.status = true
        newGems.push(gem.id)
        this.sendGems(newGems)
    }
  }
  
  sendGems (gems) {
    for(let player of this.players) {
      player.client.emit("gemBirth", gems)
    }
  }

  sendGemRemove (gemId) {
    for(let player of this.players) {
      player.client.emit("gemRemove", gemId)
    }
  }

  addPlayer (player) {
    this.players.push(player)
    player.room = this
    player.client.on('gemPicked', (...args) => this.pickGem(...args, player))
  }
  
  removePlayer (player) {
    this.players.splice(this.players.findIndex(p => p.id === player.id), 1)
  }
  
  pickGem (gemId, player) {
    if (this.gems[gemId] && this.gems[gemId].status) {
      player.gemCount++
      this.gems[gemId].status = false
      this.sendGemRemove(gemId)
      setTimeout(() => this.checkGem(gemId), gemInterval)
    }
  }
  
  toJson () {
    return {
      room: this.room,
      gems: this.gems
    }
  }
  
}

module.exports.Room = Room

module.exports.rooms = [
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
]
