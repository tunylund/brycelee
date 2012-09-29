gbox.onLoad(function() {

    gbox.addImage('largefont', "images/font_anonymous_pro_regular_16px.png");
    gbox.addImage('mediumfont', "images/font_anonymous_pro_regular_12px.png");
    gbox.addImage('smallfont', "images/font_anonymous_pro_regular_9px.png");
    gbox.addImage('logo', "images/grails_logo.png");
    gbox.addImage('mapSpritesheet', "images/maptiles.png");
    gbox.addImage('asiaTiles', "images/maps/asia_tiles.png");

    // Fonts are mapped over an image, setting the first letter, the letter size, the length of all rows of letters and a horizontal/vertical gap.
    var largeFont = {
      image: 'largefont',
      firstletter: ' ',
      tileh: 24.9, tilew: 16, tilerow: 18,
      gapx: 0, gapy: 0 
    };
    var mediumFont = {
      image: 'mediumfont',
      firstletter: ' ',
      tileh: 18.7, tilew: 12, tilerow: 18,
      gapx: 0, gapy: 0 
    };
    var smallFont = {
      image: 'smallfont',
      firstletter: ' ',
      tileh: 14, tilew: 9, tilerow: 18,
      gapx: 0, gapy: 0 
    };
    gbox.addFont(help.mergeWithModel({id: 'small'}, smallFont));
    gbox.addFont(help.mergeWithModel({id: 'medium'}, mediumFont));
    gbox.addFont(help.mergeWithModel({id: 'large'}, largeFont));
    //gbox.addFont(help.mergeWithModel({id: 'small_red', gapy: smallFont.tileh}, smallFont));
    //gbox.addFont(help.mergeWithModel({id: 'small_white', gapy: smallFont.tileh*2}, smallFont));
    //gbox.addFont(help.mergeWithModel({id: 'small_green', gapy: smallFont.tileh*3}, smallFont));
    //gbox.addFont(help.mergeWithModel({id: 'small_blue', gapy: smallFont.tileh*4}, smallFont));
    /*
    var d = {
      //text: " !A",
      text: "~}|{zyxwvutsrqponmlkjihgfedcba`_^][ZYXWVUTSRQPONMLKJIHGFEDCBA@?>=<;:9876543210/.-,+*)('&%$#\"! ",
      //text: ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz{|}~',
      dx: 0,
      dy: 0,
      dw: gbox.getScreenW(),
      dh: gbox.getScreenH(),
      alpha: 1
    };
    var f = gbox.getFont('large');
    gbox.blitText(ctx, help.mergeWithModel({ font: 'large'}, d));
    gbox.blitText(ctx, help.mergeWithModel({ font: 'small_white', dy: f.tileh}, d));
    gbox.blitText(ctx, help.mergeWithModel({ font: 'small_red', dy: f.tileh*2}, d));
    gbox.blitText(ctx, help.mergeWithModel({ font: 'small_blue', dy: f.tileh*3}, d));
    gbox.blitText(ctx, help.mergeWithModel({ font: 'small_green', dy: f.tileh*4}, d));
    */

    gbox.addTiles({
      id: 'mapTiles',
      image: 'mapSpritesheet',
      tileh: 16, 
      tilew: 16, 
      tilerow: 5,
      gapx: 0, 
      gapy: 0 
    });
    
    gbox.addTiles({
      id: 'asiaTiles',
      image: 'asiaTiles',
      tileh: 16, 
      tilew: 16, 
      tilerow: 5,
      gapx: 0, 
      gapy: 0 
    });
    
    /*
    gbox.addRoom({
      id: 'room',
      url: '/game/room'
    });
    
    gbox.addPlayer({
      url: '/game/player'
    });
    */
    gbox.setDebugFont("js/lib/akihabara-core-1.3.1/akihabara/debugfont.png");
    
});
