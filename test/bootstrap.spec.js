process.env.NODE_ENV = 'test';
process.env.LOGGER_LOG_ENABLED = false;
process.env.LOGGER_LOG_HTTP_FORMAT = 'tiny';
process.env.SERVE_STATIC = true;
process.env.SERVE_STATIC_PATH = './test/fixtures';
process.env.BODY_PARSER_LIMIT = '2mb';
process.env.BODY_PARSER_JSON_TYPE = 'application/json';
process.env.HELMET_HSTS = false;
