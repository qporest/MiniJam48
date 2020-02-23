class CharacterSelection extends Scene {
  constructor(characters, scene){
    super({UI: [], gameObjects: []})
    this.stage.width = 480
    this.stage.height = 40
    this.stage.y = 0
    this.stage.x = 0

    this.characters = characters
    for(let c in characters){
      let button = new TextKeyAndSpriteButton(`[${characters[c].pos}]`, 
        ()=>{console.log("clicked or pressed")}, characters[c].key,
        {
          color: "#FFFFFF",
          hexColor: 0xFFFFFF,
          width: 30,
          height: 30
        }
      )

      button.sprite.x = characters[c].sprite.x+9
      button.sprite.y = 5

      this.stage.addChild(button.sprite)
      this.UI.push(button)
    }

    let obstacle = new TextKeyAndSpriteButton("[O]bstacle", 
      ()=>{console.log("clicked or pressed")}, "O",
      {
        color: "#FFFFFF",
        hexColor: 0xFFFFFF,
        width: 120,
        height: 30
      }
    )
    obstacle.sprite.x = 340
    obstacle.sprite.y = 5

    this.stage.addChild(obstacle.sprite)
    this.UI.push(obstacle)
  }

  processTouchEvent(evt, coord){
    console.log("pressed on selection")
  }

  processNonTouchEvent(evt){
    
  }
}

