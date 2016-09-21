['metro'].forEach(function(inc) {
  module.exports[inc] = require('./' + inc);
});
