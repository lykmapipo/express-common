'use strict';


//dependencies
const express = require('express');
const router = express.Router();
const contacts = [
  { email: 'a@z.com', mobile: '255716909808' },
  { email: 'b@z.com', mobile: '255719669898' }
];

router.get('/contacts\.:ext?', function (request, response) {
  response.json(contacts);
});


module.exports = router;