class SpiderLeg extends Phaser.GameObjects.Sprite {
    constructor(scene, originObject, texture, frame, length, intialAngle) {


        super(scene, originObject.x, originObject.y, texture, frame)
        //add to scene
        scene.add.existing(this)
        scene.physics.add.existing(this)

        //
        this.originObject = originObject
        this.length = length
    }

    getPositionFromAngle(angleRadians) {
        let x = this.originObject.x + this.length * Math.cos(angleRadians)
        let y = this.originObject.y - this.length * Math.sin(angleRadians)
        let position = {x, y}
        console.log(position.x, position.y)
        this.x = position.x
        this.y = position.y
        return position
    }
}