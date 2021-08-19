import { Router } from '@lykmapipo/express-router-extra';

const router = new Router({ version: '1.0.0' });

// local values
const contacts = [{ email: 'a@z.com' }, { email: 'b@z.com' }];

router.get('/contacts.:ext?', (request, response) => {
  response.json(contacts);
});

module.exports = router;
