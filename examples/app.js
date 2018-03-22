'use strict';


//dependencies
const app = require('@lykmapipo/express-common');

//...setup database & model

app.setup({ cwd: __dirname });

// ...additional setup

//...setup error handler
// app.handleError();

//start serve & handle request
app.serve();