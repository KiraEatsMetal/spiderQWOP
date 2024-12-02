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
        
        this.physics.world.setBounds(0, 0, 2048, 2048)

        //create player
        this.player = new SpiderBody(this, this.physics.world.bounds.width/2, this.physics.world.bounds.height/2, 'spiderBody', null)
        
        //set camera bounds
        this.cameras.main.setBounds(0, 0, this.physics.world.bounds.width, this.physics.world.bounds.height)
        this.cameras.main.startFollow(this.player, true, 0.75, 0.75, 0, 0)

        //colliders
        this.physics.add.overlap(this.player.mouthHitbox, this.edibleGroup, this.handleEat, null, this)
        let enemyCount = 0
        while(enemyCount < 10) {
            this.spawnBugAtLocation(Phaser.Math.RND.integerInRange(0, this.physics.world.bounds.width), Phaser.Math.RND.integerInRange(0, this.physics.world.bounds.height))
            console.log('new bug, count: ', enemyCount)
            enemyCount++
        }
        //this.spawnBugAtLocation(Phaser.Math.RND.integerInRange(0, this.physics.world.bounds.width), Phaser.Math.RND.integerInRange(0, this.physics.world.bounds.height))

    }

    //do constantly
    update(timestep, dt) {
        //automatically fed time and delta
        this.player.update(dt)
    }

    handleEat(mouth, bug) {
        console.log(mouth, bug)
        bug.destroy()
    }

    spawnBugAtLocation(x, y) {
        //create enemy
        let bug = new EdibleBug(this, x, y, 'smallBug', null)
        this.edibleGroup.add(bug)
    }
}