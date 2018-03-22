'use strict';


//dependencies
const path = require('path');
// const app = require('@lykmapipo/express-common');
const app = require(path.join(__dirname, '..'));

//...setup database & model

app.setup({ cwd: __dirname });

// ...additional setup

//...setup error handler
// app.handleError();

//start serve & handle request
app.listen(app.get('port') || process.env.PORT || 5000);