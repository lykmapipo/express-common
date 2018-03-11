'use strict';


//dependencies
const router = require('@lykmapipo/express-common').Router({ version: '1.0.0' });
const contacts = [{ email: 'a@z.com' }, { email: 'b@z.com' }];

router.get('/contacts\.:ext?', function (request, response) {
  response.json(contacts);
});


module.exports = router;