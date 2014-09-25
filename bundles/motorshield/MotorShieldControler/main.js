
var async = require('async');

var MotorShield = require("./lib/MotorShield");
var StepperMotor = require("./lib/StepperMotor");

var motorShield = new MotorShield();

// Connect a stepper motor with 200 steps per revolution (1.8 degree)
// to motor port #2 (M3 and M4)
var myMotor = motorShield.getStepper(200, 1)

async.series([
    function(cb){
        motorShield.begin(cb);
    },function(cb) {
        myMotor.setSpeed(10);  // 10 rpm
        console.log("Single coil steps");
        myMotor.step(100, StepperMotor.FORWARD, StepperMotor.SINGLE, cb);
    }, function(cb){
        myMotor.step(100, StepperMotor.BACKWARD, StepperMotor.SINGLE, cb);
    }, function(cb){
        console.log("Double coil steps");
        myMotor.step(100, StepperMotor.FORWARD, StepperMotor.DOUBLE, cb);
    }, function(cb){
        myMotor.step(100, StepperMotor.BACKWARD, StepperMotor.DOUBLE, cb)
    }, function(cb){
        console.log("Interleave coil steps");
        myMotor.step(100, StepperMotor.FORWARD, StepperMotor.INTERLEAVE, cb);
    }, function(cb){
        myMotor.step(100, StepperMotor.BACKWARD, StepperMotor.INTERLEAVE, cb);
    }, function(cb){
        console.log("Microstep steps");
        myMotor.step(50, StepperMotor.FORWARD, StepperMotor.MICROSTEP, cb);
    }, function(cb){
        myMotor.step(50, StepperMotor.BACKWARD, StepperMotor.MICROSTEP, cb);
    }, function(cb){
        myMotor.release(cb)
    }
], function(err){
    if(err){
        console.error(err);
    }
    console.log("End ...");
});


