// web.js
var express = require("express");
var logfmt = require("logfmt");
var $ = require('lib/jquery-2.0.3.min.js');
var color = require('lib/color.js');
var q = require('lib/q.js');
var hue = require('lib/hue.js');
var app = express();

app.use(logfmt.requestLogger());

app.get('/', function(req, res) {
    res.send('Hello World!');
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
    console.log("Listening on " + port);
});
