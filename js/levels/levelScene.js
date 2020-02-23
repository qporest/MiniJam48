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

    this.cave = new LevelCave(this.gameScene.characters, app.sprites["cave_ceiling"], app.sprites["floor"])
    this.stage.addChild(this.cave.stage)

    this.ui = new LevelUI(this.gameScene.characters, this, app)
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
  constructor(characters, foreground, background){
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
    if(foreground){
      foreground.x = -Math.floor(Math.random()*480)
      this.stage.addChild(foreground)
    }
    if(background){
      background.x = 0
      background.y = 160
      this.stage.addChild(background)
    }
  }
}

class LevelUI extends Scene {
  constructor(characters, scene, app){
    super({UI: [], gameObjects: []})
    this.gameScene = scene
    this.app = app

    this.stage.width = 480
    this.stage.height = 320
    this.stage.y = 160
    this.stage.x = 0

    this.charSelection = new CharacterSelection(characters, this)
    this.UI.push(this.charSelection)
    this.stage.addChild(this.charSelection.stage)

    this.characterAction = new CharacterAction(this)
    this.UI.push(this.characterAction)

    this.characterInfo = new CharacterInfo(characters, this, "Necromancer")
    this.UI.push(this.characterInfo)

    this.obstacleInfo = new ObstacleInfo("this is the first one in a series of a long series of texts. Gotta put all this knowledge and information here, otherwiseitsdsfjsdjhflk;sjdfjldsfjl")
    this.UI.push(this.obstacleInfo)

    this.displayingObstacle = false
    this.displayObstacle()
  }

  displayCharacterInfo(){
    if(this.displayingObstacle){
      this.stage.removeChild(this.obstacleInfo.stage)
      this.stage.addChild(this.characterAction.stage)
      this.stage.addChild(this.characterInfo.stage)
      this.displayingObstacle = false
    }
  }

  displayObstacle(){
    if(!this.displayingObstacle){
      console.log("Displaying obstacle")
      this.stage.removeChild(this.characterAction.stage)
      this.stage.removeChild(this.characterInfo.stage)
      this.stage.addChild(this.obstacleInfo.stage)
      this.displayingObstacle = true
    }
  }

  volunteer(){
    console.log("volunteering")
  }

  changeDisplay(key){
    switch(key){
      case 49:
      case 50:
      case 51:
      case 52:
      case 53: 
      case 79:
        /* one of the characters or obstacle were clicked */
        this.app.eventBuffer.push({type: "switchInfo", key: key})
      break;
    }
  }

  processEvt(evt){
    super.processEvt(evt)
    if(evt.type=="switchInfo"){
      console.log("processing event in info")
      if(evt.key>=49 && evt.key<54){
        console.log("Displaying info")
        this.displayCharacterInfo()
      } else if(evt.key==79){
        console.log("Displaying obstacle")
        this.displayObstacle()
      }
    }
  }

}