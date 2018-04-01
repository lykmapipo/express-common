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

//TODO implement debug


//dependencies
const path = require('path');
const _ = require('lodash');
const express = require('@lykmapipo/express-request-extra');
const Router = require('@lykmapipo/express-router-extra').Router;
const doMount = require('@lykmapipo/express-router-extra').mount;
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const compression = require('compression');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const helmet = require('helmet');
const statuses = require('statuses');


/**
 * ensure process BASE_PATH
 * @default process.cwd()
 */
process.env.BASE_PATH =
  path.resolve(process.env.BASE_PATH || process.cwd());


/**
 * load configuration from .env file from BASE_PATH
 * @see  {@link https://github.com/motdotla/dotenv}
 */
const result =
  dotenv.load({ path: path.resolve(process.env.BASE_PATH, '.env') });
if (result.error) {
  throw result.error;
}


/**
 * ensure process runtime environment
 * @default development
 */
process.env.NODE_ENV = (process.env.NODE_ENV || 'development');


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
app.set('env', process.env.NODE_ENV);


/**
 * set application port
 * @author lally elias <lallyelias87@mail.com>
 * @since  0.1.0
 * @version 0.1.0
 */
app.set('port', process.env.PORT || 5000);


/**
 * use morgan request log middleware
 * @see {@link https://github.com/expressjs/morgan}
 * @author lally elias <lallyelias87@mail.com>
 * @since  0.1.0
 * @version 0.1.0
 */
const LOG_ENABLED = process.env.LOG_ENABLED;
if (LOG_ENABLED) {
  const LOG_FORMAT = process.env.LOG_FORMAT;
  app.use(morgan(LOG_FORMAT));
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
 * @see  {@link http://expressjs.com/en/starter/static-files.html}
 * @see {@link http://expressjs.com/en/4x/api.html#express.static}
 * @author lally elias <lallyelias87@mail.com>
 * @since  0.1.0
 * @version 0.1.0
 */
const SERVE_STATIC = process.env.SERVE_STATIC;
if (SERVE_STATIC) {
  const STATIC_PATH = process.env.SERVE_STATIC_PATH || 'public';
  app.use(express.static(path.resolve(process.cwd(), STATIC_PATH)));
}


/**
 * use body-parser middleware
 * @description parse application/x-www-form-urlencoded bodies
 * @see {@link https: //github.com/expressjs/body-parser}
 * @author lally elias <lallyelias87@mail.com>
 * @since  0.1.0
 * @version 0.1.0
 */
const BODY_PARSER_LIMIT = (process.env.BODY_PARSER_LIMIT || '2mb');
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
  (process.env.BODY_PARSER_JSON_TYPE || 'application/json');
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
const HELMET_HSTS = process.env.HELMET_HSTS;
if (HELMET_HSTS) {
  app.use(helmet());
} else {
  app.use(helmet({ hsts: false }));
}


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
 * @version 0.1.0
 * @see  {@link http://jsonapi.org/examples/#error-objects}
 */
app.errorHandler = function errorHandler(error, request, response, next) {

  //obtain app environment
  const isProduction = (process.env.NODE_ENV === 'production');
  const status = (error.status || error.statusCode || 500);

  //reply with error
  response.status(status);
  response.json({
    status: status,
    code: error.code,
    name: (error.name || error.title),
    type: error.type,
    detail: error.detail,
    message: error.message || statuses[status],
    stack: error.stack
  });

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
  let _port = (process.env.PORT || 5000);
  _port = _.isNumber(port) ? port : _port;

  //ensure listener
  const _listener = function () {
    const cb = _.isFunction(port) ? port : listener;
    cb && cb(null, process.env);
  }

  //handle notFound & error
  app.handleNotFound();
  app.handleErrors();

  app.listen(_port, _listener);

  //return app for chaining
  return app;

};


//TODO swagger.json (definition)
//TODO swagger ui (explore)


/**
 * export
 */
module.exports = exports = app;