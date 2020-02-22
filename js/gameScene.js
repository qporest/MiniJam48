class GameScene extends Scene {
  constructor(obj = {
    UI: [],
    gameObjects: []
  }) {
    super(obj)
    this.layers = []
    this.map = null
    this.vader = null
    this.characters = null
  }

  init(app){
    this.app = app
    // Adding map
    this.dialogueScene = new DialogueScene()
    this.pickingScene = new PickingScene()
    this.scriptSystem = new ScriptSystem(this)
    this.map = new TiledFloor(app.sprites["floor"], this)
    this.actual_stage = this.stage
    this.stage = new PIXI.Container()
    this.actual_stage.addChild(this.stage)
    this.stage.addChild(this.map.sprite)
    this.gameObjects.push(this.map)
    // Adding player
    this.vader = new Player(app.sprites["Vader"], this, {row:0, col:1}, app.sprites["VaderIcon"])
    this.stage.addChild(this.vader.sprite)
    this.gameObjects.push(this.vader)
    // Character creation
    this.characters = {}
    this.characters["Jessica"] = new NPC({
      name: "Jessica",
      sprite:app.sprites["Jessica"],
      scene: this,
      icon: app.sprites["JessicaIcon"],
      pos: {row:4, col:3},
      interactionPoint: {row:4, col:4}
    })
    this.characters["Bill"] = new NPC({
      name: "Bill",
      sprite:app.sprites["Bill"],
      scene: this,
      icon: app.sprites["BillIcon"],
      pos: {row:0, col:2},
      interactionPoint: {row:1, col:2}
    })
    this.characters["Rupert"] = new NPC({
      name: "Rupert",
      sprite:app.sprites["Rupert"],
      scene: this, 
      pos: {row:5, col:5},
      icon: app.sprites["RupertIcon"],
      interactionPoint: {row:5, col:4}
    })
    this.characters["Brody"] = new NPC({
      name: "Brody",
      sprite:app.sprites["Brody"],
      icon: app.sprites["BrodyIcon"],
      scene: this, 
      pos: {row:5, col:0},
      interactionPoint: {row:5, col:2}
    })
    this.characters["Brody"].sprite.zIndex = 4
    this.characters["Ylvis"] = new NPC({
      name: "Ylvis",
      icon: app.sprites["YlvisIcon"],
      sprite:app.sprites["Ylvis"],
      scene: this, 
      pos: {row:0, col:0},
      interactionPoint: {row:0, col:1}
    })
    for(let characterName in this.characters){
      this.stage.addChild(this.characters[characterName].sprite)
      this.gameObjects.push(this.characters[characterName])
    }

    this.characters["Vader"] = this.vader
    this.characters["Narrator"] = {
      name: "Narrator",
      icon: app.sprites["NarratorIcon"]
    }
    this.addEnvironment()
    // Defining layers
    this.layers.push([this.vader, this.characters["Jessica"], this.jukebox,
      this.characters["Bill"],this.characters["Brody"],this.characters["Rupert"],
      this.characters["Ylvis"]])
    this.layers.push([this.map])

    this.stage.x = app.canvas.width/2 - this.stage.width/2
    this.stage.y = app.canvas.height/2 - this.stage.height/2
    this.currentSong = null
    this.setMusic("music/01_IntroSong.mp3")
    this.dialogueScene.init(app)
    this.pickingScene.init(app, this)
    this.vader.interactWith(this.characters["Narrator"])
    this.vader.interactWith(this.characters["Bill"])
    
  }

  setMusic(song){
    if(this.currentSong){
      sounds[this.currentSong].fadeOut(3)
    }
    sounds[song].loop = true
    sounds[song].volume = 0.7
    this.currentSong = song
    sounds[song].play()
  }

  render() {
  }

  addEnvironment(){
    let rupertTable = new Character(
      this.app.sprites["RupertTable"],
      this,
      {row: 4, col:5}
    )
    this.stage.addChild(rupertTable.sprite)

    let jessicaTable = new Character(
      this.app.sprites["JessicaTable"],
      this,
      {row: 3, col:3}
    )
    this.stage.addChild(jessicaTable.sprite)

    this.jukebox = new NPC({
      sprite: this.app.sprites["Jukebox_Incomplete"],
      scene: this,
      pos: {row: 1, col:0},
      name: "Jukebox",
      interactionPoint: {row:1, col:1}
    })
    this.jukebox.sprite.x = 267
    this.jukebox.sprite.y = 156
    this.stage.addChild(this.jukebox.sprite)

    let bar = new Character(
      this.app.sprites["Bar"],
      this,
      {row: 5, col:2}
    )
    bar.sprite.zIndex = 4
    bar.sprite.x += 3
    bar.sprite.y -= 5
    this.stage.addChild(bar.sprite)

    this.lamps = this.app.sprites["Lamps"]
    this.lamps.zIndex = 4+5
    this.stage.addChild(this.lamps)
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

  getPicks(){
    this.app.pushScene(this.pickingScene)
  }

  setDialogue({character, text}){
    if(this.characters[character].icon){
      this.dialogueScene.setDialogue({
        icon: this.characters[character].icon,
        text: text
      })
    } else {
      this.dialogueScene.setDialogue({
        // icon: this.characters[character].sprite,
        text: text
      })
    }
    this.app.pushScene(this.dialogueScene)
  }

  blameCharacter(characterName){
    if(characterName=="Jessica"){
      this.scriptSystem.completeThreshold("blame_jessica")
      this.vader.moveToChar(this.characters["Brody"])
      this.vader.interactWith(this.characters["Brody"])
    }
    if(characterName=="Bill"){
      this.scriptSystem.completeThreshold("blame_bill")
      this.vader.moveToChar(this.characters["Brody"])
      this.vader.interactWith(this.characters["Brody"])
    }
    if(characterName=="Ylvis"){
      this.scriptSystem.completeThreshold("blame_ylvis")
      this.vader.moveToChar(this.characters["Brody"])
      this.vader.interactWith(this.characters["Brody"])
    }

  }
}