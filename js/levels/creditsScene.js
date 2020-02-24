class CreditScene extends Scene {
  constructor(obj = {
    UI: [],
    gameObjects: []
  }) {
    super(obj)
    this.app = null
    this.WIDTH = 400
    this.HEIGHT = 400
  }

  init(app){
    this.app = app
    this.stage.width = this.WIDTH
    this.stage.height = this.HEIGHT
    this.stage.alpha = 0.9
    this.stage.x = this.app.canvas.width/2 - this.WIDTH/2
    this.stage.y = this.app.canvas.height/2 - this.HEIGHT/2
    this.dialogue = new PIXI.Graphics()
    this.dialogue.beginFill(0x39003d)
    this.dialogue.drawRect(0, 0, this.WIDTH, this.HEIGHT)
    this.dialogue.endFill();
    this.stage.addChild(this.dialogue)

    let button = new TextKeyAndSpriteButton(`[M]enu`, 
      (key)=>{
        this.startMenu.bind(this)()
      }, 77,
      {
        color: "#FFFFFF",
        hexColor: 0xFFFFFF,
        width: 150,
        height: 30,
        fontSize: 20
      }
    )
    button.sprite.x = this.WIDTH/2 - button.width/2
    button.sprite.y = 350

    this.stage.addChild(button.sprite)
    this.UI.push(button)

    let text = `This game was created in 48 hours for MiniJam 48 by:`
    let textStyle = new PIXI.TextStyle({
      fontFamily: "arcade",
      fontSize: 16,
      fill: "#FFFFFF",
      stroke: "white",
      strokeThickness: 0,
      wordWrap: true,
      wordWrapWidth: 380
    })
    this.textObject = new PIXI.Text(text, textStyle)
    this.textObject.x = this.WIDTH/2 - this.textObject.width/2
    this.textObject.y = 80
    this.textObject.style.lineHeight = 16
    this.dialogue.addChild(this.textObject)

    let fox = this.app.sprites["fox"]
    fox.x = 100 - fox.width/2
    fox.y = 240
    fox.anchor.set(0, 1)
    this.dialogue.addChild(fox)
    let eunip = new PIXI.Text("@euni-p", textStyle)
    eunip.x = 100 - eunip.width/2
    eunip.y = 260
    this.dialogue.addChild(eunip)
  

    let death = this.app.sprites["soulpit"]
    death.x = 300 - death.width/2
    death.y = 240
    death.anchor.set(0, 1)
    this.dialogue.addChild(death)
    let qporest = new PIXI.Text("@qporest", textStyle)
    qporest.x = 300 - qporest.width/2
    qporest.y = 260
    this.dialogue.addChild(qporest)
  }

  startMenu(){
    this.app.changeScene("menu")
  }

  setDialogue({icon, text}){
    this.dialogue.removeChild(this.sprite)
    this.dialogue.removeChild(this.textObject)
    //set icon
    if(icon){
      this.sprite = icon
      this.sprite.x = 160/2 - this.sprite.width/2
      this.sprite.y = this.HEIGHT/2 - this.sprite.height/2
      this.dialogue.addChild(this.sprite)
    }

    let border = getRectangle(390, 390, 0xFFFFFF, 2)
    border.x = 5
    border.y = 5
    this.dialogue.addChild(border)

    let textStyle = new PIXI.TextStyle({
      fontFamily: "arcade",
      fontSize: 18,
      fill: "#FFFFFF",
      stroke: "white",
      strokeThickness: 0,
      wordWrap: true,
      wordWrapWidth: 380
    })
    this.textObject = new PIXI.Text(text, textStyle)
    this.textObject.x = 10
    this.textObject.y = this.HEIGHT/2 - this.textObject.height/2
    this.textObject.style.lineHeight = 22
    this.dialogue.addChild(this.textObject)
  }

}