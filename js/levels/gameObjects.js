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

class Character extends PIXIGameObject {
	LEFT_MARGIN=20
	CHAR_MARGIN=10
	CHAR_WIDTH =48

	constructor(sprite, pos){
		super(sprite)
		if(this.sprite.anchor){
			this.sprite.anchor.set(0, 1)
		}
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

	processTouchEvent(evt, coord){

	}

	processNonTouchEvent(evt){
		
	}
}