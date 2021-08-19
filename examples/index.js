import { mount, start } from '../src';

// mount routers
import v1 from './routers/v1/router';
import v2 from './routers/v2/router';

mount(v1, v2);

// start app
start((error, env) => {
  console.log(`visit http://0.0.0.0:${env.PORT}/v1/contacts`);
  console.log('or');
  console.log(`visit http://0.0.0.0:${env.PORT}/v2/contacts`);
});
