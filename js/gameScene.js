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

    this.sceneTracker = new SceneTracker(this, app)
    this.script = this.sceneTracker.script
    this.currentSong = null

    this.setupStage(app)
    this.initGameLogic(app)

    this.sceneTracker.setScene()
  }

  initGameLogic(app){
    this.characters = {
      "Necromancer": new Character(
        "Necromancer",
        this.sceneTracker,
        getRectangle(48, 80), 
        {
          necromancy: true
        }
      ),
      "Fox": new Character(
        "Fox",
        this.sceneTracker,
        app.sprites["fox"], 
      ),
      "Elf": new Character(
        "Elf",
        this.sceneTracker,
        app.sprites["elf"], 
      ),
      "Cleric": new Character(
        "Cleric", 
        this.sceneTracker,
        app.sprites["cleric"], 
      ),
      "Dwarf": new Character(
        "Dwarf",
        this.sceneTracker,  
        getRectangle(48, 60), 
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
    super.processEvt(evt)
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
      "0": {
        scene: new LevelScene(this.gameScene, undefined, {
            text: this.db["obstacles"]["0"]["description"]
          }, 
          this.db["obstacles"]["0"]["preCheckFailure"]
        ),
        next: 1
      },
      "1": {
        scene: new LevelScene(this.gameScene, undefined, {
            text: this.db["obstacles"]["1"]["description"]
          }, 
          this.db["obstacles"]["1"]["preCheckFailure"],
          false
        ),
        postCheck: (char, chars)=>char.params.necromancy,
        next: 2
      },
      "2": {
        scene: new LevelScene(this.gameScene, undefined, {
            text: this.db["obstacles"]["2"]["description"]
          }, 
          this.db["obstacles"]["2"]["preCheckFailure"],
          false
        ),
        preCheck: function(chars){
          if(Object.values(chars).filter(x=>x.params.dwarf).length == 0){
            console.log("Dwarf text event")
            this.ui.obstacleInfo.displayInfo(this.ui.obstacleInfo.text + "\n"+
            "Unfortunately without dwarf our chances are 1 in 3 to pick the right door that's not a trap.")
          } else {
            this.ui.obstacleInfo.displayInfo(this.ui.obstacleInfo.text + "\n"+
            "Fortunately dwarf remembers his native language, maybe we should let him take a lead on this.")
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

  getCharacterDialog(char){
    return this.db[char][this.currentScene].thinking
  }
  getCharacterInfo(char){
    return this.db[char]["info"]
  }

  setScene(){
    this.app.eventBuffer.push({
      type: "nextScene"
    })
    this.script[this.currentScene]["scene"].init(this.app, this.script[this.currentScene]["preCheck"], this.script[this.currentScene]["postCheck"])
    this.app.pushScene(this.script[this.currentScene]["scene"])
  }

  gameOver(){
    this.app.popScene()
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
        "info":{
          bio: "This is a test fake bio. As fake as it gets tbh",
          role: "Race:ogre   class:necromancer",
          pos: 0
        },
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
        "info":{
          bio: "This is a test fake bio. As fake as it gets tbh",
          role:"Race:fox    class:k9",
          pos: 4
        },
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
        "info":{
          bio: "This is a test fake bio. As fake as it gets tbh",
          role:"Race:human  class:cleric",
          pos: 3
        },
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
        "info":{
          bio: "This is a test fake bio. As fake as it gets tbh",
          role:"Race:dwarf  class:warrior",
          pos: 2,
        },
        "0": {
          thinking: "An opportunity for sacrifice? This early on? It's not a battle death, but a worthy sacrifice is still a ticket to Valhalla.",
          sacrifice: "I hope you get to live. Mostly so that you get to tell the tale of my brave sacrifice! Also, please check that my lights are off at home. For the planet."
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
        "info":{
          bio: "This is a test fake bio. As fake as it gets tbh",
          role:"Race:elf    class:royalty",
          pos: 1
        },
        "0": {
          thinking: "That level looks rusty. Royalty never shall touch rusty objects, but I can't lose face either, so whatever needs to be done.",
          sacrifice: ""
        },
        "1": {
          thinking: "All these skeletons make me think that maybe underneath our bodies we are all the same. Except the dwarves of course.",
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
          description: "It's clear from the beginning - not everyone will make it out alive.\n" +
          "You see a metal gate and a lever that opens it. It looks like someone might need to keep it open so others can pass.",
          preCheckFailure: ""
        },
        "1": {
          description: `There's an insciption on the wall. It says "To pass without harm one must say the magical word - ", and then it stops.
          There's a skeleton below the insciption, still holding his masonry tools - bounded to forever work on the writing and never finish it.`,
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