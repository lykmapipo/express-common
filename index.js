'use strict';


/**
 * @name express-common
 * @description minimal express app configuration
 * @author lally elias <lallyelias87@mail.com>
 * @since  0.1.0
 * @version 0.1.0
 * @example
 * const http = require('http');
 * const app = require('@lykmapipo/express-common');
 * 
 * ...additional setups
 * 
 * const server = http.createServer(app);
 * server.listen(3000);
 */


/* dependencies */
const path = require('path');
const _ = require('lodash');
const uuidv1 = require('uuid/v1');
const {
  getString,
  getBoolean,
  getNumber,
  isTest
} = require('@lykmapipo/env');
const express = require('@lykmapipo/express-request-extra');
const Router = require('@lykmapipo/express-router-extra').Router;
const doMount = require('@lykmapipo/express-router-extra').mount;
const morgan = require('morgan');
const cors = require('cors');
const compression = require('compression');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const serveFavicon = require('serve-favicon');
const helmet = require('helmet');
const mquery = require('express-mquery');
const respond = require('express-respond');
const { stream } = require('@lykmapipo/logger');


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
process.env.APP_PATH =
  path.resolve(process.env.BASE_PATH, process.env.APP_PATH || '');


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
 * @see  {@link https://expressjs.com/en/advanced/best-practice-performance.html#set-node_env-to-production}
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
app.use(function setCorrelationId(request, response, next) {
  // obtain passed request or correlation id
  let correlationId =
    (request.get('X-Request-Id') || request.get('X-Correlation-Id'));

  // ensure correlationId
  correlationId = (_.isEmpty(correlationId) ? uuidv1() : correlationId);

  // merge to request headers
  request.headers = _.merge({}, {
    'x-correlation-id': correlationId,
    'x-request-id': correlationId,
  }, request.headers);

  // set response headers
  response.set('X-Correlation-Id', correlationId);
  response.set('X-Request-Id', correlationId);

  // continue
  next();
});

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
app.use(bodyParser.urlencoded({
  extended: true,
  limit: BODY_PARSER_LIMIT
}));


/**
 * use body-parser middleware
 * @description parse application/*+json bodies
 * @see {@link https: //github.com/expressjs/body-parser}
 * @author lally elias <lallyelias87@mail.com>
 * @since  0.1.0
 * @version 0.1.0
 */
const BODY_PARSER_JSON_TYPE =
  getString('BODY_PARSER_JSON_TYPE', 'application/json');
app.use(bodyParser.json({
  type: BODY_PARSER_JSON_TYPE,
  limit: BODY_PARSER_LIMIT
}));


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
 * @name notFound
 * @function notFound
 * @description middleware to handle un matched routes 
 * @param  {Request}   request  valid express http request
 * @param  {Response}   response valid express http response
 * @param  {Function} next middlware to pass control into
 * @author lally elias <lallyelias87@mail.com>
 * @since  0.1.0
 * @version 0.1.0
 */
app.notFound = function notFound(request, response, next) {
  let error = new Error('Not Found');
  error.status = 404;
  next(error);
};


/*jshint unused:false */

/**
 * @name handleError
 * @function handleError
 * @param  {Request}   request  valid express http request
 * @param  {Response}   response valid express http response
 * @param  {Function} next middlware to pass control into
 * @author lally elias <lallyelias87@mail.com>
 * @since  0.1.0
 * @version 0.2.0
 * @see  {@link http://jsonapi.org/examples/#error-objects}
 */
app.errorHandler = function errorHandler(error, request, response, next) {
  response.error(error);
};

/*jshint unused:true */



/**
 * @name handleNotFound
 * @function handleNotFound
 * @description handle non matched routes 
 * @author lally elias <lallyelias87@mail.com>
 * @since  0.1.0
 * @version 0.1.0
 */
app.handleNotFound = function handleNotFound(notFound) {
  const middleware = notFound || app.notFound;
  app.use(middleware);
};


/**
 * @name handleErrors
 * @function handleErrors
 * @description handle errors
 * @author lally elias <lallyelias87@mail.com>
 * @since  0.1.0
 * @version 0.1.0
 * @public
 * @see  {@link http://jsonapi.org/examples/#error-objects}
 */
app.handleErrors = function handleError(errorHandler) {
  const middleware = errorHandler || app.errorHandler;
  app.use(middleware);
};


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
 * const app = require('@lykmapipo/express-common');
 *
 * ...initializations
 *
 * app
 *   .start( function onStart(error, env) {
 *     ...
 *   })
 *   .on('error', function onError(error) {
 *     ...
 *   });
 *   
 */
app.start = function start(port, listener) {

  //ensure port
  let _port = PORT;
  _port = _.isNumber(port) ? port : _port;

  //ensure listener
  const _listener = function () {
    const cb = _.isFunction(port) ? port : listener;
    cb && cb(null, process.env);
  };

  //handle notFound & error
  app.handleNotFound();
  app.handleErrors();

  app.listen(_port, _listener);

  //return app for chaining
  return app;

};


/**
 * @name test
 * @function test
 * @description express app used for api testing
 * @author lally elias <lallyelias87@mail.com>
 * @since  0.11.0
 * @version 0.1.0
 * @public
 * @example
 * const { testApp } = require('@lykmapipo/express-common');
 * request(testApp)
 *   .get(`/v1/users`)
 *   .set('Accept', /json/)
 *   .expect('Content-Type', /json/)
 *   .expect(200).end((error, response) => { ... });
 */
Object.defineProperty(app, 'testApp', {
  get: function getTestApp() {
    // handle notFound
    app.handleNotFound();
    // handle error
    app.handleErrors();
    // return express app
    return app;
  }
});


/**
 * export
 */
module.exports = exports = app;