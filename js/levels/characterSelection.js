class CharacterSelection extends Scene {
  constructor(characters, scene){
    super({UI: [], gameObjects: []})
    this.stage.width = 480
    this.stage.height = 40
    this.stage.y = 0
    this.stage.x = 0

    this.characters = characters
    for(let c in characters){
      let rectangle = getRectangle(30, 30)
      rectangle.x = characters[c].sprite.x+9
      rectangle.y = 5

      let button = new KeyAndSpriteButton(rectangle, ()=>{console.log("clicked or pressed")}, characters[c].key)

      this.stage.addChild(button.sprite)
      this.UI.push(button)
    }

    let obstacle = getRectangle(120, 30)
    obstacle.x = 340
    obstacle.y = 5
    this.stage.addChild(obstacle)
  }

  processTouchEvent(evt, coord){
    console.log("pressed on selection")
  }

  processNonTouchEvent(evt){
    
  }
}

/*
Keyboard and Sprite button reacts to both a press on a certain key and
on a touch with the same callback.
*/
class KeyAndSpriteButton extends SpriteButton {
	constructor(sprite, callback, key){
		super(sprite, callback)
		this.key = key
	}

	processNonTouchEvent(evt){
    	if(evt.key == this.key){
    		this.callback()
    	}
  	}
}