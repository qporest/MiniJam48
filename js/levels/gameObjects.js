function getRectangle(width, height) {
	let graphics = new PIXI.Graphics()

	graphics.beginFill(0xFFFF00);
	// set the line style to have a width of 5 and set the color to red
	graphics.lineStyle(5, 0xFF0000)
	// draw a rectangle
	graphics.drawRect(0, 0, width, height)

	graphics.pivot.set(0, height)

	return graphics
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

class Character extends GameObject {
	LEFT_MARGIN=20
	CHAR_MARGIN=10
	CHAR_WIDTH =48

	constructor(name, sprite, pos){
		super()
		this.sprite = sprite
		this.name = name
		if(this.sprite.anchor){
			this.sprite.anchor.set(0, 1)
		}
		this.key = (pos+1).toString()
		this.pos = pos
		this.updatePosition()
	}

	getCoordinates(pos){
		return {y:120, x: this.pos*(this.CHAR_MARGIN+this.CHAR_WIDTH) + this.LEFT_MARGIN}
	}

	updatePosition(){
		this.coordinates = this.getCoordinates(this.pos)
		console.log("Coordinates: "+this.coordinates.x+" "+this.coordinates.y)
		this.sprite.x = this.coordinates.x
		this.sprite.y = this.coordinates.y
		this.sprite.zIndex = this.pos.col + this.pos.row
		// this.sortZIndex()
	}

	sortZIndex(){
		game.currentScene.stage.children.sort((itemA, itemB) => itemA.zIndex - itemB.zIndex)
	}
}