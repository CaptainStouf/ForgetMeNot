
var async = require('async');

var MotorShield = require("../lib/MotorShield");
var DCMotor = require("../lib/DCMotor");

var motorShield = new MotorShield();

// Select which 'port' M1, M2, M3 or M4. In this case, M1
var myMotor = motorShield.getMotor(4);

async.series([
    function(cb){
        motorShield.begin(cb);
    },function(cb) {
        myMotor.setSpeed(150, cb);  // 10 rpm
    },function(cb){
        myMotor.run(DCMotor.FORWARD, cb);
    }, function(cb){
        // turn on motor
        myMotor.run(DCMotor.RELEASE, cb);
    }, function(cb){

        console.log("tick");

        myMotor.run(DCMotor.FORWARD);

        var speed = 0;
        async.whilst(
            function () {
                return speed < 255;
            },
            function (cb2) {
                myMotor.setSpeed(speed, function(){
                    ++speed;
                    setTimeout(cb2, 10);
                });
            },cb
        );

    }, function(cb){
        var speed = 254;
        async.whilst(
            function () {
                return speed > -1;
            },
            function (cb2) {
                myMotor.setSpeed(speed, function(){
                    --speed;
                    setTimeout(cb2, 10);
                });
            },cb
        );
    }, function(cb){
        console.log("tock");
        myMotor.run(DCMotor.BACKWARD);

        var speed = 0;
        async.whilst(
            function () {
                return speed < 255;
            },
            function (cb2) {
                myMotor.setSpeed(speed, function(){
                    ++speed;
                    setTimeout(cb2, 10);
                });
            },cb
        );

    }, function(cb){
        var speed = 254;
        async.whilst(
            function () {
                return speed > -1;
            },
            function (cb2) {
                myMotor.setSpeed(speed, function(){
                    --speed;
                    setTimeout(cb2, 10);
                });
            },cb
        );
    }, function(cb){
        console.log("tech");
        myMotor.run(DCMotor.RELEASE, function(){
            setTimeout(cb, 1000);
        });
    }

], function(err){
    if(err){
        console.error(err);
    }
    console.log("End ...");
});


