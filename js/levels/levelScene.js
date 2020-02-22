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

    this.cave = new LevelCave(this.gameScene.characters, null)
    this.charSelection = new CharacterSelection(this.gameScene.characters, this)

    this.stage.addChild(this.cave.stage)
    this.stage.addChild(this.charSelection.stage)
    this.gameObjects.push(this.cave)
    this.gameObjects.push(this.charSelection)
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
    console.log(this.stage.y)
    for(let c in characters){
      this.stage.addChild(characters[c].sprite)
      console.log(characters[c].sprite)
    }
  }
}

class CharacterSelection extends GameObject {
  constructor(characters, scene){
    super()
    this.stage = new PIXI.Container()
    this.stage.width = 480
    this.stage.height = 40
    this.stage.y = 160
    this.stage.x = 0

    this.characters = characters
    for(let c in characters){
      let rectangle = getRectangle(30, 30)
      rectangle.x = characters[c].sprite.x+9
      rectangle.y = 5
      this.stage.addChild(rectangle)
    }
  }
}

class LevelUI extends PIXIGameObject {
  
}