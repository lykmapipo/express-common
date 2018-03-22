'use strict';


//dependencies
const common = require('@lykmapipo/express-common');
const router = common.Router({ version: '1.0.0' });

//local values
const contacts = [{ email: 'a@z.com' }, { email: 'b@z.com' }];

router.get('/contacts\.:ext?', function (request, response) {
  response.json(contacts);
});


module.exports = router;