'use strict';


const SwaggerExpress = require('swagger-express-mw');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const app = require('express')();
const req = require('require-yml')
const envConfig = req('./config.yml')
module.exports = app; // for testing

var config = {
  appRoot: __dirname // required config
};

app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);

  console.log("Config is " + envConfig.application.port);
  var port = envConfig.application.port || 10010;
  app.listen(port, function(){
    console.log("Sonic-Sensor-Service is now running at 127.0.0.1:" + port)
    });
});
