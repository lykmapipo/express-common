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
//TODO mkdir `routers`, `v1`


//dependencies
const path = require('path');
const fs = require('fs');
const https = require('https');
const semver = require('semver');
const load = require('require-all');
const traverse = require('traverse');
const express = require('express');
const Router = express.Router;
const _ = require('lodash');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const compression = require('compression');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const helmet = require('helmet');


/**
 * load configuration from .env file
 * @see  {@link https://github.com/motdotla/dotenv}
 */
dotenv.load();


/**
 * ensure runtime environment
 */
process.env.NODE_ENV = (process.env.NODE_ENV || 'development');


/**
 * initialize express application
 */
let app = express();


/**
 * instantiate versioned router
 */
app.Router = function (optns) {

  //merge default options
  const options = _.merge({}, { version: '1' }, optns);

  //instantiate and add resource details
  const router = new Router(options);
  router.version = semver.coerce(options.version || '1');

  return router;

};


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

  //parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  //parse application/json
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
  app.use(helmet());
}


/**
 * @name loadRouters
 * @description scan for express routers from process.cwd()
 * @param {Object} [optns] valid routers loading options
 * @param {String} [optns.cwd] working director to load routers from
 * @return {Object} object representation of loaded routers
 * @see  {@link https://github.com/felixge/node-require-all}
 * @author lally elias <lallyelias87@mail.com>
 * @since  0.1.0
 * @version 0.1.0
 */
app.loadRouters = function (optns) {

  //default options
  const options = _.merge({}, {
    cwd: process.cwd(),
    exclude: ['node_modules'],
    suffix: '_router',
    recursive: true
  }, optns);

  //prepare routers load options
  const loadOptions = {
    dirname: path.resolve(options.cwd),
    filter: new RegExp(`(.+${options.suffix})\\.js$`),
    excludeDirs: new RegExp(`^\\.|${options.exclude.join('|^')}$`),
    recursive: options.recursive,
    resolve: function (router) {
      const isRouter = (_.isFunction(router) && router.name === 'router');
      if (isRouter) {
        return router;
      } else {
        return undefined;
      }
    }
  };

  //load routers
  let routers = load(loadOptions);

  routers = traverse(routers).reduce(function (accumulator, leaf) {
    const isRouter =
      (leaf && _.isFunction(leaf) && leaf.name === 'router');
    if (isRouter) {
      accumulator.push(leaf);
    }
    return accumulator;
  }, []);

  return routers;

};


app.setup = function (optns) {

  //load `cwd` routers
  const routers = app.loadRouters(optns);

  //setup version based routers
  _.forEach(routers, function (router) {

    //register versioned routers
    //TODO validate with semver
    if (router.version && semver.valid(router.version)) {
      app.use(`/v${router.version}`, router);
    }

    //register normal routers
    else {
      app.use(router);
    }

  });

};


/**
 * @name test
 * @description create https server and start it
 * @see  {@link https://nodejs.org/api/https.html}
 * @author lally elias <lallyelias87@mail.com>
 * @since  0.1.0
 * @version 0.1.0
 */
app.startTestServer = function (options = {}) {

  //TODO if helmet enable use https else http

  //defaults
  const defaultKey = path.join(__dirname, 'certs', 'server.key');
  const defaultCrt = path.join(__dirname, 'certs', 'server.crt');

  //merge options
  options.port = (options.port || process.env.PORT || 3000);
  options.key = (options.key || fs.readFileSync(defaultKey));
  options.cert = (options.cert || fs.readFileSync(defaultCrt));

  //create https server using self signed certificates
  const server = https.createServer(options, app);

  server.listen(options.port);

};


module.exports = exports = app;