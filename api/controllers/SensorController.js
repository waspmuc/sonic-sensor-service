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
var UltrasonicDigitalSensor = GrovePi.sensors.UltrasonicDigital;
var init = false;

const req = require('require-yml')
const envConfig = req('./config.yml')

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
            //ultraSonicSensor1 = new UltrasonicDigitalSensor(2);
            ultraSonicSensor1 = new UltrasonicDigitalSensor(envConfig.application.port);
            // ultraSonicSensor2 = new UltrasonicDigitalSensor(3);
            // ultraSonicSensor3 = new UltrasonicDigitalSensor(4);
            // ultraSonicSensor4 = new UltrasonicDigitalSensor(8);

            // currently not working, due to blocking access. @Michael Kirsch
            // ultraSonicSensor1.on('change', function (res) {
            //     //if (res > sensor1 * 1.10 || res < sensor1 * 0.9) { //Interval
            //
            //         if (res < 230 && res != sensor1 && res != false){
            //             console.log("Sensor1 changed " + res);
            //             sensor1 = res;
            //         }
            //     //}
            // });

            sensor1 = false;

            data1 = -1;


            ultraSonicSensor1.stream(50, function (data) {
                data1 = data;
                if (data > 30 && data < 90) {
                    sensor1 = true;
                    console.log("Sensor 1 is " + data1 + ", thus it's" + sensor1);
                }
                else if (data < 180 && data > 20) {
                    sensor1 = false;
                    console.log("Sensor 1 is " + data1 + ", thus it's" + sensor1);
                }

            });

            //ultraSonicSensor1.watch();

            console.log("Sensors configured.")
        }
    }
});


board.init();


function getSensorData(req, res) {

    var dataStr = {
        "sonicsensor": [{"occupied": sensor1}],
        "sonicsensor2": [{"occupied": null}],
        "sonicsensor3": [{"occupied": null}],
        "sonicsensor4": [{"occupied": null}]
    };
    console.log(dataStr);
    res.json(dataStr)
    res.end();
}
