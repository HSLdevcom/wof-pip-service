'use strict';

var fs = require('fs');
var path = require( 'path' );

var async = require('async');
var deep = require( 'deep-diff' );

var createPIPService = require('../src/index.js').create;

/*
 * Only run some layers to speed up the tests
 */
var layers = [
  //'continent',
  'country', // 216
  //'county', // 18166
  'dependency', // 39
  'disputed', // 39
  //'localadmin', // 106880
  //'locality', // 160372
  'macrocounty', // 350
  'macroregion', // 82
  //'neighbourhood', // 62936
  'region' // 4698
];

function test(callback) {
  createPIPService(layers, function (err, pipService) {
    var basePath = path.resolve(__dirname);
    var inputDataPath = basePath + '/data/layerTestData.json';
    var inputData = require( inputDataPath );
    var results = [];
    var expectedPath = basePath + '/data/expectedLayerTestResults.json';

    async.forEach(inputData, function (location, done) {
      pipService.lookup(location.latitude, location.longitude, function (err, result) {
        results.push(result);
        done();
      }, location.layers);
    },
    function end() {
      var expected = JSON.parse(fs.readFileSync(expectedPath));

      // uncomment this to write the actual results to the expected file
      // make sure they look ok though. semicolon left off so jshint reminds you
      // not to commit this line
      //fs.writeFileSync(expectedPath, JSON.stringify(results, null, 2))

      var diff = deep(sortResults(expected), sortResults(results));

      pipService.end();

      if (diff) {
        console.log('expected and actual output are different');
        console.log(diff);
      }
      else {
        console.log('expected and actual output are the same');       
      }
      callback();
    });
  });

  /**
   * Sort result arrays which look like this
   *
   * [ [{Id:1}, {Id:2}, {Id:3}], [{Id:5}, {Id:6], [{Id:7}, {Id:8}, {Id:9}] ]
   */
  function sortResults(results) {
    // sort the individual result arrays
    results.forEach(function (a) {
      a.sort(function (a, b) {
        if (a.Id > b.Id) return 1;
        if (a.Id < b.Id) return -1;
        return 0;
      });
    });

    results.sort(function (a, b) {
      if (a[0].Id > b[0].Id) return 1;
      if (a[0].Id < b[0].Id) return -1;
      return 0;
    });

    return results;
  }
};


test(function (err) {
  process.exit(err);
});