class CharacterSelection extends Scene {
  constructor(characters, scene){
    super({UI: [], gameObjects: []})
    this.stage.width = 480
    this.stage.height = 40
    this.stage.y = 0
    this.stage.x = 0

    this.parent_scene = scene

    this.characters = characters
    for(let c in characters){
      let button = new TextKeyAndSpriteButton(`[${characters[c].pos+1}]`, 
        (key)=>{
          this.parent_scene.changeCharacter.bind(this)(key-49)
          this.changeActive.bind(this)(key-49)
        }, characters[c].key,
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
      ()=>{
        this.changeActive.bind(this)(5)
        this.parent_scene.showObstacle.bind(this)()
      }, 79,
      {
        color: "#FFFFFF",
        hexColor: 0xFFFFFF,
        width: 120,
        height: 30
      }
    )
    obstacle.sprite.x = 340
    obstacle.sprite.y = 5
    this.obstacle = obstacle

    this.stage.addChild(this.obstacle.sprite)
    this.UI.push(obstacle)

    this.currentActiveButtton = 5
    this.changeActive(this.currentActiveButtton)
  }

  changeActive(num){
    console.log(num)
    this.UI[this.currentActiveButtton].deactivate()
    this.UI[num].activate()
    this.currentActiveButtton = num
  }

  processTouchEvent(evt, coord){
    console.log("pressed on selection")
  }

  processNonTouchEvent(evt){
    
  }
}

