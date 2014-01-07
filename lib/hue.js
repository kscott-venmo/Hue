var hue = function() {

  var endpoint = 'http://10.40.0.119';
  var developer = 'newdeveloper';

  var Light = function( id ) {
    var Color = net.brehaut.Color;
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
          console.log('Light is ' + bool);
          dfd.resolve(response);
        });
        return dfd.promise;
      } else {
        console.log('Light is already '+bool);
      }
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

        xhr = $.ajax({
          url: url,
          type: 'PUT',
          data: JSON.stringify(obj.opts)
        }).done(function(data){
          console.log('data',data);
          xhr = null;
          obj.dfd.resolve(data);
          ajax();
        }.bind(this));
      }
    };

    on( false ); // initialize lightbulb.

    return {
      set: set,
      on: on
    };
  };

  return {
    Light: Light,
  };
}();
