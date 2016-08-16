var map = require('through2-map');
var _ = require('lodash');
var peliasConfig = require( 'pelias-config' ).generate();

var labels = peliasConfig.imports.wofPipNames;

module.exports.create = function() {
  // this function extracts the id, name, placetype, hierarchy, and geometry
  return map.obj(function(wofData) {
    return {
      properties: {
        Id: wofData.properties['wof:id'],
        Name: getName(wofData),
        Placetype: wofData.properties['wof:placetype'],
        Hierarchy: wofData.properties['wof:hierarchy']
      },
      geometry: wofData.geometry
    };

  });
}

// this function is used to verify that a US county QS altname is available
function isUsCounty(wofData) {
  return 'US' === wofData.properties['iso:country'] &&
        'county' === wofData.properties['wof:placetype'] &&
        !_.isUndefined(wofData.properties['qs:a2_alt']);
}

// if this is a US county, use the qs:a2_alt for county
// eg - wof:name = 'Lancaster' and qs:a2_alt = 'Lancaster County', use latter
// If there's a configuration about assigned names, use it exclusively.
function getName(wofData) {

  if (isUsCounty(wofData)) {
    return wofData.properties['qs:a2_alt']
  }
  if (labels) {
    var nameArray = [];
    for (var i=0; i<labels.length; i++) {
      var name = wofData.properties[labels[i]];
      if (Array.isArray(name)) {
        for (var j=0; j<name.length; j++) {
          nameArray.push(name[j]);
        }
      } else {
        nameArray.push(name);
      }
    }
    if (nameArray.length) {
      return nameArray;
    }
  }

  // default behavior
  return wofData.properties['wof:name'];

}
