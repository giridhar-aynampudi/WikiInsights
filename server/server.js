var express = require('express');
var path = require('path');
var http = require('http');
var bodyParser = require("body-parser");
var session = require('express-session');


var router = require('./router/router');

var app = express();

app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));

router(app);

const appPath = path.join(__dirname, "..", "dist");
app.use(express.static(appPath));

app.get('*', function(req, res) {
  res.sendFile(path.resolve(appPath, 'index.html'));
});

app.use(function(error, req, res, next) {
  const statusCode =
    !res.statusCode || res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({ message: error.message });
});

var port = 3000
var server = http.createServer(app);
server.listen(port, function() {
  console.log(`Application listening to port ${port}`);
});

module.exports = app;
