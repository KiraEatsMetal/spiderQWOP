class SpiderBody extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame)
        //add to scene
        scene.add.existing(this)
        scene.physics.add.existing(this)
        this.setOrigin(0.5)

        //create legs
        this.legOne = new SpiderLeg(scene, this, null, null, 100, 270, true)
        this.legTwo = new SpiderLeg(scene, this, null, null, 100, 225, true)

        this.legThree = new SpiderLeg(scene, this, null, null, 100, 180, true)
        this.legFour = new SpiderLeg(scene, this, null, null, 100, 135, true)

        this.legFive = new SpiderLeg(scene, this, null, null, 100, 45)
        this.legSix = new SpiderLeg(scene, this, null, null, 100, 0)

        this.legSeven = new SpiderLeg(scene, this, null, null, 100, -45)
        this.legEight = new SpiderLeg(scene, this, null, null, 100, -90)
        
        //this.setAngle(90)
        this.legArray = [this.legOne, this.legTwo, this.legThree, this.legFour, this.legFive, this.legSix, this.legSeven, this.legEight]
        this.leftLegArray = [this.legOne, this.legTwo, this.legThree, this.legFour]
        this.rightLegArray = [this.legFive, this.legSix, this.legSeven, this.legEight]
        this.controlArray = [key1, key2, key3, key4, key7, key8, key9, key0]
    }

    update(dt) {

        for(let key = 0; key < this.controlArray.length; key++) {
            this.legArray[key].updateLeg()
            if(this.controlArray[key].isDown) {
                this.legArray[key].rotateTarget()
            }
        }

        let x = 0
        let y = 0
        let activeLegCount = 0
        for(let i = 0; i < this.legArray.length; i++) {
            if(this.legArray[i].active) {
                x += this.legArray[i].legEnd.x
                y += this.legArray[i].legEnd.y
                activeLegCount += 1
            }
        }
        if(activeLegCount > 0) {
            x = x / activeLegCount
            y = y / activeLegCount
        } else {
            x = this.x, y = this.y
        }
        //console.log(x, y)
        this.approachPosition(x, y, 0.1)
    }

    approachPosition(x, y, factor=0.1) {
        this.setX(this.x + (x - this.x) * factor)
        this.setY(this.y + (y - this.y) * factor)
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
}