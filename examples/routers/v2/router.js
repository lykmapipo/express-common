import { Router } from '@lykmapipo/express-router-extra';

const router = Router({ version: '2.0.0' });

// local values
const contacts = [
  { email: 'a@z.com', mobile: '255716909808' },
  { email: 'b@z.com', mobile: '255719669898' },
];

router.get('/contacts.:ext?', (request, response) => {
  response.json(contacts);
});

module.exports = router;
