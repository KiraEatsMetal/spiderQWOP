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
        this.controlArray = [key1, key2, key3, key4, key7, key8, key9, key0]
    }

    update(dt) {

        for(let key = 0; key < this.controlArray.length; key++) {
            if(this.controlArray[key].isDown) {
                this.legArray[key].rotateTarget()
            }
            this.legArray[key].updateLeg()
        }

        let x = 0
        let y = 0
        for(let i = 0; i < this.legArray.length; i++) {
            x += this.legArray[i].x
            y += this.legArray[i].y
        }
        x = x / this.legArray.length
        y = y / this.legArray.length
        //console.log(x, y)
        this.setPosition(x, y)
    }
}