'use strict';


//dependencies
const Router = require('@lykmapipo/express-router-extra').Router;
const router = new Router({ version: '1.0.0' });

//local values
const contacts = [{ email: 'a@z.com' }, { email: 'b@z.com' }];

router.get('/contacts\.:ext?', function (request, response) {
  response.json(contacts);
});


module.exports = router;