var CharacterType = function(options) {
  help.mergeWithModel(this, options);
};
CharacterType.prototype = {
  id: null,
  group: 'players',
  tileset: null,
  spriteSheetUrl: null
};