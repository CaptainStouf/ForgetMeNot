
var async = require('async');

var FORWARD = 1;
var BACKWARD = 2;
var RELEASE = 4;

var LOW = 0;
var HIGH = 1;

function errorHandler(err){
    if (err){
        throw err;
    }
}

// Constructor
var DCMotor = function (MC, PWMpin, IN2pin, IN1pin) {
    this.MC = MC;
    this.PWMpin = PWMpin;
    this.IN1pin = IN2pin;
    this.IN2pin = IN1pin;
}

DCMotor.prototype.setSpeed = function(speed) {
    this.MC.setPWM(this.PWMpin, speed*16)
};

DCMotor.prototype.run = function(cmd) {
    if (cmd === FORWARD) {
        this.MC.setPin(this.IN2pin, LOW, errorHandler);  // take low first to avoid 'break'
        this.MC.setPin(this.IN1pin, HIGH, errorHandler);
    } else if (cmd === BACKWARD) {
        this.MC.setPin(this.IN1pin, LOW, errorHandler);  // take low first to avoid 'break'
        this.MC.setPin(this.IN2pin, HIGH, errorHandler);
    } else if (cmd === RELEASE) {
        this.MC.setPin(this.IN1pin, LOW, errorHandler);
        this.MC.setPin(this.IN2pin, LOW, errorHandler);
    } else {
        throw new Error('Invalide commande : ' + cmd);
    }
};

DCMotor.FORWARD = FORWARD;
DCMotor.BACKWARD = BACKWARD;
DCMotor.RELEASE = RELEASE;

// export the class
module.exports = DCMotor;