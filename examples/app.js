'use strict';


//dependencies
const https = require('https');
// const app = require('@lykmapipo/express-common');
const app = require('../');

//...load additional middlewares before your routers

//...inialize & setup other app parts

//load app routers
const routers = app.loadRouters();
// app.setup();
console.log(routers);


//prepare server
// const options = {
//   key: fs.readFileSync('./server.key'),
//   cert: fs.readFileSync('./server.crt')
// };
// const server = https.createServer(options, app);
// server.listen(3000);