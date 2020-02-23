class PIXIGameObject extends GameObject {
	constructor(sprite){
		super()
		this.sprite = sprite
		this.sprite.hitArea = this.generateHitArea()
	}

	generateHitArea(){
		return new PIXI.Rectangle(0,0,this.sprite.width,this.sprite.height)
	}

	processEvt(evt){
		if(evt.type=="touch"){
			let localClick = this.sprite.toLocal({x: evt.x, y:evt.y})
			let isHit = this.sprite.hitArea.contains(localClick.x, localClick.y)
			if(!isHit){ 
				return false 
			}
			this.processTouchEvent(evt, localClick)
			return true
		} else {
			this.processNonTouchEvent(evt)
		}
	}

	processTouchEvent(evt, localClick){

	}

	processNonTouchEvent(evt){

	}
}


