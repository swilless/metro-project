var mongoose = require('mongoose');
var models = require('../models');
var config = require('../config.json');
var Favorite = mongoose.model('Favorite');


var db = mongoose.createConnection(config.mongo.connectionString);

exports.getFavorites = function(req,res,next){
  Favorite.find().sort({'order': 1}).exec(function(err,favorites){
    if (err) {
      next(err);
    } else {
      res.send(favorites);
    }
  });
}
