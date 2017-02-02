'use strict';

const Joi = require('joi');

// who's on first importer requires just `datapath`
const schema = Joi.object().keys({
  imports: {
    whosonfirst: {
      datapath: Joi.string()
    }
  }
}).requiredKeys('imports.whosonfirst.datapath').unknown(true);

module.exports = {
  validate: function validate(config) {
    Joi.validate(config, schema, { allowUnknown: true }, (err, value) => {
      if (err) {
        throw new Error(err.details[0].message);
      }
    });
  }

};
