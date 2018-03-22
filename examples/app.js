'use strict';


//dependencies
const path = require('path');
const mount = require('@lykmapipo/express-router-extra').mount;
const app = require(path.join(__dirname, '..'));

//...setup database & model

//load routers
mount('./routers/v1', './routers/v2').into(app);

// ...additional setup

//...setup error handler
// app.handleError();

//start serve & handle request
app.listen(app.get('port') || process.env.PORT || 5000);