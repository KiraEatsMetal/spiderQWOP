class SpiderLeg extends Phaser.GameObjects.Sprite {
    constructor(scene, originObject, texture, frame, length, initialAngle) {


        super(scene, originObject.x, originObject.y, texture, frame)
        //add to scene
        scene.add.existing(this)
        scene.physics.add.existing(this)

        //
        this.originObject = originObject
        this.length = length
        this.setTarget(Phaser.Math.DegToRad(initialAngle))

        let legEnd = this.getPositionFromAngle(originObject, initialAngle, length)
        this.legLine = new Phaser.GameObjects.Line(scene, 0, 0, originObject.x, originObject.y, legEnd.x, legEnd.y, 0xff0000)
        scene.add.existing(this.legLine)
    }

    setTarget(angleRadians) {
        let position = this.getPositionFromAngle(this.originObject, angleRadians, this.length)
        this.x = position.x
        this.y = position.y
    }

    getPositionFromAngle(origin, angleRadians, length) {
        let x = origin.x + length * Math.cos(angleRadians)
        let y = origin.y - length * Math.sin(angleRadians)
        let position = {x, y}
        //console.log(position.x, position.y)
        return position
    }
}