var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  // schema database fields
  'name': {
    'type': String,
    'default': ''
  },
  'allLines': [
    {
      'lineCode': {
        'type': String,
        'default': ''
      },
      'displayName': {
        'type': String,
        'default': ''
      }
    }
  ],
  'startingStation': {
    'type': String,
    'default': ''
  },
  'destinationStation': {
    'type': String,
    'default': ''
  },
  'transferStation': {
    'type': String,
    'default': ''
  },
  'alarmTime': {
    'type': Date,
    'default': ''
  },
  'frequency': {
    'type': String,
    'default': ''
  }
});

var Favorite = mongoose.model('Favorite',schema);
