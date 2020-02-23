class DialogueScene extends Scene {
  constructor(obj = {
    UI: [],
    gameObjects: []
  }) {
    super(obj)
    this.app = null
    this.text = ""
    this.sprite = null
    this.textObject = null
    this.WIDTH = 400
    this.HEIGHT = 400
  }

  init(app){
    this.start = performance.now()
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
    this.dialogue.addChild(this.textObject)
  }

  processEvt(evt) {
    if(evt.type=="touch" || evt.type=="keydown"){
      console.log("Dialogue ended by ")
      console.log(evt)
      this.stage.destroy()
      this.app.popScene()
    }
  }

}