
var async = require('async');
var sleep = require('sleep');

var MotorShield = require("../lib/MotorShield");
var DCMotor = require("../lib/DCMotor");

var motorShield = new MotorShield();

// Select which 'port' M1, M2, M3 or M4. In this case, M1
var myMotor = motorShield.getMotor(4);

async.series([
    function(cb){
        motorShield.begin(cb);
    },function(cb) {
        myMotor.setSpeed(150);  // 10 rpm
        myMotor.run(DCMotor.FORWARD);
        // turn on motor
        myMotor.run(DCMotor.RELEASE);

        console.log("tick");

        myMotor.run(DCMotor.FORWARD);

        for(var speed = 0;speed<255;++speed){
            myMotor.setSpeed(speed);
            sleep.usleep(10000); // 10000 microseconds 10 milisecond
        }

        for(var speed = 254;speed>-1;--speed){
            myMotor.setSpeed(speed);
            sleep.usleep(10000); // 10000 microseconds 10 milisecond
        }

        console.log("tock");
        myMotor.run(DCMotor.BACKWARD);

        for(var speed = 0;speed<255;++speed){
            myMotor.setSpeed(speed);
            sleep.usleep(10000); // 10000 microseconds 10 milisecond
        }

        for(var speed = 254;speed>-1;--speed){
            myMotor.setSpeed(speed);
            sleep.usleep(10000); // 10000 microseconds 10 milisecond
        }

        console.log("tech");
        myMotor.run(DCMotor.RELEASE);

        cb();
    }

], function(err){
    if(err){
        console.error(err);
    }
    console.log("End ...");
});


