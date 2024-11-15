class Play extends Phaser.Scene {
    //functions happen in order

    //happens when the scene is instantiated at the start
    constructor() {
        super('playScene')
    }

    //happens once every time the scene is restarted/added
    init() {
        //can recieve data
    }

    //load assets
    preload() {

    }

    //make things
    create() {
        //can recieve data
        this.player = new SpiderBody(this, game.config.width/2, game.config.height/2, null, null)
    }

    //do constantly
    update(dt) {
        //automatically fed time and delta
        this.player.update(dt)
    }

    
}