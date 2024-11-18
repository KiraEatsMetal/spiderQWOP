class SpiderLeg extends Phaser.GameObjects.Sprite {
    constructor(scene, originObject, texture, frame, length, initialAngle=0, clockwise=false) {


        super(scene, originObject.x, originObject.y, texture, frame)
        //add to scene
        scene.add.existing(this)
        scene.physics.add.existing(this)

        //
        this.setAlpha(0)
        this.originObject = originObject
        this.length = length
        this.setTarget(initialAngle)
        this.active = false

        this.direction = (clockwise) ? -1: 1

        //debug line for initial leg angle
        this.legEnd = this.getPositionFromAngle(this.originObject, initialAngle, this.length)
        this.legLine = new Phaser.GameObjects.Line(scene, originObject.x, originObject.y, 0, 0, this.legEnd.x - originObject.x, this.legEnd.y - originObject.y, 0xff0000).setOrigin(0)
        scene.add.existing(this.legLine)
    }

    setTarget(angleDeg) {
        let position = this.getPositionFromAngle(this.originObject, angleDeg, this.length)
        this.x = position.x
        this.y = position.y
    }

    getPositionFromAngle(origin, angleDeg, length) {
        let angleRadians = Phaser.Math.DegToRad(angleDeg)
        let x = origin.x + length * Math.cos(angleRadians)
        let y = origin.y - length * Math.sin(angleRadians)
        let position = {x, y}
        //console.log(position.x, position.y)
        return position
    }

    rotateTarget() {
        this.active = false
        let angle = this.originObject.getAngleFromPosition(this.originObject, this)
        this.setTarget(angle + 3 * this.direction)
    }

    updateLeg() {
        //set active
        if(this.active) {
            this.ikPullBody()
        }
        this.active = true

        let legAngle = this.originObject.getAngleFromPosition(this.originObject, this)
        this.legEnd = this.getPositionFromAngle(this.originObject, legAngle, this.length)
        this.updateLegLine(this.legEnd)
    }

    updateLegLine(coordinates) {
        this.legLine.setTo(0, 0, coordinates.x - this.originObject.x, coordinates.y - this.originObject.y).setPosition(this.originObject.x, this.originObject.y)
    }

    ikPullBody() {
        let angle = this.originObject.getAngleFromPosition(this, this.originObject)
        let distance = Math.sqrt((this.x - this.originObject.x) ** 2 + (this.y - this.originObject.y) ** 2)
        if(Math.abs(distance) > this.length) {
            let targetPosition = this.getPositionFromAngle(this.legEnd, angle, this.length)
            this.originObject.setPosition(targetPosition.x, targetPosition.y)
        }
        //console.log(angle)
    }
}