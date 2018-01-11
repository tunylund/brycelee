import loadResources from './resources.mjs'
import overwriteGbox from './gbox_bl.mjs'
import game from './game.mjs'

overwriteGbox(gbox)
loadResources(gbox)
gbox.onLoad(game.init)
