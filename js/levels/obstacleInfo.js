class ObstacleInfo extends GameObject {
  constructor(text){
    super()
    this.stage = new PIXI.Container()
    this.stage.width = 480
    this.stage.height = 280
    this.stage.y = 40
    this.stage.x = 0

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
      wordWrapWidth: 400
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
      wordWrapWidth: 400
    })
    this.textContainer = null
    this.displayInfo(text)
  }

  displayInfo(text){
    if(this.textContainer){
      this.stage.removeChild(this.textContainer)
      this.textContainer.destroy()
    }
    this.textContainer = new PIXI.Container()
    this.textContainer.x = 0
    this.textContainer.y = 0
    this.textContainer.height = 280
    this.textContainer.width = 480

    let rect = getRectangle(440, 240, 0xFFFFFF, 2)
    rect.x = 20
    rect.y = 20
    this.textContainer.addChild(rect)

    let role = new PIXI.Text(text, this.h2long)
    role.x = 30
    role.y = 30
    this.textContainer.addChild(role)

    this.stage.addChild(this.textContainer)
  }
}

