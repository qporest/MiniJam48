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

class TiledFloor extends PIXIGameObject {
	/*
	Tiled Floor is symmetrical, with walls around it. Only floor is clickable.
	*/
	constructor(sprite, scene){
		super(sprite)
		this.map = [
			[1,0,1,1,1,1],
			[1,0,0,0,1,1],
			[0,0,0,0,0,1],
			[1,1,0,1,0,0],
			[1,1,0,1,0,1],
			[1,1,0,0,0,1]
		]
		this.scene = scene
		this.heightOffset = 189
		this.WIDTH = 128
		this.HEIGHT = 64
		this.sprite.hitArea = this.generateHitArea()
		this.sprite.zIndex = 0
	}

	getPath(start, end){
		this.searchMap = JSON.parse(JSON.stringify(this.map))
		this.searchMap[start.row][start.col] = 1
		let queue = [[start]]
		let found = false
		while(queue.length>0){
			let cur = queue.shift()
			if(cur[cur.length-1].col==end.col && cur[cur.length-1].row == end.row){
				cur.shift()
				return cur
			}
			for(let neighbour of this.getNeighbourCoordinates(cur[cur.length-1])){
				if(this.searchMap[neighbour.row][neighbour.col] == 0){
					let nxt = cur.slice()
					nxt.push(neighbour)
					queue.push(nxt)
					this.searchMap[neighbour.row][neighbour.col] = 1
				}
			}
		}
		return -1
	}

	getNeighbourCoordinates(point){
		let ans = []
		if(point.row+1<this.map.length)ans.push({row:point.row+1, col: point.col})
		if(point.col+1<this.map[0].length)ans.push({row:point.row, col: point.col+1})
		if(point.row-1>=0)ans.push({row:point.row-1, col: point.col})
		if(point.col-1>=0)ans.push({row:point.row, col: point.col-1})
		return ans
	}

	generateHitArea(){
		return new PIXI.Polygon(
			0, (this.sprite.height-this.heightOffset)/2 + this.heightOffset,
			this.sprite.width/2, 0 + this.heightOffset,
			this.sprite.width, (this.sprite.height-this.heightOffset)/2 + this.heightOffset,
			this.sprite.width/2, (this.sprite.height-this.heightOffset) + this.heightOffset
		)
	}

	coordinatesForIndex({row, col}){
		let x = (col - row) * this.WIDTH / 2 + this.sprite.width / 2
		let y = (col + row) * this.HEIGHT / 2 + this.heightOffset
		return {x, y}
	}

	getPosForCoordinates(coord){
		coord.x -= this.sprite.width / 2
		coord.y -= this.heightOffset
		let row = Math.floor((coord.y / (this.HEIGHT/2) - coord.x / (this.WIDTH/2))/2)
		let col = Math.floor((coord.x / (this.WIDTH/2) + coord.y / (this.HEIGHT/2))/2)
		if(row>=this.map.length) row = this.map.length-1
		if(col>=this.map[0].length) col = this.map[0].length-1
		return {row, col}
	}
	
	processTouchEvent(evt, coord){
		let pos = this.getPosForCoordinates(coord)
		if(this.map[pos.row][pos.col]!=-1){
			this.scene.vader.moveTo(pos)
		}
	}
}

class Character extends PIXIGameObject {
	constructor(sprite, scene, pos){
		super(sprite)
		this.scene = scene
		this.pos = pos
		this.updatePosition()
	}

	updatePosition(){
		this.coordinates = this.adjustCoordinates(this.scene.map.coordinatesForIndex(this.pos))
		console.log("New coordinates")
		console.log(this.coordinates)
		this.sprite.x = this.coordinates.x
		this.sprite.y = this.coordinates.y
		this.sprite.zIndex = this.pos.col + this.pos.row
		this.sortZIndex()
	}

	sortZIndex(){
		game.currentScene.stage.children.sort((itemA, itemB) => itemA.zIndex - itemB.zIndex)

	}

	adjustCoordinates(pos){
		pos.x -= this.sprite.width/2
		pos.y += this.scene.map.HEIGHT/2 - this.sprite.height
		return {x: pos.x, y:pos.y}
	}
}

class NPC extends Character {
	constructor({
		sprite, scene, pos, interactionPoint, name, icon
	}){
		super(sprite, scene, pos)
		this.icon = icon || null
		this.interactionPoint = interactionPoint
		this.name = name
	}

	processTouchEvent(evt, coord){
		this.scene.vader.moveToChar(this)
		this.scene.vader.interactWith(this)
	}
}