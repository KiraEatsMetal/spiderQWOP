class EdibleBug extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame)
        //add to scene
        scene.add.existing(this)
        scene.physics.add.existing(this)
        this.setOrigin(0.5)
        this.body.setCircle(this.width/2)
        this.body.setCollideWorldBounds(true)
        this.scene = scene

        //state machine
        /*
        this.stateMachine = new StateMachine('Wander', {
            move: new BugWanderState(),
            move: new BugFleeState(),
        }, [this.scene, this])
        */
    }

    update() {
        let dt = this.scene.game.loop.delta
        this.move(90, 1 * dt/16)
    }

    move(angle, speed) {
        this.setAngle(-angle)
        let movementVector = new Phaser.Math.Vector2(0, 0)
        this.scene.physics.velocityFromAngle(-angle, speed, movementVector)
        this.setPosition(this.x + movementVector.x, this.y + movementVector.y)
    }
}