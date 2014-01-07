// web.js
var express = require("express");
var logfmt = require("logfmt");
var request = require('request');
var hue = require('./lib/hue.js');
var app = express();
var url = require('url');

app.use(logfmt.requestLogger());

app.use(express.bodyParser());

var port = process.env.PORT || 5000;
app.listen(port, function() {
    console.log("Listening on " + port);
});


var light = new hue.Hue.Light(3);

/*
app.get('/', function(req, res) {
    res.send('Hello World!');
});
*/

app.get('/webhook_url', function(req, res) {
  var parts = url.parse(req.url, true);
  var query = parts.query;
  var venmo_challenge = query.venmo_challenge;
  res.send(venmo_challenge);
});


/*
 * payment
 *  date_created
 *  type
 *  data
 *    status: settled | pending | failed
 *    id
 */
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
