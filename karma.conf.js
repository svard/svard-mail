// Karma configuration

// base path, that will be used to resolve files and exclude
basePath = '';

// list of files / patterns to load in the browser
files = [
  JASMINE,
  JASMINE_ADAPTER,
  'app/components/angular/angular.js',
  'app/components/angular-resource/angular-resource.js',
  'app/components/angular-mocks/angular-mocks.js',
  'app/components/angular-route/angular-route.js',
  'app/components/underscore/underscore.js',
  'app/scripts/*.js',
  'app/scripts/**/*.js',
  'app/views/templates/*.html',
  'test/mock/**/*.js',
  'test/spec/**/*.js',
];

preprocessors = {
  'app/views/templates/*.html': 'html2js'
};

ngHtml2JsPreprocessor = {
  // strip this from the file path
  stripPrefix: 'app/',
  // prepend this to the
  // prependPrefix: 'app/',

  // or define a custom transform function
  // cacheIdFromPath: function(filepath) {
  //   return cacheId;
  // },

  // setting this option will create only a single module that contains templates
  // from all the files, so you can load them all with module('foo')
  // moduleName: 'foo'
}

// list of files to exclude
exclude = [];

// test results reporter to use
// possible values: dots || progress || growl
reporters = ['progress'];

// web server port
port = 8585;

// cli runner port
runnerPort = 9100;

// enable / disable colors in the output (reporters and logs)
colors = true;

// level of logging
// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
logLevel = LOG_INFO;

// enable / disable watching file and executing tests whenever any file changes
autoWatch = false;

// Start these browsers, currently available:
// - Chrome
// - ChromeCanary
// - Firefox
// - Opera
// - Safari (only Mac)
// - PhantomJS
// - IE (only Windows)
browsers = ['PhantomJS'];

// If browser does not capture in given timeout [ms], kill it
captureTimeout = 5000;

// Continuous Integration mode
// if true, it capture browsers, run tests and exit
singleRun = true;
reporters = ['dots', 'junit'];
junitReporter = {
  outputFile: 'test-results.xml'
};