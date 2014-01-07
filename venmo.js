// web.js
var express = require("express");
var logfmt = require("logfmt");
var request = require('request');
var hue = require('./lib/hue.js');
var app = express();
var url = require('url');

app.use(logfmt.requestLogger());

var port = process.env.PORT || 5000;
app.listen(port, function() {
    console.log("Listening on " + port);
});


var light = new hue.Hue.Light(3);
//light.set({ color: 'rgb(255,0,0)' });

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
app.post('/webhook_url', function(req, res) {
  console.log(req.body);
  res.json({});
});
