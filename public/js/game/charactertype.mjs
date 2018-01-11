class CharacterType {

  constructor (options) {
    this.id = null
    this.group = 'players'
    this.tileset = null
    this.spriteSheetUrl = null
    Object.assign(this, options)
  }

}

export default CharacterType