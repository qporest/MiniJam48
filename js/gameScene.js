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
          healing: true,
          skinny: true
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
        next: "story0",
      },
      "story0":{
        scene: new TutorialCutScene(this.db["lore"]["0"], this),
        next: "story1",
        tutorial: true
      },
      "story1":{
        scene: new TutorialCutScene(this.db["lore"]["1"], this),
        next: "story2",
        tutorial: true
      },
      "story2":{
        scene: new TutorialCutScene(this.db["lore"]["2"], this),
        next: "story3",
        tutorial: true
      },
      "story3":{
        scene: new TutorialCutScene(this.db["lore"]["3"], this),
        next: "story4",
        tutorial: true
      },
      "story4":{
        scene: new TutorialCutScene(this.db["lore"]["4"], this),
        next: "story5",
        tutorial: true
      },
      "story5":{
        scene: new TutorialCutScene(this.db["lore"]["5"], this),
        next: "story6",
        tutorial: true
      },
      "story6":{
        scene: new TutorialCutScene(this.db["lore"]["6"], this),
        next: "story7",
        tutorial: true
      },
      "story7":{
        scene: new TutorialCutScene(this.db["lore"]["7"], this),
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
            "Unfortunately without dwarf group's chances are 1 in 3 to pick the right door that's not a trap.")
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
          role: "Race:orc   class:necromancer",
          pos: 0
        },
        "0": {
          thinking: "Staying here to hold this pulley won't be the worst thing. I'm not afraid of dying, I'm already dead.",
          sacrifice: "Farewell, I wish you to not have to make more sacrifices. \n\nAlways feel free to come back and visit.You'll find my corpse as it'd be the only one not rotting."
        },
        "1": {
          thinking: "It might be too late for me to resurrect him, but I'd love to try. Just to spite cleric one more time.",
          sacrifice: "",
          fail: ""
        },
        "2": {
          thinking: "Of course I'm not afraid to die! To be eaten by this horrendous creation... I just mean I'm technically already dead, so he might not like the taste.",
          sacrifice: "Everyone felt relief when Necromancer volunteered. He truly was the bravest of them. Was it brave if he was already dead however or was it just polite?"
        },
        "3": {
          thinking: "I've never seen these runes. Dwarfish is one of the uglies things I've seen, and I reanimate dead corpses for living.",
          fail: "Group followed Necromancers guess and wasted hours of time until they hit a dead end. There was no time to come back, darkness was getting closer."
        },
        "4": {
          thinking: "Necromancer was blushing. No one even knew he was able to, but in the presense of his idol the Grim Reaper he was acting really nervously.",
          sacrifice: "There was no way to discourage Necromancer. \"It would be my highest honor to finally die by your scythe\" he said and stepped forward.",
          fail: "The Grim Reaper felt cheated. Necromancers don't have souls, and he didn't believe the group didn't know that. He decided to kill Necromancers and collect the souls of others."
        },
        "5": {
          thinking: "If only there were corpses around to animate and make them push it away. Maybe they are underground?",
          fail: "Group waited and watched Necromancer try and lift the undead, but no corpses remained in these caves long enough. Especially because of the shadow that they saw approaching them through a tunnel."
        },
        "6": {
          thinking: "It would not hurt me to see Cleric die, but I can't see myself saved by him either.",
          sacrifice: "It is not because I like you, but because I don't want to be saved by you. Good luck living and looking for your new life purpose."
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
          thinking: "*sniff* *sniff* - fox cheerfully runs around not understanding the gravity of the situation.",
          sacrifice: "Fox holds the pulley given to it by masters just as it was taught. She's waiting eagerly for the pets it will get for being a good fox."
        },
        "1": {
          thinking: "Fox salivates at the looks of these bones. Untouched skeleton has all the bones in place! Such variety, such prime condition.",
          sacrifice: "",
          fail: "The group watches Fox jump to the skeleton and disintigrate it in moments. There is no intention behind it and group comes to terms that it was the last decision of their lives."
        },
        "2": {
          thinking: "The ogre smelled familiar to Fox. He wanted to go smell his new friend, and couldn't understand why he was held back by the group.",
          sacrifice: "The leash was released and Fox ran towards his new friend. Every member of the group shrugged when the cave was filled with the sound of squeling. They all lost a bit of respect for themselves."
        },
        "3": {
          thinking: "Group hoped for Fox to smell the way forward, but Fox kept trying to run back and see the friend they left behind with Ogre.",
          fail: "Group followed Fox into one of the caves. They walked for a long time until the proud Fox showed them another corpse at a dead-end. Darkness was getting close."
        },
        "4": {
          thinking: "Grim Reaper frightened Fox. It had no smell, made no sound. Fox stood behind the group with its tail perched up squeling quietly.",
          sacrifice: "Group pointed to the fox and that gesture was clear to it even through the inter-species barrier of understanding. It bunched up and laid down as Grim Reaper silently floated through the air."
        },
        "5": {
          thinking: "Fox felt vibrations in the boulder and was running around the rock trying to smell what's on the other side.",
          fail: "Fox was cut loose, but unable to understand what she needs to do she climbed the boulder and was scared to jump down. She sat there until the darkness came."
        },
        "6": {
          thinking: "Fox was alarmed and coughing. The sensory overload from the smell and colors",
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
          thinking: "I will accept whatever divine power sends my way. These souls are worth saving. Except the necromancer.",
          sacrifice: "Cleric holds the pulley letting others leave. They see him gesturing cross symbol in their direction, and then upon himself."
        },
        "1": {
          thinking: "Holy teachings rarely deal with the land of dead. It does seem like something Necromancer would be good at, but I can't suggest it.",
          sacrifice: "",
          fail: "Group watched cleric pray and call upon the holy powers to disable the magic barrier, but the reception didn't seem to be good in the cave."
        },
        "2": {
          thinking: "Cleric kept thinking of Jonah - eaten by the whale and surving inside. It was giving him courage.",
          fail: "Ogre refused to eat women, but he wasn't above killing them. Upset with the group for not following simple instructions he started a carnage."
        },
        "3": {
          thinking: "I feel the third door to be the right one. However if certainly incorrect door was revealed I would change my opinion to increase our chances.",
          fail: "Cleric remembered seeing one of the symbols on the tombstone. He changed his opinion and tried to justify it by explaining Monty Hall problem to the group. This didn't stop until darkness arrived."
        },
        "4": {
          thinking: "Actually seeing the Grim Reaper was a shock to cleric as it put all of his knowledge in question. Why not volunteer, what is the point now?",
          sacrifice: "Cleric approached Grim Reaper who was grinning at the irony of the situation. Group watched them vanish in thin air and continued on."
        },
        "5": {
          thinking: "It is a big rock. Not really my area of expertise.",
          fail: "Cleric tried using his staff to pry the boulder often, but it broke together with his confidence in divine power. Shadow approached and he embraced it."
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
          sacrifice: "I hope you get to live. Mostly so that you get to tell the tale of my brave sacrifice! Pour out some ale for me if you ever visit Nimergard!",
          fail: "",
        },
        "1": {
          thinking: "No wonder he couldn't finish his writing. Those masonry tools are so outdated, no dwarf would use them ha-ha-ha.",
          sacrifice: "",
          fail: "Group placed their trust in dwarf due to his masonry experience. This had nothing to do with the magic door however, and they couldn't get out of the room before evil forces catching up to them."
        },
        "2": {
          thinking: "Even though dying was acceptable to Dwarf, this was against him most basic beliefs. He won't give up without a fight, but won't back out either.",
          sacrifice: "Ogre was salivating as the dwarf was approaching him. Dwarf did not display any emotions. He asked Ogre to let the group through first, as he didn't want people to see him in such finale."
        },
        "3": {
          thinking: "The insciption reads Death, Trap, and Safety. Which one shall we take?",
          sacrifice: ""
        },
        "4": {
          thinking: "I'm not afaid of dying, and Grim Reaper is the most honorable enemy to die fighting.",
          sacrifice: "The group said their goodbyes to a cheerfull Dwarf. He approached Death and asked if he will go to Valhalla. Death asked \"what is Valhalla?\", before they both disappeared."
        },
        "5": {
          thinking: "This tiny rock is as much of a delay as a lost sausage in my beard. I'd like them to ask me to move it, they oughta know who's the strongest here.",
          fail: ""
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
          thinking: "That pulley looks rusty. I don't want my clothing stained, especially if it's what I will wear for the rest of eternity.",
          sacrifice: "Tell the tale to the people of my kingdom, let them know that elvian princesses die with class."
        },
        "1": {
          thinking: "I bet I can learn what this skeleton is thinking by practicing my method acting. Though it's kind of dirty over there.",
          sacrifice:"",
          fail: "The princess employed her method acting skills to really get in the mind of the skeleton and find out what the final word was."+
            "This did not yield any results and the evil caught up with the group."
        },
        "2": {
          thinking: "It is rather unbecoming of royalty to die eaten by monsters. Can I get this monster to fall in love with me maybe?",
          sacrifice: "",
          fail: "Ogre refused to eat women, but he wasn't above killing them. Upset with the group for not following simple instructions he started a carnage."
        },
        "3": {
          thinking: "So common of dwarves to not consider others and push their language and culture onto others.",
          fail: "Group followed princess's guess and wasted hours of time until they hit a dead end. There was no time to come back, darkness was getting closer."
        },
        "4": {
          thinking: "Dying by the hand of Grim Reaper is the more honorable than a casual palace backstabbing I suppose.",
          sacrifice: "Princess walked to Grim Reaper like an equal. Even Death was a little impressed by the way she carried herself."
        },
        "5": {
          thinking: "It's a large rock. I don't see how I can do anything without looking silly.",
          sacrifice: "Princess put a handkerchief on the rock to push it and gave it her best. There was no effect except the group suppressing their laughter. Group's wasted time wasn't wasted by the darkness."
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
      },
      "lore": {
        "0": "A band of explorers were going after their biggest treasure yet. They walked through the abandoned mining shaft which morphed into "+
        "unexplored network of caves. And alas here it was - their final prize.",
        "1": "Cleric felt something was wrong before it happened."
      },
      "tutorial": {
        "0": "You can both click/tap the buttons on the screen as well as press the character between square brackets.\nFor example, [3] can be clicked or pressed on keyboard"
      },
      "end": "You won! Tell the tale of your adventures. Praise those who sacrificed themselves for the good of the team."
    }

  }
}