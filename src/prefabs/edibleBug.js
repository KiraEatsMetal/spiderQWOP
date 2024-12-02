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
        this.stateMachine = new StateMachine('idle', {
            wander: new BugWanderState(),
            flee: new BugFleeState(),
            idle: new BugIdleState()
        }, [this.scene, this])

        this.idleTime = 0
        this.travelTime = 0
        this.travelAngle = Phaser.Math.RND.integerInRange(-180, 180)
        this.lastMove = 'wander'
        this.wanderSpeed = 0.75
        this.fleeSpeed = 1
    }

    update() {
        this.stateMachine.step()
    }

    move(angle, speed) {
        this.setAngle(-angle)
        let movementVector = new Phaser.Math.Vector2(0, 0)
        this.scene.physics.velocityFromAngle(-angle, speed, movementVector)
        this.setPosition(this.x + movementVector.x, this.y + movementVector.y)
    }
}

class BugIdleState extends State {
    enter(scene, bug) {
        bug.idleTime += Phaser.Math.RND.integerInRange(300, 700)
        //console.log('idle, distance:', Math.abs(SpiderBody.getDistanceFromPosition(scene.player, bug)))
    }
    
    execute(scene, bug) {
        let dt = scene.game.loop.delta
        bug.idleTime = Math.max(0, bug.idleTime - dt)
        let playerDistance = Math.abs(SpiderBody.getDistanceFromPosition(scene.player, bug))
        if(bug.idleTime == 0) {
            if(playerDistance < 150) {
                bug.stateMachine.transition('flee')
            } else if(playerDistance > 300){
                bug.stateMachine.transition('wander')
            } else {
                bug.stateMachine.transition(bug.lastMove)
            }
        }
    }
}

class BugWanderState extends State {
    enter(scene, bug) {
        bug.travelAngle = Phaser.Math.RND.integerInRange(-180, 180)
        bug.travelTime += Phaser.Math.RND.integerInRange(700, 2000)
        bug.lastMove = 'wander'
        //console.log('wander, angle:', bug.travelAngle)
    }
    
    execute(scene, bug) {
        let dt = scene.game.loop.delta
        bug.travelTime = Math.max(0, bug.travelTime - dt)
        bug.move(bug.travelAngle, bug.wanderSpeed * dt/16)
        if(bug.travelTime == 0) {
            bug.idleTime += Phaser.Math.RND.integerInRange(100, 600)
            bug.stateMachine.transition('idle')
        }
    }
}

class BugFleeState extends State {
    enter(scene, bug) {
        bug.travelAngle = SpiderBody.getAngleFromPosition(scene.player, bug) + Phaser.Math.RND.integerInRange(-20, 20)
        bug.travelTime += Phaser.Math.RND.integerInRange(500, 1000)
        bug.lastMove = 'flee'
        //console.log('flee, angle:', bug.travelAngle)
    }
    
    execute(scene, bug) {
        let dt = scene.game.loop.delta
        bug.travelTime = Math.max(0, bug.travelTime - dt)
        bug.move(bug.travelAngle, bug.fleeSpeed * dt/16)
        if(bug.travelTime == 0) {
            bug.stateMachine.transition('idle')
        }
    }
}