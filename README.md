# express-common

[![Build Status](https://travis-ci.org/lykmapipo/express-common.svg?branch=master)](https://travis-ci.org/lykmapipo/express-common)
[![Dependency Status](https://img.shields.io/david/lykmapipo/express-common.svg?style=flat)](https://david-dm.org/lykmapipo/express-common)
[![npm version](https://badge.fury.io/js/%40lykmapipo%2Fexpress-common.svg)](https://badge.fury.io/js/@lykmapipo/express-common)


minimal express app configuration.

It use below packages:
- [body-parser](https://github.com/expressjs/body-parser)
- [compression](https://github.com/expressjs/compression)
- [cors](https://github.com/expressjs/cors)
- [debug]()
- [dotenv](https://github.com/motdotla/dotenv)
- [helmet](https://github.com/helmetjs/helmet)
- [method-override](https://github.com/expressjs/method-override)
- [morgan](https://github.com/expressjs/morgan)

*Note: It highly advice to use TLS*

## Requirements

- NodeJS v9.3.0+
- mongoose v5.0.9+

## Install
```sh
$ npm install --save @lykmapipo/express-common
```

## Usage

```javascript
//dependencies
const path = require('path');
const mount = require('@lykmapipo/express-router-extra').mount;
const app = require(path.join(__dirname, '..'));

//mount routers
mount('./routers/v1', './routers/v2').into(app);

app.handleNotFound();
app.handleErrors();

app.listen(app.get('port') || process.env.PORT || 5000);

```


## Testing
* Clone this repository

* Install all development dependencies
```sh
$ npm install
```
* Then run test
```sh
$ npm test
```

## Contribute
It will be nice, if you open an issue first so that we can know what is going on, then, fork this repo and push in your ideas. Do not forget to add a bit of test(s) of what value you adding.

## References
- [expressjs](https://expressjs.com/)
- [Production Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [Production Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)
- [Using Middleware](http://expressjs.com/en/guide/using-middleware.html)
- [Health Checks and Graceful Shutdown](https://expressjs.com/en/advanced/healthcheck-graceful-shutdown.html)
- [The Twelve Factors App](https://12factor.net/)

## Licence
The MIT License (MIT)

Copyright (c) 2018 lykmapipo & Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. 