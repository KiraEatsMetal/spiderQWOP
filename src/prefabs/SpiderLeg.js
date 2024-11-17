class SpiderLeg extends Phaser.GameObjects.Sprite {
    constructor(scene, originObject, texture, frame, length, initialAngle=0, clockwise=false) {


        super(scene, originObject.x, originObject.y, texture, frame)
        //add to scene
        scene.add.existing(this)
        scene.physics.add.existing(this)

        //
        this.originObject = originObject
        this.length = length
        this.setTarget(initialAngle)

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

    getAngleFromPosition(start, end) {
        let coords = new Phaser.Math.Vector2(end.x - start.x, end.y - start.y)
        let angle = Math.atan2(-coords.y, coords.x)
        angle = Phaser.Math.RadToDeg(angle)
        while(angle < -180) {
            angle += 360
        }
        while(angle > 180) {
            angle -= 360
        }
        return angle
    }

    rotateTarget() {
        let angle = this.getAngleFromPosition(this.originObject, this)
        this.setTarget(angle + 1 * this.direction)
    }

    updateLeg() {
        let legAngle = this.getAngleFromPosition(this.originObject, this)
        this.legEnd = this.getPositionFromAngle(this.originObject, legAngle, this.length)
        this.legLine.setTo(0, 0, this.legEnd.x - this.originObject.x, this.legEnd.y - this.originObject.y).setPosition(this.originObject.x, this.originObject.y)
    }
}