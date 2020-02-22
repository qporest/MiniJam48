class VaderGame extends Game {
	constructor(options={}){
		super(options)
		this.scenes = {
			preload: new InitScene(),
			game: new GameScene()
		}
		this.changeScene("preload")
	}

	resourcesLoaded(){
		console.log("Game ready to start")
		this.changeScene("game")
	}
}