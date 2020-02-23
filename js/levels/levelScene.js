class LevelScene extends Scene {
  constructor(gameScene, obj = {
    UI: [],
    gameObjects: []
  }) {
    super(obj)
    this.gameScene = gameScene
    this.cave = null
    this.app = null
  }

  preCheck(){
    return true
  }

  postCheck(){
    this.gameScene.sceneTracker.nextScene()
  }

  init(app, preCheck, postCheck){
    this.preCheck = preCheck || this.preCheck
    this.postCheck = postCheck || this.postCheck
    
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

    this.app = app

    this.cave = new LevelCave(this.gameScene.characters, app.sprites["cave_ceiling"], app.sprites["floor"], app.sprites["background"])
    this.stage.addChild(this.cave.stage)

    this.ui = new LevelUI(this.gameScene.characters, this, app)
    this.stage.addChild(this.ui.stage)
    this.UI.push(this.ui)
  }

  update(dt) {
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
}


class LevelCave extends GameObject {
  constructor(characters, foreground, floor, background){
    super()
    this.stage = new PIXI.Container()
    this.stage.width = 480
    this.stage.height = 160
    this.characters = characters
    if(background){
      background.x = 0
      background.y = 0
      this.stage.addChild(background)
    }
    for(let c in characters){
      this.stage.addChild(characters[c].sprite)
      console.log(characters[c].sprite)
    }
    if(foreground){
      foreground.x = -Math.floor(Math.random()*480)
      this.stage.addChild(foreground)
    }
    if(floor){
      floor.x = 0
      floor.y = 160
      this.stage.addChild(floor)
    }
  }
}

class LevelUI extends Scene {
  constructor(characters, scene, app){
    super({UI: [], gameObjects: []})
    this.parentScene = scene
    this.app = app

    this.stage.width = 480
    this.stage.height = 320
    this.stage.y = 160
    this.stage.x = 0

    this.charSelection = new CharacterSelection(characters, this)
    this.UI.push(this.charSelection)
    this.stage.addChild(this.charSelection.stage)

    this.characterAction = new CharacterAction(this)
    this.characterInfo = new CharacterInfo(characters, this, "Necromancer")
    
    this.obstacleInfo = new ObstacleInfo("this is the first one in a series of a long series of texts. Gotta put all this knowledge and information here, otherwiseitsdsfjsdjhflk;sjdfjldsfjl")

    this.displayingObstacle = false
    this.displayObstacle()
  }

  removeComponent(component){
    let idx = this.UI.indexOf(component)
    if(idx>=0){ this.UI.splice(idx, 1) }
    this.stage.removeChild(component.stage)
  }

  addComponent(component){
    this.stage.addChild(component.stage)
    this.UI.push(component)
  }

  displayCharacterInfo(){
    if(this.displayingObstacle){
      this.removeComponent(this.obstacleInfo)
      
      this.addComponent(this.characterAction)
      this.addComponent(this.characterInfo)
      this.displayingObstacle = false
    }
  }

  displayObstacle(){
    if(!this.displayingObstacle){
      console.log("Displaying obstacle")
      this.removeComponent(this.characterAction)
      this.removeComponent(this.characterInfo)

      this.addComponent(this.obstacleInfo)
      this.displayingObstacle = true
    }
  }

  volunteer(){
    let current = this.charSelection.getActiveCharacter()
    if(current){
      console.log(current.name + "is volunteering")
    } else {
      alert("Something fishy is going on. Error code: 0")
    }
    this.parentScene.postCheck(current)
  }

  changeDisplay(key){
    this.parentScene.changeDisplay(key)
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