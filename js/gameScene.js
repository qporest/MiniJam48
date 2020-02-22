class GameScene extends Scene {
  constructor(obj = {
    UI: [],
    gameObjects: []
  }) {
    super(obj)
    /* layers are for interaction with static layered objects */
    this.layers = []
    this.script = {
      0: {
        scene: new LevelScene(this),
        next: 1
      },
      1: {
        scene: new LevelScene(this),
        next: "final"
      }
    }
  }

  init(app){
    super.init(app)
    this.app = app
    // Adding map
    //this.scriptSystem = new ScriptSystem(this)
    this.setupStage(app)
    this.initGameLogic(app)

    this.sceneTracker = new SceneTracker(this, app, this.script)
    this.currentSong = null

    this.sceneTracker.setScene()
  }

  initGameLogic(app){
    this.characters = {
      "Necromancer": new Character("Petya the necromancer", getRectangle(48, 80), 0),
      "Dog": new Character("Dog", app.sprites["fox"], 1),
      "Elf": new Character("Elf", getRectangle(48, 80), 2),
      "Clerik": new Character("Clerik", app.sprites["cleric"], 3),
      "Human": new Character("Human", getRectangle(48, 80), 4)
    }
  }

  setupStage(app){
    this.actual_stage = this.stage
    this.stage = new PIXI.Container()
    this.actual_stage.addChild(this.stage)

    this.stage.x = app.canvas.width/2 - this.stage.width/2
    this.stage.y = app.canvas.height/2 - this.stage.height/2
  }

  setMusic(song){
    if(!this.app.musicEnabled){
      return
    }

    if(this.currentSong){
      sounds[this.currentSong].fadeOut(3)
    }
    sounds[song].loop = true
    sounds[song].volume = 0.7
    this.currentSong = song
    sounds[song].play()
  }

  processEvt(evt) {
    if(evt.type=="touch"){
      let processed = false
      for(let layer of this.layers){
        let in_layer = false 
        for(let obj of layer){
          in_layer = obj.processEvt(evt)
          if(in_layer){processed = true}
        }
        if(processed){ break }
      }
    } else {
      super.processEvt(evt)
    }
  }

  gameFinished(){
    console.log("You got to the end? Really?")
  }

}

class SceneTracker {
  constructor(scene, app, script){
    this.parent_scene = scene
    this.script = script
    this.app = app
    this.currentScene = 0
  }

  setScene(){
    this.script[this.currentScene]["scene"].init(this.app)
    this.app.pushScene(this.script[this.currentScene]["scene"])
  }

  nextScene(){
    this.app.popScene()
    let next = this.script[this.currentScene]["next"]
    if (next == "final"){
      this.parent_scene.gameFinished()
    } else {
      this.currentScene = next
      this.setScene()
    }
  }
}