class SpiderBody extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame)
        //add to scene
        scene.add.existing(this)
        scene.physics.add.existing(this)
        this.setOrigin(0.5)

        //create legs
        this.legOne = new SpiderLeg(scene, this, null, null, 100, 210, true)
        this.legTwo = new SpiderLeg(scene, this, null, null, 100, 190, true)
        this.legThree = new SpiderLeg(scene, this, null, null, 100, 170, true)
        this.legFour = new SpiderLeg(scene, this, null, null, 100, 150, true)
        this.legFive = new SpiderLeg(scene, this, null, null, 100, 30)
        this.legSix = new SpiderLeg(scene, this, null, null, 100, 10)
        this.legSeven = new SpiderLeg(scene, this, null, null, 100, -10)
        this.legEight = new SpiderLeg(scene, this, null, null, 100, -30)
        
        //each leg needs a control
        this.legArray = [this.legOne, this.legTwo, this.legThree, this.legFour, this.legFive, this.legSix, this.legSeven, this.legEight]
        this.controlArray = [key1, key2, key3, key4, key7, key8, key9, key0]
        //group legs into left and right legs
        this.leftLegArray = [this.legOne, this.legTwo, this.legThree, this.legFour]
        this.rightLegArray = [this.legFive, this.legSix, this.legSeven, this.legEight]

        //body control variables
        this.targetX
        this.targetY
        this.activeLegCount

        this.leftAngle
        this.rightAngle

        this.totalVector = new Phaser.Math.Vector2(0, 0)
        this.legVector = new Phaser.Math.Vector2(0, 0)
        this.logging = true
    }

    update(dt) {
        //go through each leg
        for(let key in this.controlArray) {
            //if pressing the leg's button, rotate
            //else ik pull
            if(this.controlArray[key].isDown) {
                this.legArray[key].rotateTarget()
            } else {
                //THIS HAS TO HAPPEN BEFORE UPDATE LEG
                this.legArray[key].ikPullBody()
            }
            //update leg
            this.legArray[key].updateLeg()
        }

        this.targetX = 0
        this.targetY = 0
        this.activeLegCount = 0
        //for each leg, if active, add to summed coordinates
        for(let leg in this.legArray) {
            if(this.legArray[leg].active) {
                this.targetX += this.legArray[leg].legEnd.x
                this.targetY += this.legArray[leg].legEnd.y
                this.activeLegCount += 1
            }
        }

        //if no active legs, do not move
        if(this.activeLegCount > 0) {
            this.targetX = this.targetX / this.activeLegCount
            this.targetY = this.targetY / this.activeLegCount
        } else {
            this.targetX = this.x, this.targetY = this.y
        }

        let spiderX = this.x
        let spiderY = this.y
        this.totalVector = new Phaser.Math.Vector2(0, 0)
        //iterate over left legs to create a vector of the average angle
        for(let leftLeg in this.leftLegArray) {
            this.legVector.set(this.leftLegArray[leftLeg].x - spiderX, this.leftLegArray[leftLeg].y - spiderY).normalize()
            this.totalVector.add(this.legVector)
        }
        this.leftAngle = this.getAngleFromPosition({x: 0, y: 0}, this.totalVector)

        //reset total vector
        this.totalVector = new Phaser.Math.Vector2(0, 0)
        //iterate over right legs to create a vector of the average angle
        for(let rightLeg in this.rightLegArray) {
            this.legVector.set(this.rightLegArray[rightLeg].x - spiderX, this.rightLegArray[rightLeg].y - spiderY).normalize()
            this.totalVector.add(this.legVector)
        }
        this.rightAngle = this.getAngleFromPosition({x: 0, y: 0}, this.totalVector)
        
        //adjusting angles
        if(this.leftAngle < 0) {
            this.leftAngle += 360
        }
        if(this.rightAngle > 0) {
            this.rightAngle -= 360
        }
        let averageAngle = (this.rightAngle + this.leftAngle) / 2
        //make sure that the spider doesn't flip as either angle goes around from 180 to -180
        if(this.leftAngle - averageAngle > 180) {
            averageAngle += 180
        }
        
        this.approachPosition(this.targetX, this.targetY, 0.1)

        if(this.logging) {
            console.log(this.leftAngle, this.rightAngle, averageAngle)
        }
        //phaser sprite angle rotates clockwise
        this.setAngle(-averageAngle)
        this.logging = true
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

    getPositionFromAngle(origin, angleDeg, length) {
        let angleRadians = Phaser.Math.DegToRad(angleDeg)
        let x = origin.x + length * Math.cos(angleRadians)
        let y = origin.y - length * Math.sin(angleRadians)
        let position = {x, y}
        //console.log(position.x, position.y)
        return position
    }
}