// dependencies
import app from '../../../src/index';

const router = app.Router({ version: '2.0.0' });
const contacts = [
  { email: 'a@z.com', mobile: '255716909808' },
  { email: 'b@z.com', mobile: '255719669898' },
];

router.get('/contacts.:ext?', (request, response) => {
  response.json(contacts);
});

module.exports = router;
