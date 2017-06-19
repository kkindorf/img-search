var express = require('express');
var hbs = require('express-handlebars');
var mongoose = require('mongoose');
var Search = require('./models/search');
var config = require('./config');
var request = require('request');

mongoose.connect(config.DATABASE_URL);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: We are not connected Scotty!'));
db.once('open', function() {
  console.log('we have lift off')
});

var app = express();
var port = config.PORT;
app.use(express.static(__dirname + '/public'));

app.engine('.hbs', hbs({extname: '.hbs', defaultLayout: 'main'}));
app.set('view engine', '.hbs');

app.get('/', function(req, res, next) {
 res.render('index')
})

app.get('/imagesearch/:term', function(req, res, next) {
  var term = req.params.term;
  term = replaceSpaces(term);
  var offset = req.query.offset;
  Search.create({phrase: term, date: Date.now()})
  request('http://api.giphy.com/v1/gifs/search?q='+term+'&offset='+offset+'&api_key=dc6zaTOxFJmzC', function(err, response, body) {
    var b = JSON.parse(body);
    var dataLength = b.data.length;

    if(dataLength > 0) {
      var arr = [];
      var caption;
      for(var i = 0; i < dataLength; i++) {
        if(!b.data[i].caption){
          caption = 'No Caption Available';
        }
        else {
          caption = b.data[i].caption;
        }
        arr.push({pageUrl: b.data[i].url, imgUrl: b.data[i].images.original.url, caption: caption})
      }
      res.status(200).json(arr)
    }
    else {
      res.status(500).json({message: 'your request did not return any results. Please try again'})
    }
  });

});

app.get('/recentSearches', function(req, res, next) {
  Search.find(function(err, items) {
    if(err) {
      res.status(501).json({message: 'Something wrong just happened.'})
    }
    res.status(200).json({items})

  }).limit(10).sort({date: -1})

})
app.listen(port, function() {
  console.log('app listening on port '+port)
})
var replaceSpaces = function(str) {
  return str.replace(/\s/g, '+')
}
