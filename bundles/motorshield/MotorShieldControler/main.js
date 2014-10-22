
var PythonShell = require('python-shell');
var express = require('express');

var app = express();

/*
var pyshell = new PythonShell('/home/pi/MotorShieldControler/ventilation_controler_rpisoc.py', getPythonOption("btn"));
pyshell.on('message', function (message) {
    // received a message sent from the Python script (a simple "print" statement)
    console.log(message);
});

// end the input stream and allow the process to exit
pyshell.end(function (err) {
    if (err) throw err;
    console.log('finished');
});*/


function serveCommand(req, res){

    if (req.params.shieldID !== "0x" + parseInt(req.params.shieldID, 16).toString(16)  ){
        res.status(404).send("Bad shieldID");
        return;
    }
    if (req.params.motorID !== "1" && req.params.motorID !== "2"){
        res.status(404).send("Bad motorID");
        return;
    }
    if (req.params.stepMode !== "SINGLE" && req.params.stepMode !== "DOUBLE" && req.params.stepMode !== "INTERLEAVE" && req.params.stepMode !== "MICROSTEP"){
        res.status(404).send("Bad stepMode");
        return;
    }
    if (req.params.direction !== "FORWARD" && req.params.direction !== "BACKWARD" ){
        res.status(404).send("Bad stepMode");
        return;
    }
    if (req.params.speed !== parseInt(req.params.speed, 10).toString()  ){
        res.status(404).send("Bad speed");
        return;
    }if (req.params.step !== parseInt(req.params.step, 10).toString()  ){
        res.status(404).send("Bad step");
        return;
    }

    var options = {
        mode: 'text',
        pythonPath: '/usr/bin/python',
        pythonOptions: ['-u'],
        scriptPath: __dirname,
        args: [req.params.shieldID, req.params.motorID, req.params.stepMode, req.params.direction, req.params.speed, req.params.step]
    };

    PythonShell.run('MotorShieldCommand.py', options, function (err, results) {
        if (err) {
            console.error(err);
            res.status(404).send(err);
            return;
        }
        // results is an array consisting of messages collected during execution
        var result = "N/A";
        if (results && results.length > 0){
            result = results[0];
        }
        res.send(result);
    });
}

function serveExemples(req, res){
    res.setHeader("Content-Type", "text/plain");
    res.write("Exemples:\n");
    res.write("/sm/:shieldID/:motorID/:stepMode/:direction/:speed/:step\n");
    res.write("\n");
    res.write("shieldID = [0x60 | 0x61]\n");
    res.write("motorID = [1 | 2]\n");
    res.write("stepMode = [SINGLE | DOUBLE | INTERLEAVE | MICROSTEP]\n");
    res.write("direction = [FORWARD | BACKWARD ]\n");
    res.write("speed = integer \n");
    res.write("step = integer \n");
    res.write("\n");
    res.write("http://192.168.0.171/sm/0x60/1/DOUBLE/FORWARD/10/200\n");
    res.write("http://192.168.0.171/sm/0x60/1/DOUBLE/BACKWARD/10/100\n");
    res.end();
}

app.get('', serveExemples);
app.get('/sm/:shieldID/:motorID/:stepMode/:direction/:speed/:step', serveCommand);

var server = app.listen(80, function() {
    console.log('Listening on port %d', server.address().port);
});