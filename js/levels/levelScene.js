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
    this.textObject = new PIXI.Text("Loading?", textStyle)
    this.textObject.x = this.WIDTH/2 - this.textObject.width/2
    this.textObject.y = this.HEIGHT/2 - this.textObject.height/2

    this.cave = new LevelCave(this.gameScene.characters, null)
    this.stage.addChild(this.textObject)

    this.stage.addChild(this.cave.stage)
    this.gameObjects.push(this.cave)
  }

  update(dt) {
    this.textObject.text += ""
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

class LevelUI extends PIXIGameObject {
  
}