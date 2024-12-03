class Tutorial extends Phaser.Scene {
    //functions happen in order

    //happens when the scene is instantiated at the start
    constructor() {
        super('tutorialScene')
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

        //text
        //titles
        this.add.bitmapText(game.config.width*1/4 - 32, game.config.height*2/6 - 64, 'pixelU64', 'RUN PROGRAM', 64).setOrigin(.5).setMaxWidth(game.config.width/3).setLeftAlign()
        this.add.bitmapText(game.config.width*3/4, game.config.height*2/6 - 64, 'pixelU64', 'PRIME DIRECTIVE', 64).setOrigin(.5).setMaxWidth(game.config.width/3).setRightAlign()
        //instruction
        //run
        const runText = 'Use [1], [2], [3], [4], [7], [8], [9], and [0] to control your legs. Your body will follow your legs.'
        this.add.bitmapText(game.config.width*1/4, game.config.height*2/6 + 32*1, 'pixelU', runText, 32).setOrigin(.5, 0).setMaxWidth(game.config.width*0.35)
        //fight
        const fightText = "Touch the MALWARE with your head. Your VIRUS BYTER 3000(c) will automatically BYTE the MALWARE, deleting it. BYTE all the malware."
        this.add.bitmapText(game.config.width*3/4, game.config.height*2/6 + 32*1, 'pixelU', fightText, 32).setOrigin(.5, 0).setMaxWidth(game.config.width*4/9)
        //fight
        const returnText = "Press [7] to return to title"
        this.add.bitmapText(game.config.width/2, game.config.height*5/6 + 32*1, 'pixelU', returnText, 32).setOrigin(.5, 0)

        //define keys
        key7 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SEVEN)
    }

    //do constantly
    update() {
        //automatically fed time and delta
        if(Phaser.Input.Keyboard.JustDown(key7)){
            this.scene.start('titleScene')
        }
    }

    
}