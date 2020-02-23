class CharacterSelection extends Scene {
  constructor(characters, scene){
    super({UI: [], gameObjects: []})
    this.stage.width = 480
    this.stage.height = 40
    this.stage.y = 0
    this.stage.x = 0

    this.parent_scene = scene

    this.characters = characters
    this.character_buttons = {}

    for(let c in characters){
      let button = new TextKeyAndSpriteButton(`[${characters[c].pos+1}]`, 
        (key)=>{
          this.changeDisplay.bind(this)(key)
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
      (key)=>{
        this.changeDisplay.bind(this)(key)
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

    this.currentActiveButtton = this.obstacle.key
    this.obstacle.activate()
  }

  changeDisplay(num){
    this.parent_scene.changeDisplay(num)
  }

  changeActive(num){
    let cur = this.UI.filter(x => x.key && x.key == this.currentActiveButtton)
    if(cur){
      cur[0].deactivate()
    }
    cur = this.UI.filter(x => x.key && x.key == num)
    if(cur){
      cur[0].activate()
    }
    this.currentActiveButtton = num
  }

  processEvt(evt){
    super.processEvt(evt)
    if(evt.type == "switchInfo"){
      this.changeActive(evt.key)
    }
  }
}

