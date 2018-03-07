'use strict';


//dependencies
const express = require('express');
const router = express.Router();
const contacts = [{ email: 'a@z.com' }, { email: 'b@z.com' }];

router.get('/contacts\.:ext?', function (request, response) {
  response.json(contacts);
});


module.exports = router;