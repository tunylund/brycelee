

help.getAbsCollision = function(th,col) {
  col = col || th.collision;
  return {
      x: th.x + col.x,
      y: th.y + col.y,
      w: col.w,
      h: col.h,
      hw: col.hw,
      hh: col.hh,
  };
};

help.hwhh = function(arr) {
  if(arr && arr.length) {
    for(var i=0; i<arr.length; i++) {
      var item = arr[i];
      if(item && item.h && item.w) {
        item.hw = item.w/2;
        item.hh = item.h/2;
      }
    }
  } else if(arr && arr.h && arr.w) {
    arr.hw = arr.w/2;
    arr.hh = arr.h/2;
  }
}

help.mirror = function(origin, collision) {
  return {
    x: origin.w - collision.x - collision.w,
    y: collision.y,
    h: collision.h,
    w: collision.w,
    hw: collision.hw,
    hh: collision.hh
  };
};

toys.brucelee = help.mergeWithModel({

    spawn:function(th,data) {
      th.collision = th.characterType.collisions[0];
      th.accx = 0;
      th.accy = 0;
      th.side = true;
      th.frame = 0;
      this.setCollision(th);
      return toys.platformer.spawn(th, data);
    },

    handleAccellerations:function(th) {
        // Gravity
        if (!th.touchedfloor && !th.touchedLadder) th.accy++;
        // Attrito
        if (th.pushing==toys.PUSH_NONE) 
          if (th.accx) th.accx=help.goToZero(th.accx);
    },
    
    verticalTileCollision:function(th) {
        
      var col = help.getAbsCollision(th),
          map = game.map,
          t = col.hw/2;
      th.touchedfloor=false;
      th.touchedceil=false;
      th.walkingOnLadder=false;

      while (t<col.w) {
        var top = help.getTileInMap(col.x + t, col.y, map, -1),
            bottom = help.getTileInMap(col.x + t, col.y + col.h, map, -1);
        
        if (!th.touchedceil && th.accy<0 && map.tileIsSolidCeil(top)) {
          th.accy=0;
          th.y=help.yPixelToTile(map,col.y,1) - th.collision.y;
          th.touchedceil=true;
        }
        
        if (!th.touchedfloor && map.tileIsSolidFloor(bottom)) {
          th.accy=0;
          th.y=help.yPixelToTile(map,col.y+col.h) - th.collision.y - th.collision.h;
          th.touchedfloor=true;
        }
        
        if (!th.touchedfloor && map.tileIsClimbthroughFloor(bottom)) {
          th.accy=0;
          th.touchedfloor=true;
          th.walkingOnLadder=true;
        }
        t+=col.hw
      }
    },
    
    horizontalTileCollision:function(th) {

        var t=0,
            col = help.getAbsCollision(th),
            map = game.map,
            tileh = gbox.getTiles(map.tileset).tileh;

        th.touchedleftwall=false;
        th.touchedrightwall=false;

        while (t<col.h) {
          var left=help.getTileInMap(col.x,col.y+t,map,-1),
              right=help.getTileInMap(col.x+col.w-1,col.y+t,map,-1);

          if (!th.touchedleftwall && th.accx<0 && map.tileIsSolidFloor(left)) {
            th.accx=0;
            th.x=help.xPixelToTile(map,col.x,1) - th.collision.x;
            th.touchedleftwall=true;
          } 
          if (!th.touchedrightwall && th.accx>0 && map.tileIsSolidFloor(right)) {
            th.accx=0;
            th.x=help.xPixelToTile(map,col.x + col.w,0) - th.collision.x - col.w;
            th.touchedrightwall=true;
          }
          t+=tileh;
        }

    },

    ladderTileCollision:function(th) {
        var col = help.getAbsCollision(th),
            map =game.map,
            x = col.x+col.hw,
            t = 0,
            tileh = gbox.getTiles(map.tileset).tileh/2;

        th.touchedLadder=false;
        while (t<col.h) {
          var tile    =   help.getTileInMap(x, col.y+t, map, -1);
          
          if (map.tileIsLadder(tile)) {
            th.isStriking=false;
            th.touchedLadder=true;
          }
          t+=tileh;
        }
    },
    
    gemCollision: function(th) {
      
      var col = help.getAbsCollision(th),
          map = game.map,
          t = 0,
          ts = gbox._tiles[map.tileset],
          ty = Math.floor((col.y-1)/ts.tileh);
          
      while (t<col.w) {

        var top = help.getTileInMap(col.x + t, col.y-1, map, -1);
        if (map.tileIsGemOrigin(top)) {
          
          var tx = Math.floor((col.x + t)/ts.tilew),
              gem = gbox._gems[tx+","+ty];
              
          if(gem && gem.status) {
            Connection.pickGem(gem);
            gem.status = false;
          }
        }
        t += col.hw;
      }
        
    },

    strikeCollision:function(th) {
      if(th.isStriking && th.strikeCollision) {
        var col = help.getAbsCollision(th, th.strikeCollision);
        
        var players = gbox.getGroup("players");
        for(var id in players) {
          var p = players[id];
          if(p.id != th.id && !p.isDead && gbox.collides(col, help.getAbsCollision(p)) && !p.vaitingForKillOrder) {
            if(p instanceof AutoPlayer) {
              p.die();
            } else {
              p.vaitingForKillOrder = true;
              Connection.kill(p.id);
            }
          }
        }
      }
    },
    
    clearKillOrders: function() {
      var players = gbox.getGroup("players");
      for(var id in players) {
        var p = players[id];
        p.vaitingForKillOrder = false;
      }
    },

    setFrame:function(th) {
    
      if(th.prep) {
        if(th.frame == th.prep.frames[th.prep.frames.length-1]) {
          th.prep = null;
        } else {
          th.frame = help.decideFrameOnce(th.counter, th.prep);
          return;
        }
      }
      
      var anim = null;
    
      if (th.isDead) {
        if(th.anim != th.frames.die)
          th.counter = 0;
        anim = th.frames.die;
      } 
      
      else if (th.touchedLadder) {
        if(th.accy!=0 || th.accx!=0)
          anim = th.frames.climb;
      } 
      
      else if (th.isStriking) {
        anim = th.frames.strike;
      }
      
      else if (th.touchedfloor) {
        anim = th.accx != 0 ? th.frames.run : th.frames.stand;
      }
      
      else if (th.accy>0) {
        anim = th.frames.fall
      }
          
      else if (th.accy<0) {
        anim = th.frames.jump
      }
      
      if(anim && th.anim)
        th.prep = th.frames["prep_for_" + anim.id + "_from_" + th.anim.id];
      
      if(th.prep)
        th.counter = 0;
      
      th.anim = anim;
      var a = th.prep || th.anim;
      if(a) {
        if(a.loop)
          th.frame = help.decideFrame(th.counter, a);
        else 
          th.frame = help.decideFrameOnce(th.counter, a);
      }
      
    },

    setCollision:function(th) {
      th.collision = help.cloneObject(th.characterType.collisions[th.frame]);
      th.strikeCollision = help.cloneObject(th.characterType.strikeCollisions[th.frame]);

      if(!th.side) {
        th.collision = help.mirror(th, th.collision);
        if(th.strikeCollision)
          th.strikeCollision = help.mirror(th, th.strikeCollision);
      }
      
    },

    guessPushing:function(th) {
      if (th.isStriking || th.isDead) {
        th.pushing=toys.PUSH_NONE;
      } else if (th.accx < 0) {
        th.pushing=toys.PUSH_LEFT;
      } else if (th.accx > 0) {
        th.pushing=toys.PUSH_RIGHT;
      } else th.pushing=toys.PUSH_NONE;
    },
    
    horizontalKeys:function(th) {
      var keys = conf.horizontalKeys,
          maxaccx = th.touchedLadder ? th.climbaccx : th.maxaccx;
      
      if (th.isStriking || th.isDead) {
        th.pushing=toys.PUSH_NONE;
      } 
      
      else if (gbox.keyIsPressed(keys.left)) {
        th.pushing=toys.PUSH_LEFT;
        th.accx=help.limit(th.accx-1,-maxaccx,maxaccx);
      } 
      
      else if (gbox.keyIsPressed(keys.right)) {
        th.pushing=toys.PUSH_RIGHT;
        th.accx=help.limit(th.accx+1,-maxaccx,maxaccx);
      } 
      
      else th.pushing=toys.PUSH_NONE;
      
    },

    strikeKeys:function(th) {
      var key = conf.strikeKeys;
      if (toys.brucelee.canStrike(th)
          && (gbox.keyIsHit(key.strike) || gbox.keyIsHit(key.b))) {
          th.counter = 0;
          th.isStriking = true;
          return true;
      }
    },
    
    canJump:function(th) {
        return th.touchedfloor && !th.isStriking && (!th.touchedLadder || th.walkingOnLadder)&& !th.isDead;
    },

    canStrike: function(th) {
        return !th.isStriking && !th.isDead && !th.touchedLadder;
    },

    canClimb:function(th) {
        return th.touchedLadder && !th.isStriking && !th.isDead;
    },

    canDescend:function(th) {
        return (th.walkingOnLadder || th.touchedLadder) && !th.isStriking && !th.isDead;
    },
    
    jumpKeys:function(th) {
        var key = conf.jumpKeys;
        if (this.canJump(th)
          && (gbox.keyIsHold(key.jump) || gbox.keyIsHold(key.a))
          && (th.curjsize==0)) {
          th.accy=-th.jumpaccy;
          th.curjsize=th.jumpsize;
          th.isStriking = false;
        } else if (th.curjsize
          && (gbox.keyIsHold(key.jump) || gbox.keyIsHold(key.a))) { // Jump modulation
          th.accy--;
          th.curjsize--;
          th.isStriking = false;
        } else
          th.curjsize=0;
    },

    climbKeys:function(th) {
      var key = conf.climbKeys;
      
      if(this.canDescend(th)) {
        if(gbox.keyIsPressed(key.descend))
          th.accy=th.climbaccy;
        else if(this.canClimb(th)) {
          if(gbox.keyIsPressed(key.climb))
            th.accy=-th.climbaccy;
          else
            th.accy=0;
        }
      }
    },
    
    stateChanged: function(th, st) {
      if(!st)
        return true;
      
      for(var i in st) {
        if(i != "frame" && i != "time" && st[i] !== th[i]) 
          return true;
      }
      return false;
    },

    autoEnemy: {

        first: function(th) {
          th.counter=(th.counter+1)%16;

          toys.brucelee.applyGravity(th);
          toys.brucelee.autoEnemy.horizontalKeys(th);
          toys.brucelee.verticalTileCollision(th,map,"map"); // vertical tile collision (i.e. floor)
          toys.brucelee.horizontalTileCollision(th,map,"map"); // horizontal tile collision (i.e. walls)
          toys.brucelee.autoEnemy.jumpKeys(th);
          toys.brucelee.handleAccellerations(th);

          toys.brucelee.setSide(th); // set horizontal side
          toys.brucelee.setFrame(th); // set the right animation frame
        },

        horizontalKeys: function(th) {

          var pl = gbox.player,
              maxaccx = th.touchedLadder ? th.climbaccx : th.maxaccx;
          
          if (th.isStriking || th.isDead) {
            th.pushing=toys.PUSH_NONE;
          } else if (pl.x < th.x) {
              th.pushing=toys.PUSH_LEFT;
              th.accx=help.limit(th.accx-1,-maxaccx,maxaccx);
          } else if (pl.x > th.x) {
              th.pushing=toys.PUSH_RIGHT;
              th.accx=help.limit(th.accx+1,-maxaccx,maxaccx);
          } else th.pushing=toys.PUSH_NONE;
        },

        jumpKeys:function(th,key) {
            var pl = gbox.player;
            if (toys.brucelee.canJump(th)&&pl.y<th.y&&(th.curjsize==0)) {
                th.accy=-th.jumpaccy;
                th.curjsize=th.jumpsize;
            } else if (th.curjsize&&pl.y<th.y) { // Jump modulation
                th.accy--;
                th.curjsize--;
            } else
                th.curjsize=0;
        }
      
    }

}, toys.platformer);
