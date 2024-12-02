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
            //adjusting angle
            if(this.angleConstraints.max - angle > 180) {
                //console.log('Angle Max difference over 180')
                angle += 360
            }
            //logging
            //console.log('one: ' + angle, 'max: ' + this.angleConstraints.max, 'min: ' + this.angleConstraints.min)

            var difference = Math.abs(this.angleConstraints.max - this.angleConstraints.min)

            if(this.angleConstraints.max * this.direction < this.angleConstraints.min * this.direction) {
                //console.log('ABORT, MAX LESS THAN MIN')
                //manually set to middle of constraints without calling set target to avoid recursing
                angleDeg = (this.angleConstraints.max + this.angleConstraints.min) / 2
                position = SpiderBody.getPositionFromAngle(this.originObject, angleDeg, this.length)
                this.x = position.x
                this.y = position.y

            } else if(angle * this.direction > this.angleConstraints.max * this.direction) {
                //console.log('at max')
                this.setTarget(this.angleConstraints.max - difference * 0.001 * this.direction)

            } else if(angle * this.direction < this.angleConstraints.min * this.direction) {
                //console.log('at min')
                this.setTarget(this.angleConstraints.min + difference * 0.001 * this.direction)
                
            } else {
                this.x = position.x
                this.y = position.y
            }

            //logging
            //console.log('two: ' + angle, 'max: ' + this.angleConstraints.max, 'min: ' + this.angleConstraints.min)
            //console.log('')
        } else {
            //console.log('no angle constraints: ', + toString(this.angleConstraints))
            this.x = position.x
            this.y = position.y
        }
    }

    rotateTarget(amount) {
        //you want to dt this since you do it every frame
        let angle = SpiderBody.getAngleFromPosition(this.originObject, this)
        this.setTarget(angle + amount * this.direction)
    }

    updateLeg() {
        let legAngle = SpiderBody.getAngleFromPosition(this.originObject, this)
        this.legEnd = SpiderBody.getPositionFromAngle(this.originObject, legAngle, this.length)

        //update debug line
        //this.updateLegLine(this.legEnd)
        this.setAngle(-legAngle)
        //visual leg
        //set origin to the spider body
        this.legGraphic.setPosition(this.originObject.x, this.originObject.y)
        //angle is negative because our math uses counterclockwise angles
        this.legGraphic.setAngle(-legAngle)
        //get distance between leg target and spider body, scale leg by distance
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
        if(this.direction == 1 && max < 0) {
            max += 360
        }
        if(this.direction == -1 && min < 0) {
            min += 360
        }
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
}