
var i2c = require('i2c');
var async = require('async');
var sleep = require('sleep');

// Registers/etc.
var __MODE1              = 0x00;
var __SUBADR1            = 0x02;
var __SUBADR2            = 0x03;
var __SUBADR3            = 0x04;
var __PRESCALE           = 0xFE;
var __LED0_ON_L          = 0x06;
var __LED0_ON_H          = 0x07;
var __LED0_OFF_L         = 0x08;
var __LED0_OFF_H         = 0x09;
var __ALL_LED_ON_L       = 0xFA;
var __ALL_LED_ON_H       = 0xFB;
var __ALL_LED_OFF_L      = 0xFC;
var __ALL_LED_OFF_H      = 0xFD;

// Bits;
var __RESTART            = 0x80;
var __SLEEP              = 0x10;
var __ALLCALL            = 0x01;
var __INVRT              = 0x10;
var __OUTDRV             = 0x04;

// Constructor
function PWMServoDriver(address) {
    address = address || 0x40;
    this.i2c = new i2c(address, {
        device: '/dev/i2c-1',
        debug: false
    });
    this.address = address;
}

PWMServoDriver.prototype.begin = function(callback) {
    this.reset(callback);
};

PWMServoDriver.prototype.reset = function(callback) {
    this.i2c.writeBytes(__MODE1, [0x0], callback);
};

PWMServoDriver.prototype.setPWMFreq = function(freq, callback) {
    var that = this;
    var prescaleval = 25000000.0;    // 25MHz
    prescaleval /= 4096.0;       // 12-bit
    prescaleval /= freq;
    prescaleval -= 1.0;
    var prescale = parseInt(Math.floor(prescaleval + 0.5));
    var oldmode;

    async.waterfall([function(cb){
        that.i2c.readBytes(__MODE1, 1, cb);
    }, function(res, cb){
        oldmode = res;
        var newmode = (oldmode & 0x7F) | 0x10;   // sleep
        that.i2c.writeBytes(__MODE1, [newmode], cb); // go to sleep
    }, function(cb){
        that.i2c.writeBytes(__PRESCALE, [prescale], cb);
    }, function(cb){
        that.i2c.writeBytes(__MODE1, [oldmode], cb);
    }, function(cb){
        //setTimeout(cb, 5);
        sleep.usleep(5000); // 5000 microseconds 5 milisecond
        cb();
    }, function(cb){
        that.i2c.writeBytes(__MODE1, [oldmode | 0x80 ], cb);
    }], callback);
};

// Sets a single PWM channel
PWMServoDriver.prototype.setPWM = function(channel, on, off, callback) {
    var that = this;
    async.series([function(cb){
        that.i2c.writeBytes(__LED0_ON_L+4*channel, [ on & 0xFF ], cb);
    },function(cb){
        that.i2c.writeBytes(__LED0_ON_H+4*channel, [ on >> 8], cb);
    },function(cb){
        that.i2c.writeBytes(__LED0_OFF_L+4*channel,[ off & 0xFF], cb);
    },function(cb){
        that.i2c.writeBytes(__LED0_OFF_H+4*channel,[ off >> 8], cb);
    }],callback);
};

// Sets a all PWM channels
PWMServoDriver.prototype.setAllPWM = function(on, off, callback) {
    var that = this;
    async.series([function(cb){
        that.i2c.writeBytes(__ALL_LED_ON_L, [ on & 0xFF ], cb);
    },function(cb){
        that.i2c.writeBytes(__ALL_LED_ON_H, [ on >> 8], cb);
    },function(cb){
        that.i2c.writeBytes(__ALL_LED_OFF_L,[ off & 0xFF], cb);
    },function(cb){
        that.i2c.writeBytes(__ALL_LED_OFF_H,[ off >> 8], cb);
    }],callback);
};

// export the class
module.exports = PWMServoDriver;