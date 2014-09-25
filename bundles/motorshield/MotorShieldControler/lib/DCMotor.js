
var async = require('async');

var FORWARD = 1;
var BACKWARD = 2;
var RELEASE = 4;

var LOW = 0;
var HIGH = 1;

// Constructor
var DCMotor = function (MC, PWMpin, IN2pin, IN1pin) {
    this.MC = MC;
    this.PWMpin = PWMpin;
    this.IN1pin = IN2pin;
    this.IN2pin = IN1pin;
}

DCMotor.prototype.setSpeed = function(speed, callback) {
    this.MC.setPWM(this.PWMpin, speed*16, callback)
};

DCMotor.prototype.run = function(cmd, callback) {
    var that = this;
    if (cmd === FORWARD) {
        async.series([function(cb){
            that.MC.setPin(that.IN2pin, LOW, cb);  // take low first to avoid 'break'
        }, function(cb){
            that.MC.setPin(that.IN1pin, HIGH, cb);
        }],callback);
    } else if (cmd === BACKWARD) {
        async.series([function(cb){
            that.MC.setPin(that.IN1pin, LOW, cb);  // take low first to avoid 'break'
        }, function(cb){
            that.MC.setPin(that.IN2pin, HIGH, cb);
        }],callback);
    } else if (cmd === RELEASE) {
        async.series([function(cb){
            that.MC.setPin(that.IN1pin, LOW, cb);
        }, function(cb){
            that.MC.setPin(that.IN2pin, LOW, cb);
        }],callback);
    } else {
        throw new Error('Invalide commande : ' + cmd);
    }
};

DCMotor.FORWARD = FORWARD;
DCMotor.BACKWARD = BACKWARD;
DCMotor.RELEASE = RELEASE;

// export the class
module.exports = DCMotor;