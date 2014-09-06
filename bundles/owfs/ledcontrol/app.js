
var express = require("express");
var gpio = require('rpi-gpio');
gpio.setMode(gpio.MODE_BCM);

var LED_GPIO = 18;

function closeGPIO(done){
	gpio.write(LED_GPIO, false, function(){
		gpio.destroy(function() {
			console.log('All pins unexported');
			done();
		});
	});
}

process.on( 'SIGINT', function() {
	console.log( "\nGracefully shutting down from SIGINT (Ctrl-C)" );
	closeGPIO(function(){
		process.exit( );
	});
});
process.on( 'SIGTERM', function() {
	console.log( "\nGracefully shutting down from SIGTERM (Ctrl-C)" );
	closeGPIO(function(){
		process.exit( );
	});
});

process.on('exit', function(code) {
	console.log('About to exit with code:', code);
});

var ledState = 'OFF';
var ledControl = function(req, res){
	if (req.query.status === 'ON' && ledState !== 'ON') {
		// Open led
		gpio.write(LED_GPIO, true);
		ledState = req.query.status;
	} else if (req.query.status === 'OFF' && ledState !== 'OFF') {
		// Close led
		gpio.write(LED_GPIO, false);
		ledState = req.query.status;
	}	
	res.send('Led state is: ' + ledState);
};

var app = express();
app.get('/ledcontrol', ledControl);
app.post('/ledcontrol', ledControl);

var server = app.listen(3000, function() {
	gpio.setup(LED_GPIO, gpio.DIR_OUT, function(){
		console.log('Listening on port %d', server.address().port);
		console.log('  Led on gpio %d', LED_GPIO);
	});
});