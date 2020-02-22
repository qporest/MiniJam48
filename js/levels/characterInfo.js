class CharacterInfo extends Scene {
  constructor(characters, scene, activeCharacter){
    super({UI: [], gameObjects: []})
    this.stage.width = 480
    this.stage.height = 160
    this.stage.y = 40
    this.stage.x = 0

    this.activeCharacter = activeCharacter
    this.characters = characters

    this.displayCharacterInfo(characters[activeCharacter])
  }

  displayCharacterInfo(character){
    let icon = getRectangle(80, 80)
    icon.x = 20
    icon.y = 100
    this.stage.addChild(icon)

    let h1 = new PIXI.TextStyle({
      fontFamily: "arcade",
      fontSize: 10,
      fill: "#DDDCD6",
      stroke: "black",
      strokeThickness: 0,
      wordWrap: true,
      wordWrapWidth: 320
    })

    let h2 = new PIXI.TextStyle({
      fontFamily: "arcade",
      fontSize: 9,
      fill: "#DDDCD6",
      stroke: "black",
      strokeThickness: 0,
      wordWrap: true,
      wordWrapWidth: 80,
      align: 'center'
    })

    this.name = new PIXI.Text(character.name, h2)
    this.name.x = 20
    this.name.y = 105
    this.stage.addChild(this.name)


    this.bio = new PIXI.Text("Lorum ipsum dolor sit amet. conquistadors are fighting the bulls underwater", h1)
    this.bio.x = 120
    this.bio.y = 20
    this.stage.addChild(this.bio)
  }

  processTouchEvent(evt, coord){
    console.log("pressed on selection")
  }

  processNonTouchEvent(evt){
    
  }
}

