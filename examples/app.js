'use strict';


//dependencies
const path = require('path');
const { mount, start } = require(path.join(__dirname, '..', 'lib'));

//mount routers
const v1 = require(path.join(__dirname, 'routers', 'v1', 'router'));
const v2 = require(path.join(__dirname, 'routers', 'v2', 'router'));
mount(v1, v2);

//start app
start((error, env) => {
  console.log(`visit http://0.0.0.0:${env.PORT}/v1/contacts`);
  console.log('or')
  console.log(`visit http://0.0.0.0:${env.PORT}/v2/contacts`);
});
