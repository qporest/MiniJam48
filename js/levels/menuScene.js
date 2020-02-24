class MenuScene extends Scene {
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
    this.dialogue.beginFill(0x000000)
    this.dialogue.drawRect(0, 0, this.WIDTH, this.HEIGHT)
    this.dialogue.endFill();
    this.stage.addChild(this.dialogue)

    let startButton = new TextKeyAndSpriteButton(`[S]tart`, 
      (key)=>{
        this.startGame.bind(this)()
      }, 83,
      {
        color: "#FFFFFF",
        hexColor: 0xFFFFFF,
        width: 180,
        height: 36,
        fontSize: 18
      }
    )
    startButton.sprite.x = this.WIDTH/2 - startButton.width/2
    startButton.sprite.y = 50

    this.stage.addChild(startButton.sprite)
    this.UI.push(startButton)

    let creditsButton = new TextKeyAndSpriteButton(`[C]redits`, 
      (key)=>{
        this.showCredits.bind(this)()
      }, 67,
      {
        color: "#FFFFFF",
        hexColor: 0xFFFFFF,
        width: 180,
        height: 36,
        fontSize: 18
      }
    )
    creditsButton.sprite.x = this.WIDTH/2 - creditsButton.width/2
    creditsButton.sprite.y = 350

    this.stage.addChild(creditsButton.sprite)
    this.UI.push(creditsButton)

    let text = `Help adventurers make it out alive from the haunted cave. They will rely on you to help them make tough decisions.`
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
    this.textObject.y = 120
    this.textObject.style.lineHeight = 16
    this.dialogue.addChild(this.textObject)
  }

  showCredits(){
    this.app.changeScene("credits")
  }

  startGame(){
    this.app.changeScene("game")
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