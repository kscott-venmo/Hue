var sys = require('sys');
var exec = require('child_process').exec;
var Q = require('q');
var child;

var debug = false;

var runScript = function(script, success, fail) {
  var dfd = Q.defer();
  if ( debug ) {
    console.log('script',script);
  }
  child = exec(script, function (error, stdout, stderr) {
    if ( debug ) {
      console.log('stdout',stdout);
      console.log('stderr',stderr);
      console.log('error',error);
    }

    if (error !== null) {
      dfd.reject(error);
    } else {
      dfd.resolve(stdout);
    }
  });
  return dfd.promise;
};


module.exports = {
  runScript : runScript
};
