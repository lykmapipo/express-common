'use strict';


//dependencies
const path = require('path');
const mount = require('@lykmapipo/express-router-extra').mount;
const app = require(path.join(__dirname, '..'));

//mount routers
mount('./routers/v1', './routers/v2').into(app);

app.handleNotFound();
app.handleErrors();

console.log(app.mount);

// app.listen(app.get('port') || process.env.PORT || 5000);