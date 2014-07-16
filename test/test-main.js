var __patterns = [
  /jasmine-backbone\.js$/,
  /spec\.js$/
];

var __checkPattern = function(file) {
  for (var i = 0, size =  __patterns.length; i < size; ++i) {
    if (__patterns[i].test(file)) {
      return true;
    }
  }
  return false;
}

var tests = [];
for (var file in window.__karma__.files) {
  if (__checkPattern(file)) {
    tests.push(file);
  }
}

requirejs.config({
  // Karma serves files from '/base'
  baseUrl: '/base/src',

  paths: {
    'backbone': '../components/backbone/backbone',
    'underscore': '../components/underscore/underscore',
    'jquery': '../components/jquery/dist/jquery'
  },

  // ask Require.js to load these files (all our tests)
  deps: tests,

  // start test run, once Require.js is done
  callback: window.__karma__.start
});