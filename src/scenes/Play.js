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

        //create collision groups
        this.edibleGroup = this.add.group({
            runChildUpdate: true
        })
        this.mouthGroup = this.add.group()
        
        //set world size
        this.physics.world.setBounds(0, 0, 1028, 1028)
        
        //create background lines
        //how many cuts to make, use amount of segments you want - 1 amount of cuts
        //ex: to cut into two vertically and horizontally, use one cut. to cut into 10, use 9
        const divisionCount = 15
        let backgroundLine
        //div starts at 1 to skip the 0th cut which is the top/left edge of the world
        for(let xDiv = 1; xDiv <= divisionCount; xDiv++) {
            //uses div count + 1 to stop cuts being at the bottom/right edge of the world
            backgroundLine = new Phaser.GameObjects.Line(this, this.physics.world.bounds.width*xDiv/(divisionCount+1), this.physics.world.bounds.height/2, 0, 0, 0, this.physics.world.bounds.height, 0x004400)
            this.add.existing(backgroundLine)
        }
        for(let yDiv = 1; yDiv <= divisionCount; yDiv++) {
            backgroundLine = new Phaser.GameObjects.Line(this, this.physics.world.bounds.width/2, this.physics.world.bounds.height*yDiv/(divisionCount+1), 0, 0, this.physics.world.bounds.width, 0, 0x004400)
            this.add.existing(backgroundLine)
        }

        //set camera bounds
        this.cameras.main.setBounds(0, 0, this.physics.world.bounds.width, this.physics.world.bounds.height)
        //setting the camera follow is part of resetting the spider

        //create player
        this.resetSpider(this.physics.world.bounds.width/2, this.physics.world.bounds.height/2)

        //colliders
        this.physics.add.overlap(this.mouthGroup, this.edibleGroup, this.handleEat, null, this)
        this.enemyCount = 0
        while(this.enemyCount < 10) {
            this.spawnBugAtLocation(Phaser.Math.RND.integerInRange(0, this.physics.world.bounds.width), Phaser.Math.RND.integerInRange(0, this.physics.world.bounds.height))
            this.enemyCount++
        }

        //enemy count text
        this.enemyCountText = this.add.bitmapText(game.config.width*0.5, game.config.height*0.1, 'pixelU64', this.enemyCount, 64).setOrigin(.5).setScrollFactor(0).setDepth(2)


    }

    //do constantly
    update(timestep, dt) {
        //automatically fed time and delta
        this.player.update(dt)
    }

    handleEat(mouth, bug) {
        //console.log(mouth, bug)
        bug.destroy()
        this.enemyCount -= 1
        this.enemyCountText.setText(this.enemyCount)
        if(this.enemyCount == 0) {
            this.endGame()
        }
    }

    spawnBugAtLocation(x, y) {
        //create enemy
        let bug = new EdibleBug(this, x, y, 'smallBug', null)
        this.edibleGroup.add(bug)
    }

    resetSpider(x, y) {
        let oldSpider = this.player
        this.player = new SpiderBody(this, x, y, 'spiderBody', null)
        this.mouthGroup.add(this.player.mouthHitbox)
        //only try to destroy the previous spider if there was one
        if(oldSpider) {
            oldSpider.destroy()
        }
        this.cameras.main.startFollow(this.player, true, 0.75, 0.75, 0, 0)
    }

    endGame() {
        this.time.delayedCall(3000, () => this.scene.start('creditsScene'))
    }
}