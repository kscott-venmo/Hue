if ( typeof module !== undefined ) {
  // we in node
  var Q = require('q');
  var request = require('request');
  var Color = require('./color.js').Color;
} else {
  var Color = net.brehaut.Color;
}

var Hue = function( opts ) {

  var endpoint = ( opts || {} ).endpoint || 'http://10.40.0.119';
  var developer = ( opts || {} ).developer || 'newdeveloper';


  var Light = function( id ) {
    var url = endpoint+'/api/'+developer+'/lights/'+id+'/state';
    var state, xhr = null, queue = [];

    /*
     * sat is color saturation, from 0 (white) to 255 (full color)
     * bri is brightness, from 0 to 255
     * hue is the hue value, from 0 to 65535
     */
    var parseColor = function(opts) {
      var color = Color(opts.color);
      var hsl = color.toHSL();
      return { on: true, sat: Math.round(hsl.saturation * 255), bri: Math.round(hsl.lightness * 255), hue: Math.round(hsl.hue / 360 * 65535) };
      //var data = {"on":false, "sat":255, "bri":5,"hue":10000};
    };

    var set = function( opts ) {
      if ( ! opts ) { opts = {}; }
      state = true;
      if ( opts.color ) { opts = parseColor(opts); }
      var dfd = Q.defer();
      put( opts ).then(function(response) {
        console.log('Light color is ', opts);
        dfd.resolve(response);
      });
      return dfd.promise;
    };

    var on = function( bool ) {
      if ( state != bool ) { 
        state = bool;
        var dfd = Q.defer();
        put( { on : state } ).then(function(response) {
          console.log('Light state is ' + bool);
          dfd.resolve(response);
        });
        return dfd.promise;
      } else {
        console.log('Light state is already '+bool);
      }
    };

    // convenience method
    var off = function() {
      on(false);
    };

    var put = function( opts ) {
      var dfd = Q.defer();
      queue.push( { dfd : dfd, opts : opts } );
      ajax();
      return dfd.promise;
    };

    // pops an dfd off the queue and processes it.
    var ajax = function() {
      if ( xhr === null && queue.length ) {
        var obj = queue.shift();

        var resolve = function(data) {
          xhr = null;
          obj.dfd.resolve(data);
          ajax();
        };

        var data = JSON.stringify(obj.opts);
        if ( request ) {
          console.log(url);
          console.log(data);
          xhr = request.put({ url: url, body: data }, function(response){
            console.log('response',response);
            resolve(response);               
          }.bind(this));
        } else {
          xhr = $.ajax({
            url: url,
            type: 'PUT',
            data: data
          }).done(resolve.bind(this));
        }
      }
    };

    on( false ); // initialize lightbulb.

    return {
      set: set,
      on: on,
      off: off
    };
  };

  return {
    Light: Light,
  };
}();

/* Export to CommonJS
*/
var module;
if(module) {
  module.exports.Hue = Hue;
}
