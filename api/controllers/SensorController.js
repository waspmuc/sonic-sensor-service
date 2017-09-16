'use strict';
/*
 'use strict' is not required but helpful for turning syntactical errors into true errors in the program flow
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
 */

/*
 Modules make it possible to import JavaScript files into your application.  Modules are imported
 using 'require' statements that give you a reference to the module.

 It is a good idea to list the modules that your application depends on in the package.json in the project root
 */
var util = require('util');

/* Add sonic sensor module */
var GrovePi = require('node-grovepi').GrovePi

var sleep = require('sleep');

/* Add base classes */
var Commands = GrovePi.commands
var Board = GrovePi.board

/* Access sonic sensor module */
var UltrasonicDigitalSensor = GrovePi.sensors.UltrasonicDigital
var init = false;

/*
 Once you 'require' a module you can reference the things that it exports.  These are defined in module.exports.

 For a controller in a127 (which this is) you should export the functions referenced in your Swagger document by name.

 Either:
 - The HTTP Verb of the corresponding operation (get, put, post, delete, etc)
 - Or the operationId associated with the operation in your Swagger document

 In the starter/skeleton project the 'get' operation on the '/sensor' path has an operationId named 'sensor'.  Here,
 we specify that in the exports of this module that 'sensor' maps to the function named 'sensor'
 */
module.exports = {
    sensor: getSensorData
};

/*
 Functions in a127 controllers used for operations should take two parameters:

 Param 1: a handle to the request object
 Param 2: a handle to the response object
 */
var ultraSonicSensor1, ultraSonicSensor2, ultraSonicSensor3, ultraSonicSensor4;
var sensor1, sensor2, sensor3, sensor4;

var board = new Board({
    debug: true,
    onError: function (err) {
        console.log('Something wrong just happened')
        console.log(err)
    },
    onInit: function (response) {
        if (response) {
            console.log('GrovePi Version :: ' + board.version());
            ultraSonicSensor1 = new UltrasonicDigitalSensor(2);
            ultraSonicSensor2 = new UltrasonicDigitalSensor(3);
            ultraSonicSensor3 = new UltrasonicDigitalSensor(4);
            ultraSonicSensor4 = new UltrasonicDigitalSensor(8);

            //currently not working, due to blocking access. @Michael Kirsch
            // ultraSonicSensor1.on('change', function (res) {
            //     if(res > sensor1*1.10 || res < sensor1*0.9) //Interval
            //         console.log("Sensor1 changed " + res);
            //         sensor1 = res;
            // });
            //
            // ultraSonicSensor2.on('change', function (res) {
            //     console.log("Sensor2 changed " +  res);
            //     sensor2 = res;
            // });
            //
            // ultraSonicSensor3.on('change', function (res) {
            //     console.log("Sensor3 changed " +  res);
            //     sensor3 = res;
            // });
            //
            // ultraSonicSensor4.on('change', function (res) {
            //     console.log("Sensor4 changed " +  res);
            //     sensor4 = res;
            // });

            // ultraSonicSensor1.watch();
            // ultraSonicSensor2.watch();
            // ultraSonicSensor3.watch();
            // ultraSonicSensor4.watch();

            console.log("Sensors configured.")
        }
    }
});

board.init();

setInterval(function () {
    console.log("Accessing sensors.")
    sensor1 = Math.round(ultraSonicSensor1.read());
    sleep.msleep(1000);
    sensor2 = Math.round(ultraSonicSensor2.read());
    sleep.msleep(1000);
    sensor3 = Math.round(ultraSonicSensor3.read());
    sleep.msleep(1000);
    sensor4 = Math.round(ultraSonicSensor4.read());
}, 1000);

function getSensorData(req, res) {

    var dataStr = [{
        "sonicsensor1": sensor1,
        "sonicsensor2": sensor2,
        "sonicsensor3": sensor3,
        "sonicsensor4": sensor4
    }];
    console.log(dataStr);
    res.json(dataStr)
}
