class SpiderBody extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame)
        //add to scene
        scene.add.existing(this)
        scene.physics.add.existing(this)
        this.setOrigin(0.5)

        this.legOne = new SpiderLeg(scene, this, null, null, 100, 90)
        //this.legTwo = new SpiderLeg(scene, this, null, null, 100, 180)
        this.legAngle = 0
    }

    update(dt) {
        //this.legOne.setTarget(Phaser.Math.DegToRad(this.legAngle))
        //this.legTwo.setTarget(Phaser.Math.DegToRad(this.legAngle + 180))
        this.legAngle += 1
    }
}