class SpiderLeg extends Phaser.GameObjects.Sprite {
    constructor(scene, originObject, texture, frame, length, initialAngle=0, clockwise=false) {


        super(scene, originObject.x, originObject.y, texture, frame)
        //add to scene
        scene.add.existing(this)
        scene.physics.add.existing(this)

        //parameters
        this.originObject = originObject
        this.length = length
        this.direction = (clockwise) ? -1: 1

        this.angleConstraints
        this.minTarget
        this.maxTarget

        //initial setup
        this.setAlpha(0)
        this.setTarget(initialAngle)
        let legAngle = SpiderBody.getAngleFromPosition(this.originObject, this)
        //console.log(legAngle)
        this.setAngle(-legAngle)
        this.active = false

        //create constraint targets
        this.rightConstraint = new Phaser.GameObjects.Sprite(scene, this.x, this.y, null, null)
        this.leftConstraint = new Phaser.GameObjects.Sprite(scene, this.x, this.y, null, null)
        this.rightConstraint.active = true
        this.leftConstraint.active = true
        this.updateAngle(this.angle)

        //leg visuals
        this.legGraphic = new Phaser.GameObjects.Sprite(scene, originObject.x, originObject.y, 'spiderLeg', null).setOrigin(0, 0.5)
        scene.add.existing(this.legGraphic)

        //debug line for leg angle
        this.legEnd = SpiderBody.getPositionFromAngle(this.originObject, initialAngle, this.length)
        this.legLine = new Phaser.GameObjects.Line(scene, originObject.x, originObject.y, 0, 0, this.legEnd.x - originObject.x, this.legEnd.y - originObject.y, 0xff0000, 0).setOrigin(0)
        scene.add.existing(this.legLine)
    }

    setTarget(angleDeg) {
        let position = SpiderBody.getPositionFromAngle(this.originObject, angleDeg, this.length)

        //produces an angle from 180 to -180
        let angle = SpiderBody.getAngleFromPosition(this.originObject, position)
        
        if(this.angleConstraints) {
            //based in part on https://math.stackexchange.com/questions/1044905/simple-angle-between-two-angles-of-circle
            let adjustedAngle = angle
            let adjustedMin = this.angleConstraints.min
            let adjustedMax = this.angleConstraints.max

            //create array for adjusting loop
            let anglesArray = [adjustedMin, adjustedAngle, adjustedMax]
            //subtract minimum angle
            for(let i = 2; i >= 0; i -= 1) {
                anglesArray[i] -= anglesArray[0]
            }
            //set angles to 0-360
            for(let i in anglesArray) {
                if(anglesArray[i] < 0) {
                    anglesArray[i] += 360
                }
            }
            //console.log(anglesArray)
            //set adjusted angle parameters
            adjustedAngle = anglesArray[1]
            adjustedMin = anglesArray[0]
            adjustedMax = anglesArray[2]
            console.log([adjustedMin, adjustedAngle, adjustedMax])

            //adjusting angle
            if(this.angleConstraints.max - angle > 180) {
                angle += 360
            }

            var difference = Math.abs(this.angleConstraints.max - this.angleConstraints.min)

            if(false) {
                //manually set to middle of constraints without calling set target to avoid recursing
                angleDeg = (this.angleConstraints.max + this.angleConstraints.min) / 2
                position = SpiderBody.getPositionFromAngle(this.originObject, angleDeg, this.length)
                this.x = position.x
                this.y = position.y

            } else if(adjustedAngle * this.direction > adjustedMax * this.direction) {
                //over max
                console.log('over max: ', adjustedAngle * this.direction, adjustedMax * this.direction)
                this.setTarget(this.angleConstraints.max - difference * 0.01 * this.direction)

            } else if(adjustedAngle * this.direction < 0 && false) {
                //under min
                console.log('under min: ', adjustedAngle * this.direction)
                this.setTarget(this.angleConstraints.min + difference * 0.01 * this.direction)
                
            } else {
                this.x = position.x
                this.y = position.y
            }
            /*
            if(this.angleConstraints.max * this.direction < this.angleConstraints.min * this.direction) {
                //manually set to middle of constraints without calling set target to avoid recursing
                angleDeg = (this.angleConstraints.max + this.angleConstraints.min) / 2
                position = SpiderBody.getPositionFromAngle(this.originObject, angleDeg, this.length)
                this.x = position.x
                this.y = position.y

            } else if(angle * this.direction > this.angleConstraints.max * this.direction) {
                //over max
                this.setTarget(this.angleConstraints.max - difference * 0.001 * this.direction)

            } else if(angle * this.direction < this.angleConstraints.min * this.direction) {
                //under max
                this.setTarget(this.angleConstraints.min + difference * 0.001 * this.direction)
                
            } else {
                this.x = position.x
                this.y = position.y
            }
            */
        } else {
            this.x = position.x
            this.y = position.y
        }
    }

    rotateTarget(amount) {
        //you want to dt this since you do it every frame
        let angle = SpiderBody.getAngleFromPosition(this.originObject, this)
        //console.log(amount, angle, angle+amount*this.direction)
        //console.log(this.getConstraints(), this.direction)
        this.setTarget(angle + amount * this.direction)
    }

    updateLeg() {
        let legAngle = SpiderBody.getAngleFromPosition(this.originObject, this)
        this.legEnd = SpiderBody.getPositionFromAngle(this.originObject, legAngle, this.length)

        this.updateAngle(-legAngle)
        //visual leg
        this.legGraphic.setPosition(this.originObject.x, this.originObject.y)
        //angle is negative because our math uses counterclockwise angles, phaser uses clockwise angles
        this.legGraphic.setAngle(-legAngle)
        let distance = SpiderBody.getDistanceFromPosition(this.originObject, this)
        this.legGraphic.setScale(distance / this.legGraphic.width, 1)
    }

    updateLegLine(coordinates) {
        //this function was for debugging before we had graphics
        this.legLine.setTo(0, 0, coordinates.x - this.originObject.x, coordinates.y - this.originObject.y).setPosition(this.originObject.x, this.originObject.y)
    }

    ikPullBody() {
        let angle = SpiderBody.getAngleFromPosition(this, this.originObject)
        let distance = SpiderBody.getDistanceFromPosition(this.originObject, this)
        //if distance is too far, preserve angle but shorten distance
        if(Math.abs(distance) > this.length) {
            let targetPosition = SpiderBody.getPositionFromAngle(this.legEnd, angle, this.length)
            this.originObject.setPosition(targetPosition.x, targetPosition.y)
        }
    }

    setConstraints(min, max) {
        this.angleConstraints = {}
        //prevents problems with angles going from 180 to -180
        /*
        if(this.direction == 1 && max < 0) {
            max += 360
        }
        if(this.direction == -1 && min < 0) {
            min += 360
        }
        */
        this.angleConstraints.min = min
        this.angleConstraints.max = max
    }

    setConstraintTargets(minTarget, maxTarget) {
        this.minTarget = minTarget
        this.maxTarget = maxTarget
        this.updateConstraints()
    }

    constraintsActive() {
        //are the constraint targets (usually other legs) active? if so, you can do leg things
        if(this.minTarget.active && this.maxTarget.active) {
            return true
        }
        return false
    }

    updateConstraints() {
        this.setConstraints(-this.minTarget.angle, -this.maxTarget.angle)
    }

    getConstraints() {
        return this.angleConstraints
    }

    destroy() {
        this.legLine.destroy()
        this.legGraphic.destroy()
        this.leftConstraint.destroy()
        this.rightConstraint.destroy()
        super.destroy()
    }

    updateAngle(angle) {
        this.setAngle(angle)
        //update constraint markers
        this.leftConstraint.setAngle(angle - 5)
        this.rightConstraint.setAngle(angle + 5)
    }

    setActive(bool) {
        this.active = bool
        this.leftConstraint.active = bool
        this.rightConstraint.active = bool
    }
}