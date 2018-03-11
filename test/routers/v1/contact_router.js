'use strict';


//dependencies
const path = require('path');
const app = require(path.join('..', '..', '..'));
const router = app.Router({ version: '1.0.0' });
const contacts = [{ email: 'a@z.com' }, { email: 'b@z.com' }];

router.get('/contacts\.:ext?', function (request, response) {
  response.json(contacts);
});


module.exports = router;