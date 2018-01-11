gbox.onLoad(function() {

    gbox.addImage('largefont', "images/font_anonymous_pro_regular_16px.png");
    gbox.addImage('mediumfont', "images/font_anonymous_pro_regular_12px.png");
    gbox.addImage('smallfont', "images/font_anonymous_pro_regular_9px.png");
    gbox.addImage('mapSpritesheet', "images/maptiles.png");
    gbox.addImage('asiaTiles', "images/maps/asia_tiles.png");

    gbox.addFont({
      id: 'large',
      image: 'largefont',
      firstletter: ' ',
      tileh: 24.9, tilew: 16, tilerow: 18,
      gapx: 0, gapy: 0 
    })
    gbox.addFont({
      id: 'medium',
      image: 'mediumfont',
      firstletter: ' ',
      tileh: 18.7, tilew: 12, tilerow: 18,
      gapx: 0, gapy: 0 
    })
    gbox.addFont({
      id: 'small',
      image: 'smallfont',
      firstletter: ' ',
      tileh: 14, tilew: 9, tilerow: 18,
      gapx: 0, gapy: 0 
    })
    
    gbox.addTiles({
      id: 'mapTiles',
      image: 'mapSpritesheet',
      tileh: 16,
      tilew: 16,
      tilerow: 5,
      gapx: 0,
      gapy: 0
    })

    gbox.addTiles({
      id: 'asiaTiles',
      image: 'asiaTiles',
      tileh: 16,
      tilew: 16,
      tilerow: 5,
      gapx: 0,
      gapy: 0
    })

})
