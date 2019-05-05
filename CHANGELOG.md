#### 0.16.1 (2019-05-05)

##### Chores

* **deps:**  force latest versions & audit fixes ([8222135a](https://github.com/lykmapipo/express-common/commit/8222135a5a7a26700d90682570ad2fba0c00e711))

#### 0.16.0 (2019-05-04)

##### Chores

* **example:**  update to use build than es6 sources ([2d5d4eb1](https://github.com/lykmapipo/express-common/commit/2d5d4eb16864758c3f7b97e0ddfe71d0161d5c6c))
*  pre-upgrade to use es6 ([3b76ca2d](https://github.com/lykmapipo/express-common/commit/3b76ca2d02ff75889b18a670ea241faaeb23f4a3))
*  add eslintrc for tests ([4fa17fe5](https://github.com/lykmapipo/express-common/commit/4fa17fe547d52ef63e1197b4f16475c85893c2aa))
*  create es6 src folder ([acda32ad](https://github.com/lykmapipo/express-common/commit/acda32ade2f5df748cd73fd6bfc2065e9daa6ef4))
*  add initial rollup config file ([f4b3e3f6](https://github.com/lykmapipo/express-common/commit/f4b3e3f63ff108663c2b75b17237e333c147b28d))
*  remove grunt file ([dffeeeb5](https://github.com/lykmapipo/express-common/commit/dffeeeb537674ddd72bab2f323a8c8f474d89ceb))
*  add iso lib common config files ([8ad94c48](https://github.com/lykmapipo/express-common/commit/8ad94c4854092d3134964e3e724db499888882d6))

##### Documentation Changes

* **readme:**
  *  update usage docs ([faf989ee](https://github.com/lykmapipo/express-common/commit/faf989ee3638273ec23997064e6c22a01bf6a9d8))
  *  drop year ([00746550](https://github.com/lykmapipo/express-common/commit/00746550539f8eefdb0230fd9caa4936651c3a5f))
* **license:**  drop year ([b9071002](https://github.com/lykmapipo/express-common/commit/b9071002a237c6803954d8c32fc23ed04dab2fe6))
*  add code of conduct & contributing guide ([d6f6f6af](https://github.com/lykmapipo/express-common/commit/d6f6f6af2ccfa56874ff038be6612099f9de95b4))

##### New Features

*  allow enabling trust proxy ([d11c15e5](https://github.com/lykmapipo/express-common/commit/d11c15e5e0aad34ebfaa0b8d238f0850e0d42376))

##### Refactors

* **logger:**  switch env variable and improve jsdocs ([4bbb9c9a](https://github.com/lykmapipo/express-common/commit/4bbb9c9ad2c1716965f36cdd3c48d5c0c31d22b6))
*  export named app & improve jsdocs ([5dee2169](https://github.com/lykmapipo/express-common/commit/5dee2169fe3cd961da02603c845fbfb6473e3670))
*  remove unused codes & re-organize tests ([940f9ce4](https://github.com/lykmapipo/express-common/commit/940f9ce44b09de20f332543069393ad8b1c29138))
* **app:**
  *  detach Router factory to separate helper ([529e56e5](https://github.com/lykmapipo/express-common/commit/529e56e58ab58626fea2e4c2aac25aa9bdad44a3))
  *  detach start to separate helper ([33c5d2e1](https://github.com/lykmapipo/express-common/commit/33c5d2e183bf2ee829f0238008d1ae023734b3a2))
  *  detach mount to separate helper ([7fb40271](https://github.com/lykmapipo/express-common/commit/7fb40271443c4a8683b08c8aef0a22914ff8a5cc))
* **middleware:**
  *  extract errorHandler to exportable middleware ([82b95178](https://github.com/lykmapipo/express-common/commit/82b95178e349d8cb24283679d1ea00186487737b))
  *  extract notFound to exportable middleware ([decec2f8](https://github.com/lykmapipo/express-common/commit/decec2f822f07eabbd6311923744602c5aedf4bc))

##### Code Style Changes

*  improve app setup jsdocs ([7038fe8a](https://github.com/lykmapipo/express-common/commit/7038fe8a12e8a903e3f2df9fd21f84dfe3de829f))
*  improve testApp jsdocs ([4eaa5d4f](https://github.com/lykmapipo/express-common/commit/4eaa5d4f988f0457325563f9ea007f7fa4d4066b))
* **config:**  improve jsdocs for env config ([143f5b78](https://github.com/lykmapipo/express-common/commit/143f5b78ef584202f5f49c486fe3e2e01cad9fa8))
* **middleware:**  improve usage example jsdcocs ([0b988607](https://github.com/lykmapipo/express-common/commit/0b988607d0787cd7c9e29dee84262ff30a39de4b))

##### Tests

*  drop path routers ([46a3b7c1](https://github.com/lykmapipo/express-common/commit/46a3b7c100a21d42b1a5bf32588bdeff291a2134))

#### 0.15.0 (2019-05-02)

##### New Features

*  add winston logger stream into morgan ([7e92faf1](https://github.com/lykmapipo/express-common/commit/7e92faf197e82faa74081688c21dd6f2ed90199f))

#### 0.14.0 (2019-05-02)

##### New Features

*  add request id/correlation id on request & response ([01e80521](https://github.com/lykmapipo/express-common/commit/01e80521dbf687f5b20910a6ebef2c9a0e0cf9df))

#### 0.13.1 (2019-05-01)

##### Chores

* **.npmrc:**  prevent npm version to commit and tag version ([e9520c7f](https://github.com/lykmapipo/express-common/commit/e9520c7fff240e67c3de8865afe1083eadf514ff))
* **deps:**  force latest version & audit fix ([8cb0b70c](https://github.com/lykmapipo/express-common/commit/8cb0b70c5cc1c20dadce40dc1cd3b72d9336c389))

#### 0.13.0 (2019-04-12)

##### Refactors

*  use response error method shortcut ([41924602](https://github.com/lykmapipo/express-common/commit/41924602874e88aa479eac1cea2844e3693706e6))

##### Tests

*  assert error response fields ([89a44f29](https://github.com/lykmapipo/express-common/commit/89a44f297aa74ebde17dcf38fdd75d27c65aa32f))

#### 0.12.3 (2019-04-12)

##### Chores

*  use latest node on travis ([53793e63](https://github.com/lykmapipo/express-common/commit/53793e63f97b8eb8b21c4158052383eef68d23cd))
*  force latest dependencies ([fde4c2a2](https://github.com/lykmapipo/express-common/commit/fde4c2a25a8b21b2f2fd1b45858f49bf22300a5a))

#### 0.12.2 (2019-04-01)

##### Chores

*  force latest dependencies ([6005eddb](https://github.com/lykmapipo/express-common/commit/6005eddb45d11a461b2b083e41302c9ec1b440ff))

#### 0.12.1 (2019-03-04)

##### Chores

*  force latest dependencies ([c3d9b8c4](https://github.com/lykmapipo/express-common/commit/c3d9b8c49ebdea69aee6e5648b75509977727c5d))

#### 0.12.0 (2019-02-25)

##### New Features

*  disable http request log on test ([9ef2a0eb](https://github.com/lykmapipo/express-common/commit/9ef2a0ebaaa0b02250aa9c62b65c87966230b90e))

#### 0.11.0 (2019-02-25)

##### New Features

*  add testApp to api testing ([594b24ea](https://github.com/lykmapipo/express-common/commit/594b24ead5cf5eca6b11cde8322009cff797051e))

#### 0.10.2 (2019-02-13)

##### Chores

*  force latest dependencies ([4fcd37fc](https://github.com/lykmapipo/express-common/commit/4fcd37fcdcd5a5c5d9d6b5a667b086e677a73378))

#### 0.10.1 (2019-02-12)

##### Chores

*  force latest dependencies ([d9dd5d32](https://github.com/lykmapipo/express-common/commit/d9dd5d32d882123f3ceae2a3ff196a1e09adcd94))

