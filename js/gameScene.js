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
        app.sprites["necromancer"], 
        {
          necromancy: true,
          soul:       false
        }
      ),
      "Fox": new Character(
        "Fox",
        this.sceneTracker,
        app.sprites["fox"],
        {
          skinny: true,
          thumbs: false
        } 
      ),
      "Elf": new Character(
        "Elf",
        this.sceneTracker,
        app.sprites["elf"],
        {
          skinny: true
        }
      ),
      "Cleric": new Character(
        "Cleric", 
        this.sceneTracker,
        app.sprites["cleric"],
        {
          healing: true
        }
      ),
      "Dwarf": new Character(
        "Dwarf",
        this.sceneTracker,  
        app.sprites["dwarf"],
        {
          dwarf:  true,
          strong: true
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
        // pulley / lever
        scene: new LevelScene(this.gameScene, undefined, {
            text: this.db["obstacles"]["0"]["description"]
          }, 
          this.db["obstacles"]["0"]["preCheckFailure"]
        ),
        next: 1
      },
      // magic Door
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
        // hungry guard
        scene: new LevelScene(this.gameScene, undefined, {
            text: this.db["obstacles"]["2"]["description"]
          }, 
          this.db["obstacles"]["2"]["preCheckFailure"],
          true
        ),
        postCheck: function(char, chars){
          return !char.params.skinny
        },
        next: "3"
      },
      "3": {
        // road fork
        scene: new LevelScene(this.gameScene, undefined, {
            text: this.db["obstacles"]["3"]["description"]
          }, 
          this.db["obstacles"]["3"]["preCheckFailure"],
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
          if(!char.params.dwarf){
            if(Math.floor(Math.random()*100)<33){
              return true
            } else {
              return false
            }
          }
          return true
        },
        next: "4"
      },
      "4": {
        // soul pit
        scene: new LevelScene(this.gameScene, undefined, {
            text: this.db["obstacles"]["4"]["description"]
          }, 
          this.db["obstacles"]["4"]["preCheckFailure"],
          true
        ),
        postCheck: function(char, chars){
          return char.params.soul
        },
        next: "5"
      },
      "5": {
        // big boulder
        scene: new LevelScene(this.gameScene, undefined, {
            text: this.db["obstacles"]["5"]["description"],
            sprite: this.app.sprites["boulder"]
          }, 
          this.db["obstacles"]["5"]["preCheckFailure"],
          false
        ),
        postCheck: function(char, chars){
          return char.params.strong
        },
        next: "6"
      },
      "6": {
        // gas
        scene: new LevelScene(this.gameScene, undefined, {
            text: this.db["obstacles"]["6"]["description"]
          }, 
          this.db["obstacles"]["6"]["preCheckFailure"],
          true
        ),
        preCheck: function(chars){
          return Object.values(chars).filter(x=>x.params.healing).length > 0
        },
        next: "7"
      },
      "7": {
        // door to exit
        scene: new LevelScene(this.gameScene, undefined, {
            text: this.db["obstacles"]["7"]["description"]
          }, 
          this.db["obstacles"]["7"]["preCheckFailure"],
          true
        ),
        postCheck: function(char, chars){
          return char.params.thumbs
        },
        next: "final"
      },
    }
  }

  getCharacterDialog(char){
    return this.db[char][this.currentScene].thinking
  }

  getCharacterSacrifice(char){
    return this.db[char][this.currentScene].sacrifice
  }

  getFailureMessage(char){
    return this.db[char][this.currentScene].fail
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

  setSceneN(num){
    this.app.eventBuffer.push({
      type: "nextScene"
    })
    this.app.popScene()
    this.currentScene = num
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
          pos: 2
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
          pos: 3,
        },
        "0": {
          thinking: "An opportunity for sacrifice? This early on? It's not a battle death, but a worthy sacrifice is still a ticket to Valhalla.",
          sacrifice: "I hope you get to live. Mostly so that you get to tell the tale of my brave sacrifice! Also, please check that my lights are off at home. For the planet.",
          fail: "",
        },
        "1": {
          thinking: "No wonder he couldn't finish his writing. Those masonry tools are so outdated, at least for dwarves ha-ha-ha.",
          sacrifice: "",
          fail: "Group placed their trust in dwarf due to his masonry experience. This had nothing to do with the magic door however, and they couldn't get out of the room before evil forces catching up to them."
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
          thinking: "That lever looks rusty. Royalty never shall touch rusty objects, but I can't lose face either, so whatever needs to be done.",
          sacrifice: "Tell the tale to my kingdom, let them know that elvian princesses die with class."
        },
        "1": {
          thinking: "I bet I can learn what this skeleton is thinking by practicing my method acting. Though it's kind of dirty over there.",
          sacrifice:"",
          fail: "The princess employed her method acting skills to really get in the mind of the skeleton and find out what the final word was."+
            "This did not yield any results and the evil caught up with the group."
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
          description: `There's an insciption on the wall. It says "To pass without harm one must say the magical word - ", and then it stops.\n`+
          "There's a skeleton below the insciption, still holding his masonry tools - bound to forever work on the writing and never finish it.",
          preCheckFailure: ""
        },
        "2": {
          description: "hungry monstah",
          preCheckFailure: ""
        },
        "3": {
          description: "fork",
          preCheckFailure: ""
        },
        "4": {
          description: "pit",
          preCheckFailure: ""
        },
        "5": {
          description: "boulder",
          preCheckFailure: ""
        },
        "6": {
          description: "antidote",
          preCheckFailure: ""
        },
        "7": {
          description: "door",
          preCheckFailure: ""          
        }
      }
    }

  }
}