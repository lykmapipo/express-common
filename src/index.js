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
import path from 'path';
import _ from 'lodash';
import uuidv1 from 'uuid/v1';
import { mergeObjects } from '@lykmapipo/common';
import { getString, getBoolean, getNumber, isTest } from '@lykmapipo/env';
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
 * @function correlationId
 * @name correlationId
 * @description http middleware for ensure request id and correlation id are
 * available on request and response headers
 * @param {Request} request valid express request object
 * @param {Response} response valid express response object
 * @return {Function} next valid express next middlware to pass control to
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
 * @return {Function} next valid express next middlware to pass control to
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
 * @return {Function} next valid express next middlware to pass control to
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
 * ensure process runtime environment
 * @default development
 */
process.env.NODE_ENV = getString('NODE_ENV', 'development');

/**
 * ensure process BASE_PATH
 * @default process.cwd()
 */
process.env.BASE_PATH = getString('BASE_PATH', process.cwd());

/**
 * ensure process APP_PATH
 * @default process.cwd()
 */
process.env.APP_PATH = path.resolve(
  process.env.BASE_PATH,
  process.env.APP_PATH || ''
);

/**
 * initialize express application
 */
const app = express();

/**
 * @name Router
 * @description factory to create express router with version
 * @param {Object} [optns] valid express router options plus its version
 * @param {String|Number} [optns.version] valid router version. default to 1
 * @return {} [description]
 */
app.Router = Router;

/**
 * set application environmnent
 * @author lally elias <lallyelias87@mail.com>
 * @since  0.1.0
 * @version 0.1.0
 */
app.set('env', getString('NODE_ENV'));

/**
 * set application port
 * @author lally elias <lallyelias87@mail.com>
 * @since  0.1.0
 * @version 0.1.0
 */
const PORT = getNumber('PORT', 5000);
app.set('port', PORT);

/**
 * ensure request id or correlation id
 * @see {@link https://github.com/expressjs/morgan}
 * @author lally elias <lallyelias87@mail.com>
 * @since  0.14.0
 * @version 0.1.0
 */
app.use(correlationId);

/**
 * use morgan request log middleware
 * @see {@link https://github.com/expressjs/morgan}
 * @author lally elias <lallyelias87@mail.com>
 * @since  0.1.0
 * @version 0.1.0
 */
const LOG_ENABLED = getBoolean('LOG_ENABLED', false) && !isTest();
if (LOG_ENABLED) {
  const LOG_FORMAT = getString('LOG_FORMAT', 'combined');
  app.use(morgan(LOG_FORMAT, { stream }));
}

/**
 * use cors middleware
 * @see {@link https://github.com/expressjs/cors}
 * @author lally elias <lallyelias87@mail.com>
 * @since  0.1.0
 * @version 0.1.0
 */
app.use(cors());

/**
 * use compression middleware
 * @see {@link https://github.com/expressjs/compression}
 * @author lally elias <lallyelias87@mail.com>
 * @since  0.1.0
 * @version 0.1.0
 */
app.use(compression());

/**
 * use express.static middleware
 * @see {@link http://expressjs.com/en/starter/static-files.html}
 * @see {@link http://expressjs.com/en/4x/api.html#express.static}
 * @author lally elias <lallyelias87@mail.com>
 * @since  0.1.0
 * @version 0.1.0
 */
const SERVE_STATIC = getBoolean('SERVE_STATIC', false);
let STATIC_PATH;
if (SERVE_STATIC) {
  STATIC_PATH = getString('SERVE_STATIC_PATH', 'public');
  STATIC_PATH = path.resolve(getString('BASE_PATH'), STATIC_PATH);
  app.use(express.static(STATIC_PATH));
}

/**
 * use serve favicon middleware
 * @see {@link https://github.com/expressjs/serve-favicon}
 * @author lally elias <lallyelias87@mail.com>
 * @since  0.1.0
 * @version 0.9.0
 */
const SERVE_FAVICON = getBoolean('SERVE_FAVICON', false);
if (SERVE_FAVICON) {
  const FAVICON_PATH = path.resolve(STATIC_PATH, 'favicon.ico');
  app.use(serveFavicon(FAVICON_PATH));
}

/**
 * use body-parser middleware
 * @description parse application/x-www-form-urlencoded bodies
 * @see {@link https: //github.com/expressjs/body-parser}
 * @author lally elias <lallyelias87@mail.com>
 * @since  0.1.0
 * @version 0.1.0
 */
const BODY_PARSER_LIMIT = getString('BODY_PARSER_LIMIT', '2mb');
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: BODY_PARSER_LIMIT,
  })
);

/**
 * use body-parser middleware
 * @description parse application/*+json bodies
 * @see {@link https: //github.com/expressjs/body-parser}
 * @author lally elias <lallyelias87@mail.com>
 * @since  0.1.0
 * @version 0.1.0
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
 * use method-override middleware
 * @see {@link https://github.com/expressjs/method-override}
 * @author lally elias <lallyelias87@mail.com>
 * @since  0.1.0
 * @version 0.1.0
 */
app.use(methodOverride('X-HTTP-Method')); // Microsoft
app.use(methodOverride('X-HTTP-Method-Override')); // Google/GData
app.use(methodOverride('X-Method-Override')); // IBM
app.use(methodOverride('_method')); // query param

/**
 * use helmet middleware
 * @see {@link https://github.com/helmetjs/helmet}
 * @author lally elias <lallyelias87@mail.com>
 * @since  0.1.0
 * @version 0.1.0
 */
const HELMET_HSTS = getBoolean('HELMET_HSTS', false);
if (HELMET_HSTS) {
  app.use(helmet());
} else {
  app.use(helmet({ hsts: false }));
}

/**
 * use express-mquery middleware
 * @see {@link https://github.com/lykmapipo/express-mquery}
 * @author lally elias <lallyelias87@mail.com>
 * @since  0.1.0
 * @version 0.1.0
 */
const MQUERY_LIMIT = getNumber('MQUERY_LIMIT', 10);
const MQUERY_MAX_LIMIT = getNumber('MQUERY_MAX_LIMIT', 50);
app.use(mquery({ limit: MQUERY_LIMIT, maxLimit: MQUERY_MAX_LIMIT }));

/**
 * use express-respond middleware
 * @see {@link https://github.com/lykmapipo/express-respond}
 * @author lally elias <lallyelias87@mail.com>
 * @since  0.10.0
 * @version 0.1.0
 */
app.use(respond);

/**
 * @name mount
 * @function mount
 * @description mount router(s) into application
 * @param {routesr} routers set of routers or paths to load
 * @author lally elias <lallyelias87@mail.com>
 * @since  0.1.0
 * @version 0.1.0
 * @public
 */
app.mount = function mount(...routers) {
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
app.start = function start(port, listener) {
  // ensure port
  let copyOfport = PORT;
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
 * @name test
 * @function test
 * @description express app used for api testing
 * @return {Object} valid express application
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
  // return express app
  return app;
};

/**
 * @name app
 * @function app
 * @description express app used for live api
 * @return {Object} valid express application
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since 0.11.0
 * @version 0.1.0
 * @public
 * @example
 *
 * const { app } = require('@lykmapipo/express-common');
 * app.get('/v1/verify', (req, res, next) => { });
 * app.start((error) => { ... });
 *
 */
export default app;
