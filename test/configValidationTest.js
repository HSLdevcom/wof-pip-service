'use strict';

var tape = require('tape');

var configValidation = require('../src/configValidation');

tape('tests for looking up hierarchies', function(test) {
  test.test('non-object imports should throw error', function(t) {
    [null, 17, 'string', [], true].forEach((value) => {
      var config = {
        imports: value
      };

      t.throws(function() {
        configValidation.validate(config);
      }, /"imports" must be an object/);
    });

    t.end();

  });

  test.test('non-object imports.whosonfirst should throw error', function(t) {
    [null, 17, 'string', [], true].forEach((value) => {
      var config = {
        imports: {
          whosonfirst: value
        }
      };

      t.throws(function() {
        configValidation.validate(config);
      }, /"whosonfirst" must be an object/);
    });

    t.end();

  });

  test.test('config lacking imports.whosonfirst.datapath should throw error', function(t) {
    var config = {
      imports: {
        whosonfirst: {}
      }
    };

    t.throws(function() {
      configValidation.validate(config);
    }, /"datapath" is required/);
    t.end();

  });

  test.test('non-string imports.whosonfirst.datapath should throw error', function(t) {
    [null, 17, {}, [], true].forEach((value) => {
      var config = {
        imports: {
          whosonfirst: {
            datapath: value
          }
        }
      };

      t.throws(function() {
        configValidation.validate(config);
      }, /"datapath" must be a string/);

    });

    t.end();

  });

  test.test('string imports.whosonfirst.datapath should not throw error', function(t) {
    var config = {
      imports: {
        whosonfirst: {
          datapath: 'datapath value'
        }
      }
    };

    t.doesNotThrow(function() {
      configValidation.validate(config);
    });

    t.end();

  });

  test.test('unknown properties should not throw errors', function(t) {
    var config = {
      imports: {
        whosonfirst: {
          datapath: 'datapath value',
          unknown_property: 'property value'
        }
      }
    };

    t.doesNotThrow(function() {
      configValidation.validate(config);
    });

    t.end();

  });

});
