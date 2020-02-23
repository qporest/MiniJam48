class LevelScene extends Scene {
  constructor(gameScene, obj = {
    UI: [],
    gameObjects: []
  }) {
    super(obj)
    this.gameScene = gameScene
    this.cave = null
  }

  init(app){
    this.HEIGHT = 480
    this.WIDTH = 480
    let textStyle = new PIXI.TextStyle({
      fontFamily: "arcade",
      fontSize: 36,
      fill: "#DDDCD6",
      stroke: "black",
      strokeThickness: 0,
      wordWrap: true,
      wordWrapWidth: 400
    })

    this.cave = new LevelCave(this.gameScene.characters, app.sprites["cave_ceiling"])
    this.stage.addChild(this.cave.stage)

    this.ui = new LevelUI(this.gameScene.characters, this)
    this.stage.addChild(this.ui.stage)
    this.UI.push(this.ui)
  }

  update(dt) {
  }

  render() {
    // console.log("I was rendered")
  }
}


class LevelCave extends GameObject {
  constructor(characters, background){
    super()
    this.stage = new PIXI.Container()
    this.stage.width = 480
    this.stage.height = 160

    this.characters = characters
    if(background){
      this.stage.addChild(background)
    }
    console.log(this.stage.y)
    for(let c in characters){
      this.stage.addChild(characters[c].sprite)
      console.log(characters[c].sprite)
    }
  }
}

class LevelUI extends Scene {
  constructor(characters, scene){
    super({UI: [], gameObjects: []})
    this.gameScene = scene

    this.stage.width = 480
    this.stage.height = 320
    this.stage.y = 160
    this.stage.x = 0

    this.charSelection = new CharacterSelection(characters, this)
    this.UI.push(this.charSelection)
    this.stage.addChild(this.charSelection.stage)

    this.characterAction = new CharacterAction(this)
    this.stage.addChild(this.characterAction.stage)
    this.UI.push(this.characterAction)

    this.charInfo = new CharacterInfo(characters, this, "Necromancer")
    this.stage.addChild(this.charInfo.stage)
  }

  volunteer(){
    console.log("volunteering")
  }
}