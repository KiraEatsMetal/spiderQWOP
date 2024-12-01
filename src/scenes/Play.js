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
        this.load.path = './assets/'
        //entity assets
        this.load.image('spiderBody', 'spiderBody.png')
        this.load.image('spiderLeg', 'spiderLeg.png')

    }

    //make things
    create() {
        //can recieve data
        //define keys
        key1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE)
        key2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO)
        key3 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE)
        key4 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR)
        key5 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FIVE)
        key6 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SIX)
        key7 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SEVEN)
        key8 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.EIGHT)
        key9 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NINE)
        key0 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ZERO)

        //create player
        this.player = new SpiderBody(this, game.config.width/2, game.config.height/2, 'spiderBody', null)
    }

    //do constantly
    update(timestep, dt) {
        //automatically fed time and delta
        this.player.update(dt)
    }

    
}