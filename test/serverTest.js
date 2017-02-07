'use strict';

const tape = require('tape');
const proxyquire = require('proxyquire').noCallThru();

var configValidation = require('../src/configValidation');

tape('configValidation throwing error should rethrow', function(test) {
  test.test('validate throws error', function(t) {
    var config = {};

    t.throws(function() {
      proxyquire('../server', {
        './src/configValidation': {
          validate: () => {
            throw Error('config is not valid');
          }
        }
      });

      configValidation.validate(config);
    }, /config is not valid/);
    t.end();

  });

});
