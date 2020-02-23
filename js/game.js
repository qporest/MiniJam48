class EscapeGame extends Game {
	constructor(options={}){
		options.resolution = {
				width:  480,
				height: 480
		}

		super(options)

		this.firstTime = true
		this.musicEnabled = false

		this.scenes = {
			preload: new InitScene(),
			game: new GameScene(),
			menu: new MenuScene()
		}
		this.changeScene("preload")
	}

	resourcesLoaded(){
		console.log("Game ready to start")
		this.changeScene("menu")
	}

	loadSprites(options){
	  if(this.currentScene !== null && "textObject" in this.currentScene){
	    this.currentScene.textObject.text = "Loading Images"
	  }
	  PIXI.loader
	    .add(options["sprites"])
	    .add("./img/animations/VaderAnimation.json")
	    .load(this.spritesLoaded.bind(this))
	}

	spritesLoaded(){
	  if(this.currentScene !== null && "textObject" in this.currentScene){
	    this.currentScene.textObject.text = "Loading Font"
	  }
	  console.log("Sprites loaded.")
	  for(let sprite_path of this.options["sprites"]){
	    console.log("Adding :"+this.options["sprite_mapping"][sprite_path])
	    this.sprites[this.options["sprite_mapping"][sprite_path]] =
	      new PIXI.Sprite(PIXI.loader.resources[sprite_path].texture) 
	  }
	  for(let animation in PIXI.loader.resources["./img/animations/VaderAnimation.json"].spritesheet.animations){
	    this.sprites[animation] = new PIXI.extras.AnimatedSprite(
	      PIXI.loader.resources["./img/animations/VaderAnimation.json"].spritesheet.animations[animation]
	    )
	  }
	  
	  // this.sprites[] = new PIXI.extras.AnimatedSprite(
	  // )
	  
	  let font = new FontFaceObserver('arcade', {
	  })

	  font.load().then(this.loadMusic.bind(this))
	}

	loadMusic(){
		if(this.currentScene !== null && "textObject" in this.currentScene){
		  this.currentScene.textObject.text = "Loading Music"
		}
		// sounds.load([
		// ])
		// sounds.whenLoaded = this.resourcesLoaded.bind(this)
		this.resourcesLoaded()
	}
}