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
const express = require('@lykmapipo/express-request-extra');
const _ = require('lodash');
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
dotenv.load({ path: process.env.BASE_PATH });


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
app.Router = require('@lykmapipo/express-router-extra').Router;


/**
 * set application environmnent
 * @see  {@link https://expressjs.com/en/advanced/best-practice-performance.html#set-node_env-to-production}
 * @author lally elias <lallyelias87@mail.com>
 * @since  0.1.0
 * @version 0.1.0
 */
app.set('env', process.env.NODE_ENV);

//define `env` getter and setter
Object.defineProperty(app, 'env', {
  get: function () { //get runtime environment
    return app.get('env');
  },
  set: function (env) { //set runtime environment
    env = !_.isEmpty(env) ? env : 'development';
    app.set('env', env);
  }
});


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
const CORS_ENABLED = process.env.CORS_ENABLED;
if (CORS_ENABLED) {
  app.use(cors());
}


/**
 * use compression middleware
 * @see {@link https://github.com/expressjs/compression}
 * @author lally elias <lallyelias87@mail.com>
 * @since  0.1.0
 * @version 0.1.0
 */
const COMPRESSION_ENABLED = process.env.COMPRESSION_ENABLED;
if (COMPRESSION_ENABLED) {
  app.use(compression());
}


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
  const STATIC_PATH = process.env.SERVE_STATIC_PATH || './public';
  app.use(express.static(path.resolve(process.cwd(), STATIC_PATH)));
}


/**
 * use body-parser middleware
 * @see {@link https://github.com/expressjs/body-parser}
 * @author lally elias <lallyelias87@mail.com>
 * @since  0.1.0
 * @version 0.1.0
 */
const BODY_PARSER_ENABLED = process.env.BODY_PARSER_ENABLED;
if (BODY_PARSER_ENABLED) {

  //parse application/x-www-form-urlencoded bodies
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  //parse application/*+json bodies
  const BODY_PARSER_JSON_LIMIT = (process.env.BODY_PARSER_JSON_LIMIT || '2mb');
  const BODY_PARSER_JSON_TYPE =
    (process.env.BODY_PARSER_JSON_TYPE || 'application/*+json');
  app.use(bodyParser.json({
    type: BODY_PARSER_JSON_TYPE,
    limit: BODY_PARSER_JSON_LIMIT
  }));

}


/**
 * use method-override middleware
 * @see  {@link http://expressjs.com/en/starter/static-files.html}
 * @author lally elias <lallyelias87@mail.com>
 * @since  0.1.0
 * @version 0.1.0
 */
const METHOD_OVERRIDE_ENABLED = process.env.METHOD_OVERRIDE_ENABLED;
if (METHOD_OVERRIDE_ENABLED) {
  //TODO support header
  app.use(methodOverride('_method'));
}


/**
 * use helmet middleware
 * @see {@link https://github.com/helmetjs/helmet}
 * @author lally elias <lallyelias87@mail.com>
 * @since  0.1.0
 * @version 0.1.0
 */
const HELMET_ENABLED = process.env.HELMET_ENABLED;
if (HELMET_ENABLED) {
  app.use(helmet({ hsts: false }));
}


/**
 * @name notFound
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
 * export
 */
module.exports = exports = app;