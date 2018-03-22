'use strict';


//ensure test environment
process.env.NODE_ENV = 'test';
process.env.LOG_ENABLED = false;
process.env.LOG_FORMAT = 'tiny';
process.env.CORS_ENABLED = true;
process.env.COMPRESSION_ENABLED = true;
process.env.SERVE_STATIC = true;
process.env.SERVE_STATIC_PATH = './test/fixtures'; //relative to process.cwd()
process.env.BODY_PARSER_ENABLED = true;
process.env.BODY_PARSER_JSON_LIMIT = '2mb';
process.env.BODY_PARSER_JSON_TYPE = 'application/json';
process.env.METHOD_OVERRIDE_ENABLED = true;
process.env.HELMET_ENABLED = true;


//dependencies
const path = require('path');
const _ = require('lodash');
const supertest = require('supertest');
const expect = require('chai').expect;
const app = require(path.join(__dirname, '..'));

describe('app', function () {

  it('should an instance of event emitter', function () {
    expect(app).to.exist;
    expect(app.constructor.name).to.be.equal('EventEmitter');
  });

  describe('env', function () {

    it('should have default runtime environment', function () {
      const env = app.env;
      expect(env).to.exist;
      expect(env).to.be.equal('test');
    });

    it('should be able to runtime environment', function () {
      //remember
      const last = app.env;

      app.env = 'stage';
      const env = app.env;
      expect(env).to.exist;
      expect(env).to.be.equal('stage');
      expect(env).to.not.be.equal(last);

      //restore
      app.env = last;
    });

  });


  describe('cors', function () {

    app.get('/cors', function (request, response) {
      response.json({});
    });

    it('should set `cors` middleware', function (done) {
      supertest(app)
        .get('/cors')
        .set('Accept-Encoding', 'gzip, deflate, br')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect('Access-Control-Allow-Origin', '*')
        .end(done);
    });

  });

  describe('compression', function () {

    app.get('/compressions', function (request, response) {
      response.json({});
    });

    it('should be able to serve static content', function (done) {
      supertest(app)
        .get('/compressions')
        .set('Accept-Encoding', 'gzip, deflate, br')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect('Access-Control-Allow-Origin', '*')
        .expect('vary', 'Accept-Encoding')
        .end(done);
    });

  });

  describe('serve static', function () {

    it('should be able to serve static content', function (done) {
      supertest(app)
        .get('/sample.png')
        .set('Accept-Encoding', 'gzip, deflate, br')
        .expect(200)
        .expect('Content-Type', /image/)
        .expect('Access-Control-Allow-Origin', '*')
        .end(done);
    });

  });

  describe('body parser', function () {

    app.post('/parsers', function (request, response) {
      response.json(request.body);
    });

    it('should be able to parse json bodies', function (done) {
      const body = {
        point: 4
      };
      supertest(app)
        .post('/parsers')
        .send(body)
        .set('Content-Type', 'application/json')
        .set('Accept-Encoding', 'gzip, deflate, br')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect('Access-Control-Allow-Origin', '*')
        .end(function (error, response) {
          expect(error).to.not.exist;
          expect(response.body).to.exist;
          expect(response.body).to.be.eql(body);
          done(error, response);
        });
    });


    it('should be able to parse url-encoded bodies', function (done) {
      const body = {
        grade: 'A'
      };
      supertest(app)
        .post('/parsers')
        .type('form')
        .send(body)
        .set('Accept-Encoding', 'gzip, deflate, br')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect('Access-Control-Allow-Origin', '*')
        .end(function (error, response) {
          expect(error).to.not.exist;
          expect(response.body).to.exist;
          expect(response.body).to.be.eql(body);
          done(error, response);
        });
    });

  });


  describe('helmet', function () {

    app.get('/helmets', function (request, response) {
      response.json({});
    });

    it('should set `helmet` middleware', function (done) {
      supertest(app)
        .get('/helmets')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect('Access-Control-Allow-Origin', '*')
        .expect('X-DNS-Prefetch-Control', 'off')
        .expect('X-FRAME-Options', 'SAMEORIGIN')
        .expect('X-Download-Options', 'noopen')
        .expect('X-Content-Type-Options', 'nosniff')
        .expect('X-XSS-Protection', '1; mode=block')
        .end(done);
    });

  });

  describe('loadRouters', function () {

    it('should be a function', function () {
      expect(app.loadRouters).to.exist;
      expect(app.loadRouters).to.be.a('function');
      expect(app.loadRouters.length).to.be.equal(1);
    });

    it('should be able to load routers', function () {
      const routers = app.loadRouters({ cwd: __dirname });
      expect(routers).to.exist;
      expect(_.keys(routers)).to.have.length(2);
    });

  });

  describe('setup', function () {

    before(function () {
      app.setup({ cwd: __dirname });
    });

    it('should be able to load v1 routers', function (done) {
      supertest(app)
        .get('/v1.0.0/contacts')
        .set('Accept-Encoding', 'gzip, deflate, br')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect('Access-Control-Allow-Origin', '*')
        .end(function (error, response) {
          expect(error).to.not.exist;
          expect(response).to.exist;
          expect(response.body).to.exist;
          expect(response.body[0].mobile).to.not.exist;
          done(error, response);
        });
    });

    it('should be able to load v2 routers', function (done) {
      supertest(app)
        .get('/v2.0.0/contacts')
        .set('Accept-Encoding', 'gzip, deflate, br')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect('Access-Control-Allow-Origin', '*')
        .end(function (error, response) {
          expect(error).to.not.exist;
          expect(response).to.exist;
          expect(response.body).to.exist;
          expect(response.body[0].mobile).to.exist;
          done(error, response);
        });
    });

  });

});