function getRectangle(width, height, color=0xFFFF00, stroke=5) {
	let graphics = new PIXI.Graphics()

	// set the line style to have a width of 5 and set the color to red
	graphics.lineStyle(stroke, color)
	// draw a rectangle
	graphics.drawRect(0, 0, width, height)

	return graphics
}

class SpriteButton extends PIXIGameObject {
	constructor(sprite, callback, key){
		super(sprite)
		this.callback = callback
		this.key = key
	}

	processTouchEvent(evt, localClick){
		this.callback(this.key)
	}
}

/*
Keyboard and Sprite button reacts to both a press on a certain key and
on a touch with the same callback.
*/
class KeyAndSpriteButton extends SpriteButton {
	constructor(sprite, callback, key){
		super(sprite, callback, key)
	}

	processNonTouchEvent(evt){
    	if(evt.which == this.key){
    		this.callback(this.key)
    	}
  	}
}

class TextKeyAndSpriteButton extends KeyAndSpriteButton {

	constructor(text, callback, key, options={}){
		let color = options.color || "#FFFFFF"
		let hexColor = options.hexColor || 0xFFFFFF
		let width = options.width || null
		let height = options.height || 40

		let btn = new PIXI.Container()
		console.log("Creating button with text", text)
		let txtStyle = new PIXI.TextStyle({
	      fontFamily: "arcade",
	      fontSize: 10,
	      fill: color,
	      stroke: color,
	      strokeThickness: 0,
	      wordWrapWidth: 120
	    })
		let txt = new PIXI.Text(text, txtStyle)
		txt.anchor.set(0.5, 0)
	    if(!width){
	    	width = txt.width + 20
	    }
	    txt.x = width/2+1
	    txt.y = (height-txt.height)/2
	    let bg = new PIXI.Graphics()
	    btn.addChild(txt)
	    bg.lineStyle(2, hexColor)
	    bg.drawRect(0, 0, width, height)
	    btn.addChild(bg)

	    super(btn, callback, key)

	    this.color = color
	    this.hexColor = hexColor
	    this.width = width
	    this.height = height
	    this.text = text
	    this.bg = bg
	    this.txt = txt
	}

	activate(){
		this.bg.tint  = 0xFF5906
		this.txt.tint = 0xFF5906
	}

	deactivate(){
		this.bg.tint = this.hexColor
		this.txt.tint = this.hexColor
	}
}

class Character extends GameObject {
	LEFT_MARGIN=20
	CHAR_MARGIN=10
	CHAR_WIDTH =48

	constructor(name, role, sprite, pos){
		super()
		this.sprite = sprite
		this.role = role
		this.name = name
		if(this.sprite.anchor){
			this.sprite.anchor.set(0, 1)
		} else {
			this.sprite.pivot.set(0, this.sprite.height)
		}
		this.key = 49+pos
		this.pos = pos
		this.updatePosition()
	}

	getCoordinates(pos){
		return {y:160, x: this.pos*(this.CHAR_MARGIN+this.CHAR_WIDTH) + this.LEFT_MARGIN}
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