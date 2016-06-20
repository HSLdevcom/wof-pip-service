var map = require('through2-map');
var simplify = require('simplify-js');

module.exports.create = function() {
  // this function just simplifies the geometry
  return map.obj(function(feature) {
    feature.geometry = simplifyGeometry(feature.geometry);

    return feature;

  });
}

function simplifyGeometry(geometry) {
  if( geometry ) {
    if ('Polygon' === geometry.type) {
      var coordinates = geometry.coordinates[0];
      var simplified = simplifyCoords(coordinates);
      if (simplified.length > 4 || simplified.length == 0) {
        geometry.coordinates[0] = simplified;
      }
    }
    else if ('MultiPolygon' === geometry.type) {
      var polygons = geometry.coordinates;
      polygons.forEach(function simplify(coordinates, idx) {
        var simplified = simplifyCoords(coordinates[0]);
        if (simplified.length > 4 || simplified.length == 0) {
          polygons[idx][0] = simplified;
        }
      });
    }
  }

  return geometry;

}

/**
 * @param {array} coords A 2D GeoJson-style points array.
 * @return {array} A slightly simplified version of `coords`.
 */
function simplifyCoords( coords ){
  var pts = coords.map( function mapToSimplifyFmt( pt ){
    return { x: pt[ 0 ], y: pt[ 1 ] };
  });

  var simplificationRate = 0.0003;
  var simplified = simplify( pts, simplificationRate, true );

  return simplified.map( function mapToGeoJsonFmt( pt ){
    return [ pt.x, pt.y ];
  });
}
