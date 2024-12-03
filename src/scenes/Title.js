class Title extends Phaser.Scene {
    //functions happen in order

    //happens when the scene is instantiated at the start
    constructor() {
        super('titleScene')
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
        this.add.bitmapText(Math.floor(game.config.width*0.5), Math.floor(game.config.height*0.7), 'pixelU64', 'Itsy BYTEsy Spider', 64).setOrigin(.5)
        this.add.image(game.config.width*0.5, game.config.height*0.4, 'titleSplash').setOrigin(0.5)

        const menuTextOffset = {x: 0.25, y: 0.95}

        const leftText = 'Press [4] for tutorial'
        this.add.bitmapText(game.config.width * menuTextOffset.x, game.config.height * menuTextOffset.y - 32, 'pixelU', leftText, 32).setOrigin(.5).setMaxWidth(game.config.width/3)
        const rightText = 'Press [7] to BYTE'
        this.add.bitmapText(game.config.width * (1 - menuTextOffset.x), game.config.height * menuTextOffset.y - 32, 'pixelU', rightText, 32).setOrigin(.5).setMaxWidth(game.config.width/3)
        
        //define keys
        key4 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR)
        key7 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SEVEN)
    }

    //do constantly
    update() {
        //automatically fed time and delta
        if(Phaser.Input.Keyboard.JustDown(key4)){
            this.scene.start('tutorialScene')
        }
        if(Phaser.Input.Keyboard.JustDown(key7)){
            this.scene.start('playScene')
        }
    }

    
}