class Player extends Character {
	constructor(sprite, scene, pos, icon){
		super(sprite, scene, pos)
		this.name = "Vader"
		this.icon = icon
		this.actionQueue = []
		this.velocity = 0.6
		this.currentAction = null
		this.currentActionData = null
		this.status = null
		let sprites = this.scene.app.sprites
		this.animations = {
			"idle": {
				0: sprites["VaderRightBackIdle"],
				1: sprites["VaderRightFrontIdle"],
				2: sprites["VaderLeftFrontIdle"],
				3: sprites["VaderLeftBackIdle"]
			},
			"walking": {
				0: sprites["VaderRightBackWalk"],
				1: sprites["VaderRightFrontWalk"],
				2: sprites["VaderLeftFrontWalk"],
				3: sprites["VaderLeftBackWalk"]
			}
		}
		for(let animation in this.animations){
			for(let dir in this.animations[animation]){
				this.animations[animation][dir].hitArea = this.generateHitArea()
				this.animations[animation][dir].animationSpeed = 0.1
			}
		}
		this.processAction = {
			"move": this.moveUpdate.bind(this),
			"interact": this.interactUpdate.bind(this),
			"moveTo": this.createPath.bind(this)
		}
		this.direction = 2 // 0 is up-right, 1 bottom-r, 2 bottom-l, 3 up-left
		this.sprite = this.animations["idle"][this.direction]
		this.setAnimation(this.animations["idle"][this.direction])
	}

	dirBetween(start, end){
		let ans = 0
		if(start.row == end.row){
			ans = end.col > start.col ? 1 : 3
		} else {
			ans = end.row > start.row ? 2 : 0
		}
		return ans
	}

	adjustCoordinates(pos){
		console.log(pos)
		return {x: pos.x, y:pos.y}
	}

	setAnimation(animation){
		console.log("Setting animation")
		console.log(animation)
		this.scene.stage.removeChild(this.sprite)
		this.sprite = animation
		this.scene.stage.addChild(this.sprite)
		this.updatePosition()
		this.sprite.play()
	}

	moveToChar(char){
		this.actionQueue.push({
			"cmd": "moveTo",
			"goal": char.interactionPoint
		})
	}

	moveTo(pos){
		let path = this.scene.map.getPath(this.pos, pos)
		if(path == -1){
			console.log("Impossible to get to")
			return
		}
		this.actionQueue.push({
			"cmd": "moveTo",
			"goal": pos
		})
	}

	interactWith(char){
		this.actionQueue.push({
			"cmd": "interact",
			"character": char
		})
	}

	processTouchEvent(evt, coord){
		this.interactWith(this)
	}

	update(dt){
		if(!this.currentAction){
			this.currentActionData = null
			if(this.actionQueue.length){
				this.currentAction = this.actionQueue.shift()
				this.processAction[this.currentAction["cmd"]](dt)
			}
		} else {
			this.processAction[this.currentAction["cmd"]](dt)
		}
	}

	createPath(dt){
		this.currentAction["cmd"] = "move"
		this.currentAction["path"] = this.scene.map.getPath(this.pos, this.currentAction["goal"])
	}

	moveUpdate(dt){
		if(!this.status){
			this.status = true
			if(!this.currentAction["path"].length){ // we arrived
				this.currentAction = null
				this.currentActionData = null
				this.status = null
				console.log("Arrived. :"+this.direction)
				this.setAnimation(this.animations["idle"][this.direction])
				return
			}
			let nextPos = this.currentAction["path"].shift()
			this.currentActionData = {
				endPos: nextPos,
				start : this.coordinates,
				end: this.adjustCoordinates(this.scene.map.coordinatesForIndex(nextPos)),
				timeLeft: this.velocity
			}
			this.currentActionData.incrementX = (this.currentActionData.end.x-this.currentActionData.start.x)/this.velocity
			this.currentActionData.incrementY = (this.currentActionData.end.y-this.currentActionData.start.y)/this.velocity
			this.direction = this.dirBetween(this.pos, nextPos)
			this.setAnimation(this.animations["walking"][this.direction])
			this.sprite.zIndex = nextPos.row+nextPos.col
			this.sortZIndex()
		} else {
			this.currentActionData.timeLeft -= dt
			this.sprite.x += dt * this.currentActionData.incrementX
			this.sprite.y += dt * this.currentActionData.incrementY
			if(this.currentActionData.timeLeft <= 0){
				this.pos = this.currentActionData.endPos
				this.updatePosition()
				this.status = null
			}
		}
	}

	interactUpdate(dt){
		if(!this.currentActionData){	
			this.currentActionData = this.scene.scriptSystem.getDialogueFor(this.currentAction["character"])
			if(this.currentActionData === false){
				this.currentAction = null
				this.currentActionData = null
				return
			}
		}
		console.log("Interact update")
		let monologue = this.currentActionData.shift()
		console.log(monologue)
		this.scene.setDialogue({
			character: monologue.character,
			text: monologue.text
		})
		if(this.currentActionData.length == 0){
			this.currentAction = null
			this.currentActionData = null
		}
	}
}