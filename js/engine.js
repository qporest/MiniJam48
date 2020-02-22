// frame used for scheduling canvas update
let frame

// used for game loop control
let last,
  step = 1 / 60,
  dt = 0

function showLoaded(){
  console.log("I'm loaded")
}

class Game {

  constructor(options = {}) {
    last = performance.now()
    frame = (
      window.requestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.msRequestAnimationFrame
    )

    this.options = options
    this.sprites = {}

    this.scene = []
    this.currentScene = null

    this.eventBuffer = []

    this.DEFAULT_WIDTH = 980
    this.DEFAULT_HEIGHT = 640
    this.debug = false

    this.app = null
    this.stage = null
    this.canvas = null

    this.setUpCanvas(options)
    this.loadSprites(options)
      // set up the keyboard listener
    this.canvas.addEventListener('keyup', this.processEvt.bind(this))
    this.canvas.addEventListener('mousedown', this.processClickEvt.bind(this))
    this.canvas.addEventListener('touchstart', this.processTouchEvt.bind(this))
  }

  loadSprites(options){
    this.spritesLoaded(options)
  }

  /**
   * Specifically sets up canvas from the given options
   */
  setUpCanvas(options) {
    if (options.resolution){
      this.app = new PIXI.Application({
        width: options.resolution.width,
        height: options.resolution.height,
        antialias: true
      })
    } else {
      this.app = new PIXI.Application({
        width: this.DEFAULT_WIDTH,
        height: this.DEFAULT_HEIGHT,
        antialias: true
      })
    }
    this.canvas = this.app.view
    this.app.renderer.backgroundColor = 0x000000;
    this.stage = this.app.stage
    document.body.appendChild(this.app.view)
  }

  /* Gets overridden. Called after the sprites are loaded.
  */
  spritesLoaded(){
    this.loadMusic()
  }

  loadMusic(){
    this.resourcesLoaded()
  }

  resourcesLoaded(){
    console.log("Loaded all the resources.")
  }

  /* Changes game scene to a given, clears the stack.
   * @param {Number} scene - scene to change to
   */
  changeScene(scene) {
    while(this.scene.length){
      this.popScene()
    }
    if (this.debug > 2) {
      console.log("Changing scene to " + scene.toString())
    }
    this.pushScene(this.scenes[scene])
    this.currentScene.init(this)
  }

  pushScene(scene){
    console.log("Scene pushed")
    this.scene.push(scene)
    scene.stage.visible = true
    this.stage.addChild(scene.stage)
    this.currentScene = this.scene[this.scene.length - 1]
  }

  popScene(){
    console.log("Scene popped")
    let latest = this.scene.pop()
    this.stage.removeChild(latest.stage)
    latest.stage.visible = false
    this.currentScene = this.scene[this.scene.length - 1]
    return latest
  }

  /* Starts the game loop */
  run() {
    this.canvas.focus()
    frame(this.update.bind(this))
  }

  processEvt(evt) {
    this.eventBuffer.push(evt)
  }

  processClickEvt(evt) {
    evt.preventDefault()
    console.log({x: evt.clientX-this.canvas.offsetLeft,
      y: evt.clientY-this.canvas.offsetTop})
    this.eventBuffer.push({type:"touch", x: evt.clientX-this.canvas.offsetLeft,
        y: evt.clientY-this.canvas.offsetTop})
  }

  processTouchEvt(evt) {
    evt.preventDefault()
    console.log({x: evt.touches[0].clientX-this.canvas.offsetLeft,
      y: evt.touches[0].clientY-this.canvas.offsetTop})
    this.eventBuffer.push({type:"touch", x: evt.touches[0].clientX-this.canvas.offsetLeft,
      y: evt.touches[0].clientY-this.canvas.offsetTop})
  }

  /* The game loop.
   * Checks the events and updates the scene based on them.
   * Attempts to keep a constant fps.
   * Renders the current scene.
   */
  update(now) {
    // process all the events recorded
    for (let event of this.eventBuffer) {
      this.currentScene.processEvt(event)
    }
    this.eventBuffer.length = 0
      // process frame at given fps
      // if there is a need to catch up on update logic
    dt += Math.min(1, (now - last) / 1000)
    while (dt > step) {
      dt -= step
      this.updateScene(step)
    }
    last = now
    this.render() // render the result
    frame(this.update.bind(this)) // schedule next update
  }

  updateScene(dt) {
    // the current scene update should be called here
    if (this.debug) {
      console.log("Updating: [" + dt.toFixed(10) + "] " + this.scene)
    }
    this.currentScene.update(dt)
  }

  render() {
    if (this.debug) {
      console.log("Rendering")
    }
    this.currentScene.render(this.app)
      // the render is called here
  }
}

class Scene {
  constructor({
    UI,
    gameObjects
  }) {
    this.stage = new PIXI.Container()
    this.stage.sortableChildren = true
    this.UI = UI
    this.gameObjects = gameObjects
    for(let obj in this.UI){
      this.stage.add(obj)
    }
    for(let obj in this.gameObjects){
      this.stage.add(obj)
    }
  }

  /**
   * @param {Number} dt - update time
   */
  update(dt) {
      //updates components that depend on time and goes through the event buffer
      for (let obj of this.gameObjects) {
        obj.update(dt)
      }
    }
    /**
     * @param {context2D} ctx - ctx to render on
     */
  render(ctx) {
  }

  processEvt(evt) {
    for (let obj of this.gameObjects) {
      obj.processEvt(evt)
    }
    for (let obj of this.UI) {
      obj.processEvt(evt)
    }
  }

  init(app) {
    this.stage.width = app.canvas.width
    this.stage.height = app.canvas.height
    console.log("Initializing scene")
  }
}

// essentially an interface
class GameObject {
  constructor(){
    this._toDelete = true
  }

  // draws object
  render(ctx) {
  }
    // updates it
  update(dt) {
  }

  //processes events
  processEvt(evt){
  }

  // whether it still should be on the screen
  get toDelete() {
    return this._toDelete
  }

  set toDelete(value) {
    this._toDelete = value
  }
}

class Sprite {
  constructor(img, {
    x,
    y,
    width,
    height
  }) {
    this.img = img
    this.x = x
    this.y = y
    this.width = width
    this.height = height
  }

  draw(ctx, x, y) {
    ctx.drawImage(this.img, this.x, this.y, this.width,
      this.height, x, y, this.width, this.height)
  }
}