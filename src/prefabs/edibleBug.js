class EdibleBug extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame)
        //add to scene
        scene.add.existing(this)
        scene.physics.add.existing(this)
        this.setOrigin(0.5)

        //state machine
        this.stateMachine = new StateMachine('Wander', {
            move: new BugWanderState(),
            move: new BugFleeState(),
        }, [this.scene, this])
    }

    update() {

    }

    
}