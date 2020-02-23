class CharacterAction extends Scene {
  constructor(scene){
    super({UI: [], gameObjects: []})
    this.stage.width = 480
    this.stage.height = 0
    this.stage.y = 145
    this.stage.x = 0

    this.parent_scene = scene
    let volunteer = new TextKeyAndSpriteButton("[V]olunteer", ()=>{
      this.volunteer.bind(this)()
    }, "v")
    volunteer.sprite.x = 120
    this.stage.addChild(volunteer.sprite)
    this.UI.push(volunteer)
  }

  volunteer(){
    this.parent_scene.volunteer()
  }
}
