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
    console.log("Initializing game")
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
        app.sprites["necromancerIcon"],
        {
          necromancy: true,
          soul:       false
        }
      ),
      "Fox": new Character(
        "Fox",
        this.sceneTracker,
        app.sprites["fox"],
        app.sprites["foxIcon"],
        {
          skinny: true,
          thumbs: false
        }
      ),
      "Elf": new Character(
        "Elf",
        this.sceneTracker,
        app.sprites["elf"],
        app.sprites["elfIcon"],
        {
          skinny: true
        }
      ),
      "Cleric": new Character(
        "Cleric",
        this.sceneTracker,
        app.sprites["cleric"],
        app.sprites["clericIcon"],
        {
          healing: true
        }
      ),
      "Dwarf": new Character(
        "Dwarf",
        this.sceneTracker,
        app.sprites["dwarf"],
        app.sprites["dwarfIcon"],
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
    this.app.firstTime = false
    this.app.firstTime = false
    this.app.changeScene("menu")
    console.log("You got to the end? Really?")
  }

}


class SceneTracker {
  constructor(scene, app){
    this.gameScene = scene
    this.app = app
    this.currentScene = "tutorial"
    this.initDB()
    this.script = {
      "tutorial":{
        scene: new ClickTutorialScene(this.db["tutorial"]["0"], this),
        tutorial: true,
        next: "story1",
      },
      "story1":{
        scene: new TutorialCutScene(this.db["lore"]["0"], this),
        next: "story2",
        tutorial: true
      },
      "story2":{
        scene: new TutorialCutScene(this.db["lore"]["1"], this),
        next: "0",
        tutorial: true
      },
      "0": {
        // pulley / lever
        scene: new LevelScene(this.gameScene, undefined, {
            text: this.db["obstacles"]["0"]["description"],
            sprite: this.app.sprites["pulley"]
          },
          this.db["obstacles"]["0"]["preCheckFailure"]
        ),
        next: 1
      },
      // magic Door
      "1": {
        scene: new LevelScene(this.gameScene, undefined, {
            text: this.db["obstacles"]["1"]["description"],
            sprite: this.app.sprites["magicdoor"]
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
            text: this.db["obstacles"]["2"]["description"],
            sprite: this.app.sprites["monster"]
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
            text: this.db["obstacles"]["3"]["description"],
            sprite: this.app.sprites["fork"]
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
            text: this.db["obstacles"]["4"]["description"],
            sprite: this.app.sprites["soulpit"]
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
        scene: new ToxicGasScene(this.gameScene, undefined, {
            text: this.db["obstacles"]["6"]["description"],
            sprite: this.app.sprites["toxicgas"]
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
        next: "8"
      },
      "8": {
        // final message
        scene: new CutScene(this.db["end"], this),
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
    this.app.pushScene(this.script[this.currentScene]["scene"])
    this.script[this.currentScene]["scene"].init(this.app, this.script[this.currentScene]["preCheck"], this.script[this.currentScene]["postCheck"])
  }

  setSceneN(num){
    this.app.eventBuffer.push({
      type: "nextScene"
    })
    this.app.popScene()
    this.currentScene = num
    this.app.pushScene(this.script[this.currentScene]["scene"])
    this.script[this.currentScene]["scene"].init(this.app, this.script[this.currentScene]["preCheck"], this.script[this.currentScene]["postCheck"])
  }

  gameOver(){
    this.app.firstTime = false
    this.app.changeScene("menu")
  }

  skipScene(){

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
        "tutorial": {
          thinking: "",
          sacrifice: ""
        },
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
        "tutorial": {
          thinking: "",
          sacrifice: ""
        },
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
        "tutorial": {
          thinking: "",
          sacrifice: ""
        },
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
        "tutorial": {
          thinking: "",
          sacrifice: ""
        },
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
        "tutorial": {
          thinking: "",
          sacrifice: ""
        },
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
        "tutorial": {
          description: "tutorial",
          preCheckFailure: ""
        },
        "0": {
          description: "The first thing the adventurers see is a door out of the chamber.\n" +
          " \n" +
          "But it appears that someone must stay behind to hold the pully as the rest of the team exits.\n" +
          " \n" +
          "From this moment, it's clear that not everyone will make it out alive.",
          preCheckFailure: ""
        },
        "1": {
          description: "Although saddened by the generous sacrifice of their fellow teammate, the group quickly move onto the next part of the cave.\n" +
          " \n" +
          "Unfortuneately, the adventurers come across another door...except this time it's sealed by magic...\n" +
          " \n" +
          `However, there's an insciption on the wall. It says "To pass without harm one must say the magical word FRI... ", and then it stops.\n`+
          " \n" +
          "There's a skeleton below the insciption, still holding his masonry tools - never to finish the work he started.",
          preCheckFailure: ""
        },
        "2": {
          description: "The group smells a terrible odor as they continue to walk.\n" +
          " \n" +
          "The team realizes what the smell is...OGRE!! EW!!\n" +
          " \n" +
          "The ogre approaches as he chuckles and salivates at the sight of a possible snack.\n" +
          " \n" +
          `"Oh, this is perfect! I was looking for another snack. Just let me eat one of you and I'll let the rest of you pass, HAH! But just so you know, I don't eat women or children...I'm a gentleman at heart."`,
          preCheckFailure: ""
        },
        "3": {
          description: "As the group tries to forget the choice they've just made, the shrieks of THE SHADOW sound incredibly close.\n" +
          " \n" +
          "The group grows anxious.\n" +
          " \n" +
          "OH NO!! Three tunnels appear before the group and they must decide which tunnel to take!\n" +
          " \n" +
          "There are labels above each tunnel, and the group recognizes it as Dwarvish.",
          preCheckFailure: ""
        },
        "4": {
          description: "Although the group is emotionally exhausted by the choices they've made, they quickly press on to escape the THE SHADOW.\n" +
          " \n" +
          `Suddenly, a shadowy figure appears before them!! "THE SHADOW!!" everyone screams."\n` +
          " \n" +
          "Upon closer inspection, the group realizes that it's just the Grim Reaper.\n" +
          " \n" +
          `"Sorry, didn't mean to spook you all, but I'm in a bit of a pinch. I didn't make my quota for the day and I was hopeing you guys could help. I just need one soul of a living creature."`,
          preCheckFailure: ""
        },
        "5": {
          description: "The shrieks of THE SHADOW become faint as the three continue on.\n" +
          " \n" +
          "They come across a door, but it's blocked by a large boulder.\n" +
          " \n" +
          "The boulder rests peacefully as it nestles cozily against the door.",
          preCheckFailure: ""
        },
        "6": {
          description: "The remaining pair walk towards the next part of the cave and they starts to notice a haze start to form around them.\n" +
          " \n" +
          "At first, neither think much of it. However, as they continued on, the haze became thick and the two began to feel incredibly sluggish and ill.\n" +
          " \n" +
          "The shrieks of THE SHADOW grow near.",
          preCheckFailure: "Your team doesn't have an antidote, so the toxic gas quickly kills everyone remaining on your team"
        },
        "7": {
          description: "door",
          preCheckFailure: ""
        }
      },
      "lore": {
        "0": "A group of adventurers were hunting their biggest treasure yet.",
        "1": "They walked through an abandoned mining shaft which morphed into an unexplored network of caves.",
        "2": "And alas, there it was - the Chest of Faquad. A chest known to be filled with unimaginable treasure.",
        "3": "The Cleric felt something was wrong...",
        "4": "However, the team ignored her worries and decided to open the chest.",
        "5": `MUAHAHAHAHAHAHAHAHA, YOU SILLY LITTLE FOOLS. YOU'VE JUST REALEASED ME FROM CAPTIVITY.`,
        "6": "The group had unknowingly unleased THE SHADOW, a ruthless creature that feeds on any lifeform is comes across.",
        "7": "Panicked, the adventurers run as fast as they can to find the exit from the treasure chamber.",
      },
      "tutorial": {
        "0": "You can both click/tap the buttons on the screen as well as press the character between square brackets.\nFor example, [3] can be clicked or pressed on keyboard"
      },
      "end": "You won! Tell the tale of your adventures. Praise those who sacrificed themselves for the good of the team."
    }

  }
}
