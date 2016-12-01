> This repository is part of the [Pelias](https://github.com/pelias/pelias) project. Pelias is an open-source, open-data geocoder built by [Mapzen](https://www.mapzen.com/) that also powers [Mapzen Search](https://mapzen.com/projects/search). Our official user documentation is [here](https://mapzen.com/documentation/search/).

# Who's on First (WOF) Point-in-Polygon service

![TravisCI Status](https://travis-ci.org/pelias/wof-pip-service.svg)
![Gitter badge](https://camo.githubusercontent.com/35e0282de601f7bfa5336efc0328f196b86eff5f/68747470733a2f2f6261646765732e6769747465722e696d2f70656c6961732f70656c6961732e737667)

## Overview
This is a point-in-polygon service that uses [Who's on First](http://whosonfirst.mapzen.com/)
data. It's used by the [pelias/wof-admin-lookup](https://github.com/pelias/wof-admin-lookup)
package to perform admin lookup.

There are two modes of operation: a Node.js library to perform point-in-polygon
lookup with [pelias/polygon-lookup](https://github.com/pelias/polygon-lookup),
and an HTTP server that uses this library.

__Notes:__
- [simplify-js](https://github.com/mourner/simplify-js) is used due to the size of the Who's on First data. Without it, Node.js will run out of memory.

## Configuration

This module uses settings found in [Pelias config](https://www.npmjs.com/package/pelias-config) to locate the Who's on First data using the `imports.whosonfirst.datapath` entry value.  Here's an example:

```
...
"imports": {
  "whosonfirst": {
    "datapath": "<WOF DATA DIRECTORY>"
  }
}
...
```

## Downloading Data

To download data, use `npm run download` from [pelias/whosonfirst](https://www.npmjs.com/package/pelias-whosonfirst).  In order to reduce duplicate code between Pelias modules, there is no script to download data in this module.  
