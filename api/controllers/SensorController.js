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
var GrovePi = require('node-grovepi').GrovePi;

var sleep = require('sleep');

/* Add base classes */
var Commands = GrovePi.commands;
var Board = GrovePi.board;

/* Access sonic sensor module */
var UltrasonicDigitalSensor = GrovePi.sensors.UltrasonicDigital;

/*
Use external config
 */
const req = require('require-yml');
const envConfig = req('./config.yml');

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
var ultraSonicSensor;
var occupied, distance;
var board = new Board({
    debug: true,
    onError: function (err) {
        console.log('Something wrong just happened while initializing the sensor');
        console.log(err)
    },
    onInit: function (response) {
        if (response) {
            console.log('GrovePi Version :: ' + board.version());
            ultraSonicSensor = new UltrasonicDigitalSensor(envConfig.application.port);
            occupied = false;

            ultraSonicSensor.stream(50, function (data) {
                if (data > 30 && data < 90) {
                    occupied = true;
                    distance = data;
                    console.log("Distance is " + distance + ", thus occupied is " + occupied);
                }
                else if (data < 180 && data > 20) {
                    occupied = false;
                    distance = data;
                    console.log("Distance is " + distance + ", thus occupied is " + occupied);
                }

            });
            console.log("Sensors configured.")
        }
    }
});


board.init();

function getSensorData(req, res) {

    var dataStr =[{"name": envConfig.application.sensorName, "occupied": occupied, "distance": distance}];
    console.log(dataStr);
    res.json(dataStr);
    res.end();
}
