var tape = require('tape');
var event_stream = require('event-stream');
var path = require('path');
var fs = require('fs-extra');
var _ = require('lodash');

function test_stream(input, testedStream, callback) {
  var input_stream = event_stream.readArray(input);
  var destination_stream = event_stream.writeArray(callback);

  input_stream.pipe(testedStream).pipe(destination_stream);
}

tape('loadJSON tests', function(test) {
  test.test('json should be loaded from file', function(t) {
    var inputRecord = { id: '123456789', path: '123/456/789/123456789.geojson' };

    // create a directory to hold the temporary file
    var tmpDirectory = ['data', '123', '456', '789'];
    fs.mkdirsSync(tmpDirectory.join(path.sep));

    // write the contents to a file
    var filename = tmpDirectory.concat('123456789.geojson').join(path.sep);
    var fileContents = { a: 1, b: 2 };
    fs.writeFileSync(filename, JSON.stringify(fileContents) + '\n');

    var loadJSON = require('../../src/components/loadJSON').create('.');

    test_stream([inputRecord], loadJSON, function(err, actual) {
      // cleanup the tmp directory
      fs.removeSync(tmpDirectory[0]);

      t.deepEqual(actual, [fileContents], 'should be equal');
      t.end();
    });
  });

  test.test('invalid JSON should log an error and not pass along anything', function(t) {
    var inputRecord = { id: '123456789', path: '123/467/789/123456789.geojson' };

    // create a directory to hold the temporary file
    var tmpDirectory = ['data', '123', '456', '789'];
    fs.mkdirsSync(tmpDirectory.join(path.sep));

    // write the contents to a file
    var filename = tmpDirectory.concat('123456789.geojson').join(path.sep);
    fs.writeFileSync(filename, 'this is not json\n');

    var loadJSON = require('../../src/components/loadJSON').create('.');

    test_stream([inputRecord], loadJSON, function(err, actual) {
      // cleanup the tmp directory
      fs.removeSync(tmpDirectory[0]);

      console.log(actual);

      t.deepEqual(actual, [], 'nothing should have been passed along');
      t.end();
    });
  });

  // This test ensures that the path value from the meta file is used, rather than trying to calculate it
  test.test('data is loaded from path which may not be based on id', function(t) {
    var inputRecord = { id: '123456789', path: 'this/is/not/the/id/123456789.geojson' };

    // create a directory to hold the temporary file
    var tmpDirectory = ['data', 'this', 'is', 'not', 'the', 'id'];
    fs.mkdirsSync(tmpDirectory.join(path.sep));

    // write the contents to a file
    var filename = tmpDirectory.concat('123456789.geojson').join(path.sep);
    var fileContents = { a: 1, b: 2 };
    fs.writeFileSync(filename, JSON.stringify(fileContents) + '\n');

    var loadJSON = require('../../src/components/loadJSON').create('.');

    test_stream([inputRecord], loadJSON, function(err, actual) {
      // cleanup the tmp directory
      fs.removeSync(tmpDirectory[0]);

      t.deepEqual(actual, [fileContents], 'should be equal');
      t.end();
    });
  });
});
