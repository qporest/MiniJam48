class InitScene extends Scene {
  constructor(obj = {
    UI: [],
    gameObjects: []
  }) {
    super(obj)
  }

  init(app){
    this.HEIGHT = 400
    this.WIDTH = 400
    this.stage.x = app.canvas.width/2 - this.WIDTH/2
    this.stage.y = app.canvas.height/2 - this.HEIGHT/2
    let textStyle = new PIXI.TextStyle({
      fontFamily: "Helvetica",
      fontSize: 36,
      fill: "#DDDCD6",
      stroke: "black",
      strokeThickness: 0,
      wordWrap: true,
      wordWrapWidth: 400
    })
    this.textObject = new PIXI.Text("Loading", textStyle)
    this.textObject.x = this.WIDTH/2 - this.textObject.width/2
    this.textObject.y = this.HEIGHT/2 - this.textObject.height/2
    this.stage.addChild(this.textObject)
  }

  update(dt) {
    this.textObject.text += "."
  }

  render() {
    // console.log("I was rendered")
  }
}
