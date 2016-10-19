var config = require('./config.json');
var express = require('express');
var models = require('./models');
var routes = require('./routes');
var async = require('async');
var bodyParser = require('body-parser');
var logger = require('morgan');
var http = require('http');
var mongoose = require('mongoose');
var mongoosey = require('mongoosey');
var basicAuth = require('basic-auth');
var nodeCache = require('node-cache');
var multer = require('multer'),
	bodyParser = require('body-parser'),
	path = require('path');

mongoose.connect(config.mongo.connectionString);

var app = express();
app.use(logger('combined'));
app.use(bodyParser.urlencoded({
  extended:true
}));

var adminAuth = function(req, res, next) {
  var user = basicAuth(req);
  console.log(user)
  if (user && user.name && user.pass && user.name === config.express.auth.username && user.pass === config.express.auth.password) {
    next();
  } else {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    res.send(401);
  };
}

app.use(bodyParser.json({}));
app.use(express.static(__dirname + '/public'));
//
// app.post('/api/email',routes.email.saveEmail);
// app.put('/api/email',routes.email.saveEmail);
//
// app.get('/station/:code',routes.metro.getStationStatus);
// app.get('/admin',adminAuth,routes.admin.printForm);
app.get('/api/favorites',routes.favorite.getFavorites);
// app.post('/admin/submit',adminAuth,multer({ dest: 'uploads/'}).single('uploadFile'),routes.admin.submitForm);

mongoosey.use(function(req, res, next) {
  var user = basicAuth(req);
  console.log(user)
  if (user && user.name && user.pass && user.name === config.express.auth.username && user.pass === config.express.auth.password) {
    next();
  } else {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    res.send(401);
  };
});
mongoosey.set('app',app);
mongoosey.set('mongoose',mongoose);

var httpServer = http.createServer(app);
httpServer.listen(config.express.port);

exports.app = app;
