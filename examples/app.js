'use strict';


//dependencies
const path = require('path');
const app = require(path.join(__dirname, '..'));

//mount routers
app.mount('./routers/v1', './routers/v2');

//start app
app.start(function onStart(error, env) {
  console.log(`visit http://0.0.0.0:${env.PORT}/v1/contacts`);
  console.log('or')
  console.log(`visit http://0.0.0.0:${env.PORT}/v2/contacts`);
});