var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var searchSchema = new Schema({
  phrase: {
    type: String,
    unique: false
  },
  date: {
    type: Date
  }

})

//middleware goes here
searchSchema.pre('save', function(next) {
  console.log('before save')
  next()
})
searchSchema.post('save', function(next) {
  console.log('after save')

})



var Search = mongoose.model('Search', searchSchema);

module.exports = Search;
