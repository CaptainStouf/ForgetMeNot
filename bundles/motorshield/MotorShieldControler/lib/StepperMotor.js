
var async = require('async');
var sleep = require('sleep');

var __MICROSTEPCURVE = [0, 25, 50, 74, 98, 120, 141, 162, 180, 197, 212, 225, 236, 244, 250, 253, 255];
//var __MICROSTEPCURVE = [0, 50, 98, 142, 180, 212, 236, 250, 255]; //with MICROSTEPS = 8

var MICROSTEPS = 16;       // 8 or 16

var FORWARD = 1;
var BACKWARD = 2;
var RELEASE = 4;

var SINGLE = 1;
var DOUBLE = 2;
var INTERLEAVE = 3;
var MICROSTEP = 4;

var LOW = 0;
var HIGH = 1;

// Constructor
function StepperMotor(MC, pinConfig) {
    this.MC = MC;
    this.PWMApin = pinConfig.pwma;
    this.PWMBpin = pinConfig.pwmb;
    this.AIN1pin = pinConfig.ain1;
    this.AIN2pin = pinConfig.ain2;
    this.BIN1pin = pinConfig.bin1;
    this.BIN2pin = pinConfig.bin2;
    this.revsteps = 0;
    this.currentstep = 0;
}

StepperMotor.prototype.setSpeed = function(rpm) {
    this.usperstep = 60000000.0 / (this.revsteps * rpm);
    this.steppingcounter = 0;
};

StepperMotor.prototype.release = function() {
    this.MC.setPin(this.AIN1pin, LOW);
    this.MC.setPin(this.AIN2pin, LOW);
    this.MC.setPin(this.BIN1pin, LOW);
    this.MC.setPin(this.BIN2pin, LOW);
    this.MC.setPWM(this.PWMApin, 0);
    this.MC.setPWM(this.PWMBpin, 0);
};

StepperMotor.prototype.step = function(steps, dir, style) {
    var that = this;
    var uspers = this.usperstep;
    var ret = 0;
    if (style === INTERLEAVE){
        uspers /= 2
    } else if (style === MICROSTEP) {
        uspers /= MICROSTEPS;
        steps *= MICROSTEPS;
    }

    var step = function(stepCallback) {
        ret = that.onestep(dir, style);
        sleep.usleep(uspers); // 5000 microseconds = 5 milisecond * 1000
        that.steppingcounter += (uspers % 1000);
        if (that.steppingcounter >= 1000){
            sleep.usleep(1000); // 1000 microseconds = 1 milisecond
            that.steppingcounter -= 1000;
        }
    };

    while (steps > 0){
        steps -= 1;
        step();
    }

    if (style === MICROSTEP) {
       while((ret != 0) && (ret !== MICROSTEPS)){
           step();
       }
    }
};

StepperMotor.prototype.onestep = function(dir, style) {
    var ocra = 255;
    var ocrb = 255;

    // next determine what sort of stepping procedure we're up to
    if (style == SINGLE){
        if (((this.currentstep/(MICROSTEPS/2)) % 2) > 0){ // we're at an odd step, weird
            if (dir == FORWARD){
                this.currentstep += MICROSTEPS/2;
            } else {
                this.currentstep -= MICROSTEPS/2;
            }
        } else {           // go to the next even step
            if (dir == FORWARD) {
                this.currentstep += MICROSTEPS;
            } else {
                this.currentstep -= MICROSTEPS;
            }
        }
    } else if (style == DOUBLE){
        if ((this.currentstep/(MICROSTEPS/2) % 2) == 0){ // we're at an even step, weird
            if (dir == FORWARD) {
                this.currentstep += MICROSTEPS/2;
            } else {
                this.currentstep -= MICROSTEPS/2;
            }
        } else {           // go to the next odd step
            if (dir == FORWARD){
                this.currentstep += MICROSTEPS;
            } else {
                this.currentstep -= MICROSTEPS;
            }
        }
    } else if (style == INTERLEAVE){
        if (dir == FORWARD){
            this.currentstep += MICROSTEPS/2;
        } else {
            this.currentstep -= MICROSTEPS/2;
        }
    } else if (style == MICROSTEP) {
        if (dir == FORWARD){
            this.currentstep += 1;
        } else {
            // BACKWARDS
            this.currentstep -= 1;
        }
        this.currentstep += MICROSTEPS*4;
        this.currentstep %= MICROSTEPS*4;

        ocra = 0;
        ocrb = 0;

        if ( (this.currentstep >= 0) && (this.currentstep < MICROSTEPS)){
            ocra = __MICROSTEPCURVE[MICROSTEPS - this.currentstep];
            ocrb = __MICROSTEPCURVE[this.currentstep];
        } else if ( (this.currentstep >= MICROSTEPS) && (this.currentstep < MICROSTEPS*2)){
            ocra = __MICROSTEPCURVE[this.currentstep - MICROSTEPS];
            ocrb = __MICROSTEPCURVE[MICROSTEPS*2 - this.currentstep];
        } else if ( (this.currentstep >= MICROSTEPS*2) && (this.currentstep < MICROSTEPS*3)){
            ocra = __MICROSTEPCURVE[MICROSTEPS*3 - this.currentstep];
            ocrb = __MICROSTEPCURVE[this.currentstep - MICROSTEPS*2];
        } else if ( (this.currentstep >= MICROSTEPS*3) && (this.currentstep < MICROSTEPS*4)){
            ocra = __MICROSTEPCURVE[this.currentstep - MICROSTEPS*3];
            ocrb = __MICROSTEPCURVE[MICROSTEPS*4 - this.currentstep];
        }
    }

    this.currentstep += MICROSTEPS*4;
    this.currentstep %= MICROSTEPS*4;

    // release all
    var latch_state = 0; // all motor pins to 0

    if (style == this.MICROSTEP){
        if ((this.currentstep >= 0) && (this.currentstep < MICROSTEPS)){
            latch_state |= 0x03;
        }
        if ((this.currentstep >= MICROSTEPS) && (this.currentstep < MICROSTEPS*2)){
            latch_state |= 0x06;
        }
        if ((this.currentstep >= MICROSTEPS*2) && (this.currentstep < MICROSTEPS*3)){
            latch_state |= 0x0C;
        }
        if ((this.currentstep >= MICROSTEPS*3) && (this.currentstep < MICROSTEPS*4)){
            latch_state |= 0x09;
        }
    } else {
        var switchValue = (this.currentstep/(MICROSTEPS/2));
        if (switchValue == 0){
            latch_state |= 0x1; // energize coil 1 only
        } else if ( switchValue ==  1){
            latch_state |= 0x3; // energize coil 1+2
        } else if ( switchValue ==  2){
            latch_state |= 0x2; // energize coil 2 only
        } else if ( switchValue ==  3){
            latch_state |= 0x6; // energize coil 2+3
        } else if ( switchValue ==  4){
            latch_state |= 0x4; // energize coil 3 only
        } else if ( switchValue ==  5){
            latch_state |= 0xC; // energize coil 3+4
        } else if ( switchValue ==  6){
            latch_state |= 0x8; // energize coil 4 only
        } else if ( switchValue ==  7){
            latch_state |= 0x9; // energize coil 1+4
        }
    }

    this.MC.setPWM(this.PWMApin, ocra*16);
    this.MC.setPWM(this.PWMBpin, ocrb*16);
    if (latch_state & 0x1){
        this.MC.setPin(this.AIN2pin, HIGH);
    } else {
        this.MC.setPin(this.AIN2pin, LOW);
    }
    if (latch_state & 0x2){
        this.MC.setPin(this.BIN1pin, HIGH);
    } else {
        this.MC.setPin(this.BIN1pin, LOW);
    }
    if (latch_state & 0x4){
        this.MC.setPin(this.AIN1pin, HIGH);
    } else {
        this.MC.setPin(this.AIN1pin, LOW);
    }
    if (latch_state & 0x8){
        this.MC.setPin(this.BIN2pin, HIGH);
    } else {
        this.MC.setPin(this.BIN2pin, LOW);
    }
    return this.currentstep
};

StepperMotor.FORWARD = FORWARD;
StepperMotor.BACKWARD = BACKWARD;
StepperMotor.RELEASE = RELEASE;

StepperMotor.SINGLE = SINGLE;
StepperMotor.DOUBLE = DOUBLE;
StepperMotor.INTERLEAVE = INTERLEAVE;
StepperMotor.MICROSTEP = MICROSTEP;

// export the class
module.exports = StepperMotor;