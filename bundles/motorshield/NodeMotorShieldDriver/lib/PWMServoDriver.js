
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

function errorHandler(err){
    if (err){
        throw err;
    }
}

// Constructor
function PWMServoDriver(address) {
    address = address || 0x40;
    this.i2c = new i2c(address, {
        device: '/dev/i2c-1',
        debug: false
    });
    this.address = address;
}

PWMServoDriver.prototype.begin = function() {
    this.reset();
};

PWMServoDriver.prototype.reset = function() {
    this.i2c.writeBytes(__MODE1, [0x0], errorHandler);
};

PWMServoDriver.prototype.setPWMFreq = function(freq, callback) {
    var that = this;
    var prescaleval = 25000000.0;    // 25MHz
    prescaleval /= 4096.0;       // 12-bit
    prescaleval /= freq;
    prescaleval -= 1.0;
    var prescale = parseInt(Math.floor(prescaleval + 0.5));

    async.waterfall([function(cb){
        that.i2c.readBytes(__MODE1, 1, cb);
    }, function(res, cb){
        var oldmode = res;
        var newmode = (oldmode & 0x7F) | 0x10;   // sleep
        that.i2c.writeBytes(__MODE1, [newmode], errorHandler); // go to sleep
        that.i2c.writeBytes(__PRESCALE, [prescale], errorHandler);
        that.i2c.writeBytes(__MODE1, [oldmode], errorHandler);
        sleep.usleep(5000); // 5000 microseconds 5 milisecond
        that.i2c.writeBytes(__MODE1, [oldmode | 0x80 ], errorHandler);
        cb();
    }], callback);
};

// Sets a single PWM channel
PWMServoDriver.prototype.setPWM = function(channel, on, off) {
    this.i2c.writeBytes(__LED0_ON_L+4*channel, [ on & 0xFF ], errorHandler);
    this.i2c.writeBytes(__LED0_ON_H+4*channel, [ on >> 8], errorHandler);
    this.i2c.writeBytes(__LED0_OFF_L+4*channel,[ off & 0xFF], errorHandler);
    this.i2c.writeBytes(__LED0_OFF_H+4*channel,[ off >> 8], errorHandler);
};

// Sets a all PWM channels
PWMServoDriver.prototype.setAllPWM = function(on, off) {
    this.i2c.writeBytes(__ALL_LED_ON_L, [ on & 0xFF ], errorHandler);
    this.i2c.writeBytes(__ALL_LED_ON_H, [ on >> 8], errorHandler);
    this.i2c.writeBytes(__ALL_LED_OFF_L,[ off & 0xFF], errorHandler);
    this.i2c.writeBytes(__ALL_LED_OFF_H,[ off >> 8], errorHandler);
};

// export the class
module.exports = PWMServoDriver;