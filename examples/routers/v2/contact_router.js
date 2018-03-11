'use strict';


//dependencies
const router = require('@lykmapipo/express-common').Router({ version: '2.0.0' });
const contacts = [
  { email: 'a@z.com', mobile: '255716909808' },
  { email: 'b@z.com', mobile: '255719669898' }
];

router.get('/contacts\.:ext?', function (request, response) {
  response.json(contacts);
});

module.exports = router;