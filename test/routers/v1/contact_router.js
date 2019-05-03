// dependencies
import app from '../../../src/index';

const router = app.Router({ version: '1.0.0' });
const contacts = [{ email: 'a@z.com' }, { email: 'b@z.com' }];

router.get('/contacts.:ext?', (request, response) => {
  response.json(contacts);
});

module.exports = router;
