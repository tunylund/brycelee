$.mockjax({
  url: "/status",
  contentType: "application/json",
  responseText: {
    players: 9,
    rooms: 4,
    startTime: new Date().getTime() - (60*60*15 + 60*18 + 45)*1000
  }
});

$.mockjax({
  url: "/connect",
  responseText: {
    status: "success",
    data: {
      room: {
        id: "room_1",
        backgroundImageUrl: "images/bg.png",
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
      player: {
        id: "player_123",
        tileset: "ninja",
        characterType: {
          id: "ninja",
          spriteSheetUrl: "images/characters/ninja/spritesheet.png",
          tileset: "ninja"
        }
      }
    }
  }
});

$.mockjax({
  url: "game/player",
  responseText: {
    status: "success",
    data: {
      player: {
        id: "player_123",
        tileset: "ninja"
      },
      characterType: {
        id: "ninja",
        spriteSheetUrl: "images/characters/ninja/spritesheet.png",
        tileset: "ninja"
      }
    }
  }
});