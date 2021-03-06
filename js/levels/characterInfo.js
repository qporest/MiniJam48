class CharacterInfo extends GameObject {
  constructor(characters, scene, activeCharacter){
    super()
    this.stage = new PIXI.Container()
    this.stage.width = 480
    this.stage.height = 280
    this.stage.y = 40
    this.stage.x = 0

    this.activeCharacter = activeCharacter
    this.characters = characters

    this.h1 = new PIXI.TextStyle({
      fontFamily: "arcade",
      fontSize: 10,
      fill: "#DDDCD6",
      stroke: "black",
      strokeThickness: 0,
      wordWrap: true,
      wordWrapWidth: 320
    })
    this.h1long = new PIXI.TextStyle({
      fontFamily: "arcade",
      fontSize: 10,
      fill: "#DDDCD6",
      stroke: "black",
      strokeThickness: 0,
      wordWrap: true,
      wordWrapWidth: 440
    })

    this.h2 = new PIXI.TextStyle({
      fontFamily: "arcade",
      fontSize: 9,
      fill: "#DDDCD6",
      stroke: "black",
      strokeThickness: 0,
      wordWrap: true,
      wordWrapWidth: 80,
      align: 'center'
    })
    this.h2long = new PIXI.TextStyle({
      fontFamily: "arcade",
      fontSize: 9,
      fill: "#DDDCD6",
      stroke: "black",
      strokeThickness: 0,
      wordWrap: true,
      wordWrapWidth: 440
    })


    this.dialogContainer = null
    this.bioContainer = null
    console.log("Recreating char info")
    // this.displayCharacter(characters[activeCharacter])
  }

  displayCharacter(character){
    character.updateDialog()
    this.displayCharacterDialog(character)
    this.displayCharacterBio(character)
  }

  displayCharacterBio(character){
    if(this.bioContainer){
      this.stage.removeChild(this.bioContainer)
      this.bioContainer.destroy()
    }
    this.bioContainer = new PIXI.Container()
    this.bioContainer.x = 0
    this.bioContainer.y = 160
    this.bioContainer.height = 120
    this.bioContainer.width = 480

    let rect = getRectangle(480, 120, 0xFFFFFF, 2)
    rect.x = 0
    rect.y = 0
    this.bioContainer.addChild(rect)

    let role = new PIXI.Text(character.role, this.h2long)
    role.x = 20
    role.y = 20
    this.bioContainer.addChild(role)

    let bio = new PIXI.Text(character.bio, this.h1long)
    bio.x = 20
    bio.y = 40
    bio.style.lineHeight = 15
    this.bioContainer.addChild(bio)

    this.stage.addChild(this.bioContainer)
  }

  displayCharacterDialog(character){
    if(this.dialogContainer){
      this.stage.removeChild(this.dialogContainer)
      this.dialogContainer.destroy()
    }
    this.dialogContainer = new PIXI.Container()
    this.dialogContainer.x = 0
    this.dialogContainer.y = 0
    this.dialogContainer.width = 480
    this.dialogContainer.height = 160

    let rect = getRectangle(480, 160, 0xFFFFFF, 2)
    rect.x = 0
    rect.y = 0
    this.dialogContainer.addChild(rect)

    let icon = character.icon
    icon.x = 20
    icon.y = 20
    this.dialogContainer.addChild(icon)

    let name = new PIXI.Text(character.name, this.h2)
    name.x = 60
    name.y = 105
    name.anchor.set(0.5, 0)
    this.dialogContainer.addChild(name)


    let dialog = new PIXI.Text(character.dialog, this.h1)
    dialog.x = 120
    dialog.y = 20
    dialog.style.lineHeight = 15
    this.dialogContainer.addChild(dialog)

    this.stage.addChild(this.dialogContainer)
  }

  processEvt(evt){
    if(evt.type=="switchInfo" || evt.type=="refreshInfo"){
      if(evt.key>=49 && evt.key<54){
        let char = Object.values(this.characters).filter(x => x.pos==evt.key-49)[0]

        if(char){
          this.displayCharacter(char)
        }
      }
    }
  }
}

