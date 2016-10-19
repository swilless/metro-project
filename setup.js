var mongoose = require('mongoose');
var async = require('async');
var models = require('./models');
var config = require('./config.json');
var Favorite = mongoose.model('Favorite');

mongoose.connect(config.mongo.connectionString);

var values = [
  {
      'name': 'Main office commute',
      'allLines': [{
        'lineCode': 'OR',
        'displayName': 'Orange',
      }],
      'startingStation': 'C03',
      'destinationStation': 'K06',
      'transferStation': '',
      'alarmTime': new Date("2016-05-18T08:00:00Z"),
      'frequency': 'daily',
  },
  {
      'name': 'Client site',
      'allLines': [
        {
          'lineCode': 'OR',
          'displayName': 'Orange',
        },
        {
        'lineCode': 'RD',
        'displayName': 'Red',
        }
      ],
      'startingStation': 'C03',
      'destinationStation': 'A15',
      'transferStation': 'A01',
      'alarmTime': new Date("2016-05-18T08:20:00Z"),
      'frequency': 'weekly',
  },
];


async.waterfall([
  function(next) {
    Favorite.remove({},function(err) {
      next(err);
    });
  },
  function(next) {
    async.parallel(
      values.map(function(object) {
        return function(next1) {
          var favorite = new Favorite(object);
          favorite.save(function(err, favorite){
            console.log('imported:',favorite.name);
            next1(err);
          });
        }
      }),
      next
    )
  }
],function(err) {
  if (err) console.error(err);
  process.exit(0);
});
