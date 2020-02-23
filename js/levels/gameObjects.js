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
		let fontSize = options.fontSize || 10

		let btn = new PIXI.Container()
		console.log("Creating button with text", text)
		let txtStyle = new PIXI.TextStyle({
	      fontFamily: "arcade",
	      fontSize: fontSize,
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
		this.bg.tint  = 0x23E3FF
		this.txt.tint = 0x23E3FF
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

	constructor(name, script, sprite, params={}){
		super()
		this.sprite = sprite
		this.script = script

		this.name = name

		let charData = this.script.getCharacterInfo(name)
		this.pos = charData.pos
		this.role = charData.role
		this.bio = charData.bio

		this.dialog = this.script.getCharacterDialog(name)

		if(this.sprite.anchor){
			this.sprite.anchor.set(0, 1)
		} else {
			this.sprite.pivot.set(0, this.sprite.height)
		}
		this.key = 49+this.pos

		this.params = {}
		
		this.params.thumbs     = params.thumbs     || true
		this.params.necromancy = params.necromancy || false
		this.params.strong     = params.strong     || false
		this.params.dwarf      = params.dwarf      || false
		this.params.healing    = params.healing    || false
		this.params.skinny     = params.skinny     || false
		this.params.soul       = params.soul       || true

		this.updatePosition()
	}

	getCoordinates(pos){
		return {y:160, x: this.pos*(this.CHAR_MARGIN+this.CHAR_WIDTH) + this.LEFT_MARGIN}
	}

	getSacrifice(){
		return this.script.getCharacterSacrifice(this.name)
	}

	getFailureMessage(){
		return this.script.getFailureMessage(this.name)
	}

	updateDialog(){
		this.dialog = this.script.getCharacterDialog(this.name)
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

	processEvt(evt){
		if(evt.type == "nextScene"){
			this.dialog = this.script.getCharacterDialog(name)
		}
	}
}