// web.js
var express = require("express");
var logfmt = require("logfmt");
var request = require('request');
var hue = require('./lib/hue.js');
var app = express();
var url = require('url');
var com = require('./commands');
var config = require('./config');

app.use(logfmt.requestLogger());

app.use(express.bodyParser());

var port = process.env.PORT || 5000;
app.listen(port, function() {
    console.log("Listening on " + port);
});




var light = new hue.Hue.Light(3);


var monitorRecentPayments = function(user_id) {

    var frequency = 5000;
    var timestamp = 0;
    var getRecentPayments = function(time) {

        var start_time = (new Date()).getTime();
        var script = "./get_recent_payments.sh "+timestamp+" "+user_id;

        // if an error, we fail
        com.runScript(script).then(function(result){
          timestamp = Math.round(result);
          if ( result ) {
            processTimestamp(timestamp);
          }
          var elapsed_time = (new Date()).getTime() - start_time;
          setTimeout(function(){
            getRecentPayments(script, time);
          }, time - elapsed_time);
        }).fail(function(err){
            console.log('There was an error',err);
            console.log('script',script);
        });
    };

    var processTimestamp = function(timestamp) {
      var date = new Date(timestamp*1000);
      console.log('last payment made on',date);
      if (timestamp >= (new Date()).getTime() - frequency) {
        // if payment is within frequency, flash green
        console.log('flash!');
      }
    };

    getRecentPayments(frequency);
};
monitorRecentPayments(config.kevin);



/*
app.get('/webhook_url', function(req, res) {
  var parts = url.parse(req.url, true);
  var query = parts.query;
  var venmo_challenge = query.venmo_challenge;
  res.send(venmo_challenge);
});


*/
/*
 * payment
 *  date_created
 *  type
 *  data
 *    status: settled | pending | failed
 *    id
 */
/*
app.post('/webhook_url', function(req, res) {
  console.log('webhook request', req.body);
  res.json({});
  var payment = req.body;
  var color;
  switch(payment.data.status) {
    case 'failed' :
      color = 'rgb(255,0,0)';
      break;
    case 'pending' :
      color = 'rgb(255,0,255)';
      break;
    case 'settled' :
      color = 'rgb(0,255,0)';
      break;
  }
  if ( color ) {
    light.set({ color: color });
    setTimeout(function(){
      light.set({ color: 'rgb(255,0,0)' });
    },1000);
  }
});

*/
