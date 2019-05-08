/**
 * @module express-common
 * @name express-common
 * @description minimal express app configuration
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since  0.1.0
 * @version 0.1.0
 * @example
 *
 * const { start } = require('@lykmapipo/express-common');
 * const app = start((error) => { ... });
 * //=> { [EventEmitter: app] ... }
 *
 */

/* dependencies */
import { getString, getBoolean, getNumber, isTest } from '@lykmapipo/env';
import { resolve as resolvePath } from 'path';
import _ from 'lodash';
import uuidv1 from 'uuid/v1';
import { mergeObjects } from '@lykmapipo/common';
import express from '@lykmapipo/express-request-extra';
import { mount as doMount, Router } from '@lykmapipo/express-router-extra';
import morgan from 'morgan';
import cors from 'cors';
import compression from 'compression';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import serveFavicon from 'serve-favicon';
import helmet from 'helmet';
import mquery from 'express-mquery';
import respond from 'express-respond';
import { stream } from '@lykmapipo/logger';

/**
 * @constant
 * @name NODE_ENV
 * @type {String}
 * @description setup and ensure process runtime environment
 * @default development
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since  0.1.0
 * @version 0.1.0
 * @example
 *
 * const NODE_ENV = process.env.NODE_ENV
 * //=> development
 *
 */
process.env.NODE_ENV = getString('NODE_ENV', 'development');

/**
 * @constant
 * @name BASE_PATH
 * @type {String}
 * @description setup and ensure process BASE_PATH
 * @default process.cwd()
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since  0.1.0
 * @version 0.1.0
 * @example
 *
 * const BASE_PATH = process.env.BASE_PATH
 * //=> /home/...
 *
 */
process.env.BASE_PATH = getString('BASE_PATH', process.cwd());

/**
 * @constant
 * @name APP_PATH
 * @type {String}
 * @description setup and ensure process APP_PATH
 * @default process.cwd()
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since  0.1.0
 * @version 0.1.0
 * @example
 *
 * const APP_PATH = process.env.APP_PATH
 * //=> /home/...
 *
 */
process.env.APP_PATH = resolvePath(
  process.env.BASE_PATH,
  process.env.APP_PATH || ''
);

/**
 * @function correlationId
 * @name correlationId
 * @description http middleware for ensure request id and correlation id are
 * available on request and response headers
 * @param {Request} request valid express request object
 * @param {Response} response valid express response object
 * @param {Function} next valid express next middlware to pass control to
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since 0.15.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * const { correlationId } = require('@lykmapipo/express-common');
 * app.use(correlationId);
 * //=> request.headers {'x-correlation-id': ..., 'x-request-id': ...}
 * //=> response._headers {'x-correlation-id': ..., 'x-request-id': ...}
 *
 */
export const correlationId = (request, response, next) => {
  // obtain passed request or correlation id
  let requestId =
    request.get('X-Request-Id') || request.get('X-Correlation-Id');

  // ensure requestId
  requestId = _.isEmpty(requestId) ? uuidv1() : requestId;

  // merge to request headers
  request.headers = mergeObjects(
    {
      'x-correlation-id': requestId,
      'x-request-id': requestId,
    },
    request.headers
  );

  // set response headers
  response.set('X-Correlation-Id', requestId);
  response.set('X-Request-Id', requestId);

  // continue
  next();
};

/**
 * @name notFound
 * @function notFound
 * @description http middleware to handle un matched routes
 * @param {Request} request valid express request object
 * @param {Response} response valid express response object
 * @param {Function} next valid express next middlware to pass control to
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since 0.15.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * const { notFound } = require('@lykmapipo/express-common');
 * app.use(notFound);
 *
 */
export const notFound = (request, response, next) => {
  // build not foound error
  const error = new Error('Not Found');
  error.status = 404;

  // continue
  next(error);
};

/**
 * @name errorHandler
 * @function errorHandler
 * @description http middleware to handle errors
 * @param {Request} request valid express request object
 * @param {Response} response valid express response object
 * @param {Function} next valid express next middlware to pass control to
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since 0.15.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * const { errorHandler } = require('@lykmapipo/express-common');
 * app.use(errorHandler);
 *
 */
// eslint-disable-next-line no-unused-vars
export const errorHandler = (error, request, response, next) => {
  // TODO log error using logger
  // reply with error
  response.error(error);
};

/**
 * @name Router
 * @function Router
 * @description factory to create express router with version
 * @param {Object} [optns] valid express router options plus its version
 * @param {String|Number} [optns.version=1] valid router version. default to 1
 * @returns {Router} valid express router
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since 0.15.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * const { mount, Router } = require('@lykmapipo/express-common');
 *
 * const router = new Router({ version: '1.0.0' });
 * router.get('/users', (req, res, next) => { ... });
 * mount(router);
 * //=> curl --request GET --url /v1/users
 *
 */
export { Router };

/**
 * @name app
 * @function app
 * @description express app with sensible defaults applied
 * @returns {Object} valid express application
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since 0.11.0
 * @version 0.1.0
 * @public
 * @example
 *
 * const { app, start } = require('@lykmapipo/express-common');
 * app.get('/v1/users', (req, res, next) => { });
 *
 * start((error) => { ... });
 * //=> curl --request GET --url /v1/users
 *
 */
export const app = express();

/**
 * @const
 * @name env
 * @type {String}
 * @default development
 * @description set express application environmnent
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since  0.1.0
 * @version 0.1.0
 * @example
 *
 * process.env.NODE_ENV=development
 *
 * app.set('env', getString('NODE_ENV'));
 * app.get('env')
 * //=> development
 *
 */
app.set('env', getString('NODE_ENV', 'development'));

/**
 * @const
 * @name port
 * @type {Number}
 * @default 5000
 * @description set express application port
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since  0.1.0
 * @version 0.1.0
 * @example
 *
 * process.env.PORT=5000
 *
 * app.set('port', getNumber('PORT', 5000));
 * app.get('port')
 * //=> 5000
 *
 */
app.set('port', getNumber('PORT', 5000));

/**
 * @const
 * @name trust proxy
 * @type {Boolean}
 * @default false
 * @description indicates the app is behind a front-facing proxy.
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since  0.16.0
 * @version 0.1.0
 * @example
 *
 * process.env.TRUST_PROXY=false
 *
 * app.set('trust proxy', getBoolean('TRUST_PROXY', false));
 *
 */
app.set('trust proxy', getBoolean('TRUST_PROXY', false));

/**
 * @descrition setup and use correlationId middleware
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since  0.14.0
 * @version 0.1.0
 * @example
 *
 * app.use(correlationId);
 *
 */
app.use(correlationId);

/**
 * @description setup and use morgan request log middleware
 * @see {@link https://github.com/expressjs/morgan}
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since  0.1.0
 * @version 0.1.0
 * @example
 *
 * process.env.LOGGER_LOG_ENABLED=true
 * process.env.LOGGER_LOG_HTTP_FORMAT=combined
 *
 * app.use(morgan(LOGGER_LOG_HTTP_FORMAT, { stream }));
 *
 */
const LOG_ENABLED = getBoolean('LOGGER_LOG_ENABLED', false) && !isTest();
if (LOG_ENABLED) {
  const LOG_FORMAT = getString('LOGGER_LOG_HTTP_FORMAT', 'combined');
  app.use(morgan(LOG_FORMAT, { stream }));
}

/**
 * @description setup and use cors middleware
 * @see {@link https://github.com/expressjs/cors}
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since  0.1.0
 * @version 0.1.0
 * @example
 *
 * app.use(cors());
 *
 */
app.use(cors());

/**
 * @description use compression middleware
 * @see {@link https://github.com/expressjs/compression}
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since  0.1.0
 * @version 0.1.0
 * @example
 *
 * app.use(compression());
 *
 */
app.use(compression());

/**
 * @description setup and use express.static middleware
 * @see {@link http://expressjs.com/en/starter/static-files.html}
 * @see {@link http://expressjs.com/en/4x/api.html#express.static}
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since  0.1.0
 * @version 0.1.0
 * @example
 *
 * process.env.SERVER_STATIC=true
 * process.env.SERVE_STATIC_PATH=public
 *
 * app.use(express.static(STATIC_PATH));
 *
 */
const SERVE_STATIC = getBoolean('SERVE_STATIC', false);
let STATIC_PATH;
if (SERVE_STATIC) {
  STATIC_PATH = getString('SERVE_STATIC_PATH', 'public');
  STATIC_PATH = resolvePath(getString('BASE_PATH'), STATIC_PATH);
  app.use(express.static(STATIC_PATH));
}

/**
 * @description setup and use serve favicon middleware
 * @see {@link https://github.com/expressjs/serve-favicon}
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since  0.1.0
 * @version 0.9.0
 * @example
 *
 * process.env.SERVE_FAVICON=true
 *
 * app.use(serveFavicon(FAVICON_PATH));
 *
 */
const SERVE_FAVICON = getBoolean('SERVE_FAVICON', false);
if (SERVE_FAVICON) {
  const FAVICON_PATH = resolvePath(STATIC_PATH, 'favicon.ico');
  app.use(serveFavicon(FAVICON_PATH));
}

/**
 * @description setup and use urlencoded body-parser middleware
 * @description parse application/x-www-form-urlencoded bodies
 * @see {@link https: //github.com/expressjs/body-parser}
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since  0.1.0
 * @version 0.1.0
 * @example
 *
 * process.env.BODY_PARSER_LIMIT=2mb
 *
 * app.use(bodyParse.urlencoded({ ... }));
 *
 */
const BODY_PARSER_LIMIT = getString('BODY_PARSER_LIMIT', '2mb');
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: BODY_PARSER_LIMIT,
  })
);

/**
 * @description setup and use json body-parser middleware
 * @see {@link https: //github.com/expressjs/body-parser}
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since  0.1.0
 * @version 0.1.0
 * @example
 *
 * process.env.BODY_PARSER_JSON_TYPE=application/json
 * process.env.BODY_PARSER_LIMIT=2mb
 *
 * app.use(bodyParser.json({ ... }));
 *
 */
const BODY_PARSER_JSON_TYPE = getString(
  'BODY_PARSER_JSON_TYPE',
  'application/json'
);
app.use(
  bodyParser.json({
    type: BODY_PARSER_JSON_TYPE,
    limit: BODY_PARSER_LIMIT,
  })
);

/**
 * @description setup and use method-override middleware
 * @see {@link https://github.com/expressjs/method-override}
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since  0.1.0
 * @version 0.1.0
 * @example
 *
 * app.use(methodOverride('X-HTTP-Method'));
 * app.use(methodOverride('X-HTTP-Method-Override'));
 * app.use(methodOverride('X-Method-Override'));
 * app.use(methodOverride('_method'));
 *
 */
app.use(methodOverride('X-HTTP-Method')); // Microsoft
app.use(methodOverride('X-HTTP-Method-Override')); // Google/GData
app.use(methodOverride('X-Method-Override')); // IBM
app.use(methodOverride('_method')); // query param

/**
 * @description setup and use helmet middleware
 * @see {@link https://github.com/helmetjs/helmet}
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since  0.1.0
 * @version 0.1.0
 * @example
 *
 * process.env.HELMET_HSTS=false
 *
 * app.use(helmet());
 *
 */
const HELMET_HSTS = getBoolean('HELMET_HSTS', false);
if (HELMET_HSTS) {
  app.use(helmet());
} else {
  app.use(helmet({ hsts: false }));
}

/**
 * @description setup and use express-mquery middleware
 * @see {@link https://github.com/lykmapipo/express-mquery}
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since  0.1.0
 * @version 0.1.0
 * @example
 *
 * process.env.MQUERY_LIMIT=10
 * process.env.MQUERY_MAX_LIMIT=50
 *
 * app.use(mquery({ limit: MQUERY_LIMIT, maxLimit: MQUERY_MAX_LIMIT }));
 *
 */
const MQUERY_LIMIT = getNumber('MQUERY_LIMIT', 10);
const MQUERY_MAX_LIMIT = getNumber('MQUERY_MAX_LIMIT', 50);
app.use(mquery({ limit: MQUERY_LIMIT, maxLimit: MQUERY_MAX_LIMIT }));

/**
 * @description setup and use express-respond middleware
 * @see {@link https://github.com/lykmapipo/express-respond}
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since  0.1.0
 * @version 0.1.0
 * @example
 *
 * app.use(respond);
 *
 */
app.use(respond);

/**
 * @name mount
 * @function mount
 * @description mount router(s) into application
 * @param {...Router} routers valid set of express routers to mount on app
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since  0.1.0
 * @version 0.1.0
 * @public
 * @example
 *
 * const { mount, Router } = require('@lykmapipo/express-common');
 *
 * const router = new Router({ version: '1.0.0' });
 * const app = mount(router);
 * //=> { [EventEmitter: app] ... }
 *
 */
export const mount = (...routers) => {
  return doMount(...routers).into(app);
};

/**
 * @name start
 * @function start
 * @description start express app
 * @param {Number} [port] valid port
 * @param {Function} [listener] callback to invoke on listen
 * @author lally elias <lallyelias87@mail.com>
 * @since  0.1.0
 * @version 0.1.0
 * @public
 * @example
 *
 * const { start } = require('@lykmapipo/express-common');
 * const app = start((error) => { ... });
 * //=> { [EventEmitter: app] ... }
 *
 */
export const start = (port, listener) => {
  // ensure port
  let copyOfport = getNumber('PORT', 5000);
  copyOfport = _.isNumber(port) ? port : copyOfport;

  // ensure listener
  const wrappedListener = () => {
    const cb = _.isFunction(port) ? port : listener;
    if (cb) {
      cb(null, process.env);
    }
  };

  // handle notFound & error
  app.use(notFound);
  app.use(errorHandler);

  app.listen(copyOfport, wrappedListener);

  // return app for chaining
  return app;
};

/**
 * @name testApp
 * @function testApp
 * @description express app used for api testing
 * @returns {Object} valid express application
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since 0.11.0
 * @version 0.1.0
 * @public
 * @example
 *
 * const { testApp } = require('@lykmapipo/express-common');
 * request(testApp)
 *   .get(`/v1/users`)
 *   .set('Accept', /json/)
 *   .expect('Content-Type', /json/)
 *   .expect(200).end((error, response) => { ... });
 *
 */
export const testApp = () => {
  // handle notFound & error
  app.use(notFound);
  app.use(errorHandler);

  // return app fot testing
  return app;
};

/**
 * @name use
 * @function use
 * @description mounts specified middlewares at the specified path.
 * @param {String} [path] path for which the middleware functions are invoked
 * @param {...Function} middlewares valid middleware functions
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since 0.17.0
 * @version 0.1.0
 * @public
 * @example
 *
 * const { use } = require('@lykmapipo/express-common');
 *
 * use('/v1/users', (req, res, next) => {
 *   console.log('Time: %d', Date.now());
 *   next();
 * });
 *
 */
export const use = (...middlewares) => app.use(...middlewares);

/**
 * @name all
 * @function all
 * @description matches all HTTP verbs at the specified path.
 * @param {String} path path for which the middleware functions are invoked
 * @param {...Function} middlewares valid middleware functions
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since 0.17.0
 * @version 0.1.0
 * @public
 * @example
 *
 * const { all } = require('@lykmapipo/express-common');
 *
 * all('/v1/users', (req, res, next) => {
 *   console.log('Time: %d', Date.now());
 *   next();
 * });
 *
 */
export const all = (path, ...middlewares) => app.all(path, ...middlewares);

/**
 * @name get
 * @function get
 * @description handle HTTP GET requests at specified path with specified
 * callback function(s).
 * @param {String} [path] path for which the middleware functions are invoked
 * @param {...Function} middlewares valid middleware functions
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since 0.17.0
 * @version 0.1.0
 * @public
 * @example
 *
 * const { get } = require('@lykmapipo/express-common');
 *
 * get('/v1/users', (req, res, next) => {
 *   res.ok({ ... })
 * });
 * //=> curl --request GET --url /v1/users
 *
 * get('/v1/users/:id', (req, res, next) => {
 *   res.ok({ ... })
 * });
 * //=> curl --request GET --url /v1/users/1
 *
 */
export const get = (path, ...middlewares) => app.get(path, ...middlewares);

/**
 * @name post
 * @function post
 * @description handle HTTP POST requests at specified path with specified
 * callback function(s).
 * @param {String} [path] path for which the middleware functions are invoked
 * @param {...Function} middlewares valid middleware functions
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since 0.17.0
 * @version 0.1.0
 * @public
 * @example
 *
 * const { post } = require('@lykmapipo/express-common');
 *
 * post('/v1/users', (req, res, next) => {
 *   res.ok({ ... })
 * });
 * //=> curl --request POST \
 * --url /v1/users \
 * --data '{
 *     "name": "John Doe"
 *   }'
 *
 */
export const post = (path, ...middlewares) => app.post(path, ...middlewares);

/**
 * @name put
 * @function put
 * @description handle HTTP PUT requests at specified path with specified
 * callback function(s).
 * @param {String} [path] path for which the middleware functions are invoked
 * @param {...Function} middlewares valid middleware functions
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since 0.17.0
 * @version 0.1.0
 * @public
 * @example
 *
 * const { put } = require('@lykmapipo/express-common');
 *
 * put('/v1/users/:id', (req, res, next) => {
 *   res.ok({ ... })
 * });
 * //=> curl --request PUT \
 * --url /v1/users/1 \
 * --data '{
 *     "name": "John Doe"
 *   }'
 *
 */
export const put = (path, ...middlewares) => app.put(path, ...middlewares);
export const patch = (path, ...middlewares) => app.patch(path, ...middlewares);
export const del = (path, ...middlewares) => app.delete(path, ...middlewares);
