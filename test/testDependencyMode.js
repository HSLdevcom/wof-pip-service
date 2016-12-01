'use strict';

var createPIPService = require('../src/index.js').create;
var fs = require('fs');
var async = require('async');
var _ = require('lodash');

var inputData = require('./testData.json');


var layers = [
  //'continent',
  'country', // 216
  'county', // 18166
  'dependency', // 39
  'disputed', // 39
  'localadmin', // 106880
  'locality', // 160372
  'macrocounty', // 350
  'macroregion', // 82
  'neighbourhood', // 62936
  'region' // 4698
];

function test(callback) {
  var startTime = process.hrtime();

  createPIPService(layers, function (err, pipService) {

    console.log('Total load time (minutes) = ', (getMicroSeconds(process.hrtime(startTime))/1000000/60));

    inputData = _.concat(inputData, _.clone(inputData));
    inputData = _.concat(inputData, _.clone(inputData));
    inputData = _.concat(inputData, _.clone(inputData));

    startTime = process.hrtime();

    async.forEach(inputData, function (location, done) {
      pipService.lookup(location.latitude, location.longitude, function (err, results) {
        location.results = results;
        done();
      });
    },
    function end() {
      var reqDuration = getMicroSeconds(process.hrtime(startTime)) / inputData.length;
      console.log('Query count = ', inputData.length);
      console.log('Average duration (μsec) = ', reqDuration);
      console.log('Computed req/sec = ', 1000000 / reqDuration);

      fs.writeFileSync('./actualTestResuts.json', JSON.stringify(inputData, null, 2));

      pipService.end();

      callback();
    });

  });
};

function getMicroSeconds(time) {
  return (time[0] * 1e9 + time[1]) / 1000;
}

test(function (err) {
  process.exit(err);
});
