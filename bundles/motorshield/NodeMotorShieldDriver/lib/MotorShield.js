
var async = require('async');

var PWMServoDriver = require('./PWMServoDriver');
var DCMotor = require('./DCMotor');
var StepperMotor = require('./StepperMotor');

var LOW = 0;

// Constructor
function MotorShield(address) {
    address = address || 0x60;
    this.address = address;
    this.pwm = new PWMServoDriver(address);
    this.freq = null;

    this.steppers = [new StepperMotor(this, {
        pwma : 8,
        ain2 : 9,
        ain1 : 10,
        pwmb : 13,
        bin2 : 12,
        bin1 : 11
    }), new StepperMotor(this, {
        pwma : 2,
        ain2 : 3,
        ain1 : 4,
        pwmb : 7,
        bin2 : 6,
        bin1 : 5
        })];
    this.dcmotors = [new DCMotor(this, 8, 9, 10),
        new DCMotor(this, 13, 12, 11),
        new DCMotor(this, 2, 3, 4),
        new DCMotor(this, 7, 6, 5)];
}


MotorShield.prototype.begin = function(freq, callback) {
    if (arguments.length == 1){
        callback = freq;
        freq = 1600;
    }
    this.freq = freq;
    var that = this;
    async.series([function(cb){
        that.pwm.begin();
        that.pwm.setPWMFreq(freq, cb);  // This is the maximum PWM frequency
    }, function(cb){
        for (var i = 0;i<16;++i){
            that.pwm.setPWM(i, 0, 0);
        }
        cb();
    }] , callback);
};

MotorShield.prototype.setPWM = function(pin, value) {
    if (value > 4095){
        this.pwm.setPWM(pin, 4096, 0)
    } else {
        this.pwm.setPWM(pin, 0, value);
    }
};

MotorShield.prototype.setPin = function(pin, value) {
    if (value === LOW){
        this.pwm.setPWM(pin, 0, 0)
    } else {
        this.pwm.setPWM(pin, 4096, 0)
    }
};

MotorShield.prototype.getMotor = function(num) {
    if (num < 1 || num > 4){
        throw new Error('num should be 1,2,3 or 4');
    }
    return this.dcmotors[num-1];
};

MotorShield.prototype.getStepper = function(steps, num) {
    if (num < 1 || num > 2){
        throw new Error('num should be 1,2');
    }
    var stepper = this.steppers[num-1];
    stepper.revsteps = steps;
    return stepper;
};

// export the class
module.exports = MotorShield;