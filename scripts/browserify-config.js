/*
 |--------------------------------------------------------------------------
 | Browser-sync config file
 |--------------------------------------------------------------------------
 |
 | For up-to-date information about the options:
 |   http://www.browsersync.io/docs/options/
 |
 | There are more options than you see here, these are just the ones that are
 | set internally. See the website for more info.
 |
 |
 */

var urllib = require('url');
var urlParse = urllib.parse;

function isEnabled (val) {
  val = val || '';
  return val !== '' && val !== '0' && val !== 'false' && val !== 'off';
}

function getBoolEnvVar (name, defaultVal) {
  return name in process.env ? isEnabled(name) : defaultVal;
}

function getIntEnvVar (name, defaultVal) {
  return name in process.env ? process.env[name] : defaultVal;
}

var bs = require('browser-sync').create();

var opts = {
  server: {baseDir: './'},
  middleware: [
    function (req, res, next) {
      // Route `dist/aframe.js` to `build/aframe.js` so we can
      // dev against the examples :)
      var path = urlParse(req.url).pathname;
      if (path.indexOf('/' + 'dist/aframe.js') !== -1) {
        req.url = req.url.replace('/dist/', '/build/');
      }
      next();
    }
  ],
  rewriteRules: [],
  files: [
    'examples/**',
    {
      match: ['src/**', 'vendor/**'],
      fn: function (event, file) {
        console.log('matched', event, file);
        if (event === 'change') {

          var browserify = require('browserify');
          var b = browserify();
          b.add('./src/index.js');
          var fs = require('fs');
          b.bundle().pipe(fs.createWriteStream('build/aframe.js'));
          browsersync.reload('build/aframe.js');

        }
        /** Custom event handler **/
        // console.log(event, file);
      }
    }
  ],
  // files: ['build/aframe.js', 'examples/*.html'],
  // watchOptions: {ignoreInitial: true},
  port: getIntEnvVar('PORT', 9000),
  open: getBoolEnvVar('BS_OPEN', false),
  notify: getBoolEnvVar('BS_NOTIFY', false),
  tunnel: getBoolEnvVar('BS_TUNNEL', false),
  minify: getBoolEnvVar('BS_MINIFY', false)
};

bs.init(opts);
