class SpiderBody extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame)
        //add to scene
        scene.add.existing(this)
        scene.physics.add.existing(this)
        this.setOrigin(0.5)

        this.legOne = new SpiderLeg(scene, this, null, null, 100, 0)
        this.legOne.getPositionFromAngle(Phaser.Math.DegToRad(0))
        this.legOne.getPositionFromAngle(Phaser.Math.DegToRad(45))
        this.legOne.getPositionFromAngle(Phaser.Math.DegToRad(90))
        this.legOne.getPositionFromAngle(Phaser.Math.DegToRad(135))
        this.legOne.getPositionFromAngle(Phaser.Math.DegToRad(180))
        this.legOne.getPositionFromAngle(Phaser.Math.DegToRad(225))
        this.legOne.getPositionFromAngle(Phaser.Math.DegToRad(270))
        this.legOne.getPositionFromAngle(Phaser.Math.DegToRad(315))
        this.legOne.getPositionFromAngle(Phaser.Math.DegToRad(360))
        this.legAngle = 0
    }

    update(dt) {
        this.legOne.getPositionFromAngle(Phaser.Math.DegToRad(this.legAngle))
        this.legAngle += 1
    }
}