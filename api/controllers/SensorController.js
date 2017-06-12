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

/* Add Hashmap functionality to JavaScript */
var HashMap = require('hashmap');

/* Add sonic sensor module */
var GrovePi = require('node-grovepi').GrovePi

/* Add base classes */
var Commands = GrovePi.commands
var Board = GrovePi.board

/* Access sonic sensor module */
var UltrasonicDigitalSensor = GrovePi.sensors.UltrasonicDigital

var init = false;

const sampleSize = 3;

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
var value
var ultraSonicSensor1, ultraSonicSensor2

function getSensorData(req, res) {

    var board = new Board({
        debug: true,
        onError: function(err) {
            console.log('Something wrong just happened')
            console.log(err)
        },
        onInit: function(response) {
            if (response) {
                console.log('GrovePi Version :: ' + board.version())
                ultraSonicSensor1 = new UltrasonicDigitalSensor(2)
                ultraSonicSensor2 = new UltrasonicDigitalSensor(3)

            }
        }
    })

   if(init == false){
       board.init();
       init = true;
   }


    var avgSensor1 = 0;
    var avgSensor2 = 0;

    for (var i = 0; i < sampleSize; i++) {
        avgSensor1 += ultraSonicSensor1.read()
        avgSensor2 += ultraSonicSensor2.read()
    }

    avgSensor1 = avgSensor1 / sampleSize
    avgSensor2 = avgSensor2 / sampleSize

    avgSensor1 = Math.round(avgSensor1)
    avgSensor2 = Math.round(avgSensor2)


    var dataStr = [{"sensor1" : avgSensor1, "sensor2" : avgSensor2}]

    res.json(dataStr)
}
