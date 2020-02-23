class GameScene extends Scene {
  constructor(obj = {
    UI: [],
    gameObjects: []
  }) {
    super(obj)
    /* layers are for interaction with static layered objects */
    this.layers = []
    this.script = null
  }

  init(app){
    super.init(app)
    this.app = app
    //this.scriptSystem = new ScriptSystem(this)
    this.setupStage(app)
    this.initGameLogic(app)

    this.sceneTracker = new SceneTracker(this, app)
    this.script = this.sceneTracker.script
    this.currentSong = null

    this.sceneTracker.setScene()
  }

  initGameLogic(app){
    this.characters = {
      "Necromancer": new Character(
        "Necromancer",
        "Race:ogre   class:necromancer", 
        getRectangle(48, 80), 
        0,
        {
          necromancy: true
        }
      ),
      "Fox": new Character(
        "Fox",
        "Race:fox    class:k9",
        app.sprites["fox"], 
        4
      ),
      "Elf": new Character(
        "Elf",
        "Race:elf    class:royalty",
        getRectangle(48, 80), 
        2
      ),
      "Cleric": new Character(
        "Cleric", 
        "Race:human  class:cleric", 
        app.sprites["cleric"], 
        3
      ),
      "Dwarf": new Character(
        "Dwarf",   
        "Race:dwarf  class:warrior", 
        getRectangle(48, 60), 
        1,
        {
          dwarf: true
        }
      )
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
  constructor(scene, app){
    this.gameScene = scene
    this.app = app
    this.currentScene = 0
    this.initDB()
    this.script = {
      0: {
        scene: new LevelScene(this.gameScene, undefined, {
            text: this.db["obstacles"]["0"]["description"]
          }, 
          this.db["obstacles"]["0"]["preCheckFailure"]
        ),
        next: 1
      },
      1: {
        scene: new LevelScene(this.gameScene, undefined, {
            text: this.db["obstacles"]["1"]["description"]
          }, 
          this.db["obstacles"]["1"]["preCheckFailure"],
          false
        ),
        postCheck: (char, chars)=>Object.values(chars).filter(x=>x.params.necromancy).length > 0,
        next: 2
      },
      2: {
        scene: new LevelScene(this.gameScene, undefined, {
            text: this.db["obstacles"]["2"]["description"]
          }, 
          this.db["obstacles"]["2"]["preCheckFailure"],
          false
        ),
        preCheck: function(chars){
          if(Object.values(chars).filter(x=>x.params.dwarf).length == 0){
            console.log("Dwarf text event")
            app.eventBuffer.push({
              type: "showLevelDialog",
              text: "Unfortunately without dwarf our chances are 1 in 3",
              persistent: true
            })
            console.log(app.eventBuffer[app.eventBuffer.length-1])
          }
          return true
        },
        postCheck: function(char, chars){
          if(Object.values(chars).filter(x=>x.params.dwarf).length == 0){
            if(Math.floor(Math.random()*100)<33){
              return true
            } else {
              return false
            }
          }
          return true
        },
        next: "final"
      },
    }
  }

  setScene(){
    this.script[this.currentScene]["scene"].init(this.app, this.script[this.currentScene]["preCheck"], this.script[this.currentScene]["postCheck"])
    this.app.pushScene(this.script[this.currentScene]["scene"])
  }

  nextScene(){
    this.app.popScene()
    let next = this.script[this.currentScene]["next"]
    if (next == "final"){
      this.gameScene.gameFinished()
    } else {
      this.currentScene = next
      this.setScene()
    }
  }

  initDB(){

    this.db = {
      "Necromancer": {
        "0": {
          thinking: "",
          sacrifice: ""
        },
        "1": {
          thinking: "",
          sacrifice: ""
        },
        "2": {
          thinking: "",
          sacrifice: ""
        },
        "3": {
          thinking: "",
          sacrifice: ""
        },
        "4": {
          thinking: "",
          sacrifice: ""
        },
        "5": {
          thinking: "",
          sacrifice: ""
        },
        "6": {
          thinking: "",
          sacrifice: ""
        },
        "7": {
          thinking: "",
          sacrifice: ""          
        }
      },
      "Fox": {
        "0": {
          thinking: "",
          sacrifice: ""
        },
        "1": {
          thinking: "",
          sacrifice: ""
        },
        "2": {
          thinking: "",
          sacrifice: ""
        },
        "3": {
          thinking: "",
          sacrifice: ""
        },
        "4": {
          thinking: "",
          sacrifice: ""
        },
        "5": {
          thinking: "",
          sacrifice: ""
        },
        "6": {
          thinking: "",
          sacrifice: ""
        },
        "7": {
          thinking: "",
          sacrifice: ""          
        }
      },
      "Cleric": {
        "0": {
          thinking: "",
          sacrifice: ""
        },
        "1": {
          thinking: "",
          sacrifice: ""
        },
        "2": {
          thinking: "",
          sacrifice: ""
        },
        "3": {
          thinking: "",
          sacrifice: ""
        },
        "4": {
          thinking: "",
          sacrifice: ""
        },
        "5": {
          thinking: "",
          sacrifice: ""
        },
        "6": {
          thinking: "",
          sacrifice: ""
        },
        "7": {
          thinking: "",
          sacrifice: ""          
        }
      },
      "Dwarf": {
        "0": {
          thinking: "",
          sacrifice: ""
        },
        "1": {
          thinking: "",
          sacrifice: ""
        },
        "2": {
          thinking: "",
          sacrifice: ""
        },
        "3": {
          thinking: "",
          sacrifice: ""
        },
        "4": {
          thinking: "",
          sacrifice: ""
        },
        "5": {
          thinking: "",
          sacrifice: ""
        },
        "6": {
          thinking: "",
          sacrifice: ""
        },
        "7": {
          thinking: "",
          sacrifice: ""          
        }
      },
      "Elf": {
        "0": {
          thinking: "",
          sacrifice: ""
        },
        "1": {
          thinking: "",
          sacrifice: ""
        },
        "2": {
          thinking: "",
          sacrifice: ""
        },
        "3": {
          thinking: "",
          sacrifice: ""
        },
        "4": {
          thinking: "",
          sacrifice: ""
        },
        "5": {
          thinking: "",
          sacrifice: ""
        },
        "6": {
          thinking: "",
          sacrifice: ""
        },
        "7": {
          thinking: "",
          sacrifice: ""          
        }
      },
      "obstacles": {
        "0": {
          description: "",
          preCheckFailure: ""
        },
        "1": {
          description: "",
          preCheckFailure: ""
        },
        "2": {
          description: "",
          preCheckFailure: ""
        },
        "3": {
          description: "",
          preCheckFailure: ""
        },
        "4": {
          description: "",
          preCheckFailure: ""
        },
        "5": {
          description: "",
          preCheckFailure: ""
        },
        "6": {
          description: "",
          preCheckFailure: ""
        },
        "7": {
          description: "",
          preCheckFailure: ""          
        }
      }
    }

  }
}