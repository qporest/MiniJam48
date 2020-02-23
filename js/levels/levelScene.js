class LevelScene extends Scene {
  constructor(gameScene, obj = {
    UI: [],
    gameObjects: []
  }, obstacle = {
    text: "test",
    sprite: getRectangle(120, 120)
  }, preCheckFailure="test", sacrificial=true) {
    super(obj)
    this.gameScene = gameScene
    this.cave = null
    this.app = null
    this.sacrificial = sacrificial
    this.obstacleText = obstacle.text
    this.obstacleSprite = obstacle.sprite
    this.preCheckFailure = preCheckFailure
  }

  preCheck(characters){
    return true
  }

  postCheck(character, characters){
    return true
  }

  showDialog(obj){
    console.log("Showing dialogue to say "+obj.text)
    let dialogue = new DialogueScene()
    dialogue.init(this.app)
    this.app.pushScene(dialogue)
    dialogue.setDialogue(obj)
  }

  finish(character){
    if(this.sacrificial){
      delete this.characters[character.name]
    }
    if(this.postCheck.bind(this)(character, this.characters)){
      this.gameScene.sceneTracker.nextScene()
      this.showDialog({text: "Well done"})
    } else {
      this.showDialog({text: "It sucks to suck"})
    }
  }

  init(app, preCheck, postCheck){
    super.init(app)
    this.preCheck = preCheck || this.preCheck
    this.postCheck = postCheck || this.postCheck

    this.HEIGHT = 480
    this.WIDTH = 480

    this.app = app
    this.characters = this.gameScene.characters

    this.cave = new LevelCave(this.characters, app.sprites["cave_ceiling"], app.sprites["floor"], app.sprites["background"], this.obstacleSprite)
    this.stage.addChild(this.cave.stage)

    this.ui = new LevelUI(this.characters, this, app)
    this.stage.addChild(this.ui.stage)
    this.UI.push(this.ui)

    /* Some wrong decision was made before, dispay the losing screen */
    if(!this.preCheck.bind(this)(this.characters)){
      console.log(app.eventBuffer)
    }
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
        this.app.eventBuffer.push({type: "refreshInfo", key: key})
      break;
    }
  }

  processEvt(evt){
    console.log("Got an event!!")
    super.processEvt(evt)
    if(evt.type==="showLevelDialog"){
      this.showDialog({text: evt.text})
      evt.processed = true
    }
  }
}


class LevelCave extends GameObject {
  constructor(characters, foreground, floor, background, obstacle){
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
    }

    if(obstacle){
      obstacle.x = 340
      obstacle.y = 160
      obstacle.pivot.set(0, obstacle.height)
      this.stage.addChild(obstacle)
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
    this.characterInfo = new CharacterInfo(characters, this, Object.keys(characters)[0])
    
    this.obstacleInfo = new ObstacleInfo(this.parentScene.obstacleText)

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
    this.parentScene.finish(current)
  }

  changeDisplay(key){
    this.parentScene.changeDisplay(key)
  }

  processEvt(evt){
    super.processEvt(evt)
    if(evt.type=="switchInfo"){
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