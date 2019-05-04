import _ from 'lodash';
import supertest from 'supertest';
import { expect } from 'chai';
import { app, mount, Router, testApp } from '../src/index';

describe('app', () => {
  it('should an instance of event emitter', () => {
    expect(app).to.exist;
    expect(app.constructor.name).to.be.equal('EventEmitter');
  });

  it('should expose test app', () => {
    expect(testApp).to.exist;
    expect(testApp().constructor.name).to.be.equal('EventEmitter');
  });
});

describe('env', () => {
  it('should have default runtime environment', () => {
    const env = app.get('env');
    expect(env).to.exist;
    expect(env).to.be.equal('test');
  });

  it('should be able to change runtime environment', () => {
    // remember
    const last = app.get('env');

    app.set('env', 'stage');
    const env = app.get('env');
    expect(env).to.exist;
    expect(env).to.be.equal('stage');
    expect(env).to.not.be.equal(last);

    // restore
    app.set('env', last);
  });
});

describe('cors', () => {
  app.get('/cors', (request, response) => {
    response.json({});
  });

  it('should set `cors` middleware', done => {
    supertest(app)
      .get('/cors')
      .set('Accept-Encoding', 'gzip, deflate, br')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect('Access-Control-Allow-Origin', '*')
      .end(done);
  });
});

describe('compression', () => {
  app.get('/compressions', (request, response) => {
    response.json({});
  });

  it('should be able to serve static content', done => {
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

describe('serve static', () => {
  it('should be able to serve static content', done => {
    supertest(app)
      .get('/sample.png')
      .set('Accept-Encoding', 'gzip, deflate, br')
      .expect(200)
      .expect('Content-Type', /image/)
      .expect('Access-Control-Allow-Origin', '*')
      .end(done);
  });
});

describe('body parser', () => {
  app.post('/parsers', (request, response) => {
    response.json(request.body);
  });

  it('should be able to parse json bodies', done => {
    const body = {
      point: 4,
    };
    supertest(app)
      .post('/parsers')
      .send(body)
      .set('Content-Type', 'application/json')
      .set('Accept-Encoding', 'gzip, deflate, br')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect('Access-Control-Allow-Origin', '*')
      .end((error, response) => {
        expect(error).to.not.exist;
        expect(response.body).to.exist;
        expect(response.body).to.be.eql(body);
        done(error, response);
      });
  });

  it('should be able to parse url-encoded bodies', done => {
    const body = {
      grade: 'A',
    };
    supertest(app)
      .post('/parsers')
      .type('form')
      .send(body)
      .set('Accept-Encoding', 'gzip, deflate, br')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect('Access-Control-Allow-Origin', '*')
      .end((error, response) => {
        expect(error).to.not.exist;
        expect(response.body).to.exist;
        expect(response.body).to.be.eql(body);
        done(error, response);
      });
  });
});

describe('overrides', () => {
  app.all('/overrides', (request, response) => {
    response.set('X-Got-Method', request.method);
    response.json(request.body);
  });

  it('should set `overrides` middleware', done => {
    supertest(app)
      .get('/overrides')
      .expect(200)
      .expect('X-Got-Method', 'GET')
      .end(done);
  });

  it('should set `overrides` middleware', done => {
    supertest(app)
      .post('/overrides')
      .set('X-HTTP-Method', 'DELETE')
      .expect(200)
      .expect('X-Got-Method', 'DELETE')
      .end(done);
  });

  it('should set `overrides` middleware', done => {
    supertest(app)
      .post('/overrides')
      .set('X-HTTP-Method-Override', 'DELETE')
      .expect(200)
      .expect('X-Got-Method', 'DELETE')
      .end(done);
  });

  it('should set `overrides` middleware', done => {
    supertest(app)
      .post('/overrides')
      .set('X-Method-Override', 'DELETE')
      .expect(200)
      .expect('X-Got-Method', 'DELETE')
      .end(done);
  });

  it('should set `overrides` middleware', done => {
    supertest(app)
      .post('/overrides?_method=DELETE')
      .expect(200)
      .expect('X-Got-Method', 'DELETE')
      .end(done);
  });
});

describe('helmet', () => {
  app.get('/helmets', (request, response) => {
    response.json({});
  });

  it('should set `helmet` middleware', done => {
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

describe('request-id', () => {
  app.get('/request-id', (request, response) => {
    expect(request.headers['x-correlation-id']).to.exist;
    expect(request.headers['x-request-id']).to.exist;
    response.json({});
  });

  it('should set `request-id` middleware', done => {
    supertest(app)
      .get('/request-id')
      .expect(200)
      .end((error, response) => {
        expect(response.headers['x-correlation-id']).to.exist;
        expect(response.headers['x-request-id']).to.exist;
        expect(response.headers['x-request-id']).to.be.equal(
          response.headers['x-correlation-id']
        );
        done(error, response);
      });
  });
});

describe('mquery', () => {
  app.get('/mquery', (request, response) => {
    response.json(request.mquery);
  });

  it('should set `mquery` middleware', done => {
    const query = {
      filter: { age: { $gte: 12 } },
      paginate: { limit: 20, skip: 0, page: 1 },
      populate: [{ path: 'customer' }],
      select: { name: 1 },
      sort: { name: 1, email: -1 },
    };
    supertest(app)
      .get(
        '/mquery?fields=name&include=customer&filter[age][$gte]=12&sort[name]=1&sort[email]=-1&page=1&limit=20'
      )
      .expect(200)
      .expect('Content-Type', /json/)
      .end((error, response) => {
        expect(error).to.not.exist;
        expect(response).to.exist;
        const mquery = response.body;
        expect(mquery).to.exist;
        expect(mquery.select).to.exist;
        expect(mquery.paginate).to.exist;
        expect(mquery.populate).to.exist;
        expect(mquery.select).to.exist;
        expect(mquery.sort).to.exist;
        expect(mquery).to.eql(query);
        done(error, response);
      });
  });
});

describe('respond', () => {
  app.get('/respond', (request, response) => {
    response.ok({});
  });

  it('should set `respond` middleware', done => {
    supertest(app)
      .get('/respond')
      .set('Accept-Encoding', 'gzip, deflate, br')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect('Access-Control-Allow-Origin', '*')
      .end(done);
  });

  app.get('/respond-error', (request, response) => {
    response.error(new Error('Server Error'));
  });

  it('should set `respond` middleware', done => {
    supertest(app)
      .get('/respond-error')
      .set('Accept-Encoding', 'gzip, deflate, br')
      .expect(500)
      .expect('Content-Type', /json/)
      .expect('Access-Control-Allow-Origin', '*')
      .end((error, { body }) => {
        expect(body.status).to.exist;
        expect(body.code).to.exist;
        expect(body.message).to.exist;
        expect(body.description).to.exist;
        done();
      });
  });
});

describe('mount', () => {
  it('should be able to mount router into app', () => {
    // initialize & mount
    const router = new Router();
    router.get('/samples', (req, res) => {
      res.json(req.body);
    });
    const mounted = mount(router);

    // after
    expect(mounted.routers).to.exist;
    expect(mounted.routers).to.have.length(1);
    expect(app._router).to.exist;
    expect(app._router.stack).to.exist;
    const found = _.find(app._router.stack, ['handle.uuid', router.uuid]);
    expect(found).to.exist;
    expect(found.handle).to.eql(router);
  });

  it('should be able to mount router only once into app', () => {
    // initialize & mount
    const router = new Router();
    router.get('/samples', (req, res) => {
      res.json(req.body);
    });
    const mounted = mount(router, router);

    // after
    expect(mounted.routers).to.exist;
    expect(mounted.routers).to.have.length(1);
    expect(app._router).to.exist;
    expect(app._router.stack).to.exist;
    const founds = _.filter(app._router.stack, ['handle.uuid', router.uuid]);
    expect(founds).to.exist;
    expect(founds).to.have.length(1);
    expect(_.first(founds).handle).to.eql(router);
  });

  it('should be able to mount routers into app', () => {
    // initialize & mount
    const routerA = new Router();
    routerA.get('/a', (req, res) => {
      res.json(req.body);
    });

    const routerB = new Router();
    routerB.get('/b', (req, res) => {
      res.json(req.body);
    });

    const mounted = mount(routerA, routerB);

    // after
    expect(mounted.routers).to.exist;
    expect(mounted.routers).to.have.length(2);
    expect(app._router).to.exist;
    expect(app._router.stack).to.exist;

    const foundA = _.find(app._router.stack, ['handle.uuid', routerA.uuid]);
    expect(foundA).to.exist;
    expect(foundA.handle).to.eql(routerA);

    const foundB = _.find(app._router.stack, ['handle.uuid', routerB.uuid]);
    expect(foundB).to.exist;
    expect(foundB.handle).to.eql(routerB);
  });
});
