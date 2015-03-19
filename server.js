
var express = require('express');
var app = express();
app.set('port', process.env.PORT || 3000);

var server = require('http').Server(app);
server.listen(app.get('port'));

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

// Connection URL
var stored_hr; // db collection
var playback_hr;
var start_time;
var total_time;

// Use connect method to connect to the Server
MongoClient.connect(process.env.MONGOLAB_URI, function(err, db) {
  assert.equal(null, err);
  stored_hr = db.collection('hr');
  console.log("Connected correctly to db");


  stored_hr.find({}).sort({'timestamp': 1}).toArray(function(err, arr) {
    playback_hr = arr;
    console.log('loaded playback');

    start_time = playback_hr[0].timestamp;
    total_time = playback_hr[playback_hr.length-1].timestamp - start_time;
    setInterval(updatePlaybackHR, 1000);
  });


});

var hr = 60;
var ts;
var ind = 0;


// Add headers
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

app.get('/update_hr', function (req, res) {

  if (process.env.SERVER_PASS === req.query.pass) {
    var new_hr = parseInt(req.query.hr, 10);

    if (new_hr !== 0) {
      hr = new_hr;
      var r = { hr: hr, timestamp: new Date().getTime() };

      stored_hr.insert(r, function(err, result) {
        assert.equal(err, null);
        console.log("inserted");
      });
    }

    res.send('thanks');
  } else {
    res.send('permission denied: thanks for trying');
  }
});


app.get('/get_hr', function (req, res) {
  res.json({hr: hr, ts:ts});
});

app.use(express.static(__dirname + '/public'));

function updatePlaybackHR() {

  var offset = Date.now()%total_time;

  var past_date = new Date(offset + start_time);

  if (playback_hr[ind].timestamp > offset + start_time) {
    ind = 0;
  }

  for (var i=ind; i<playback_hr.length; i++) {
    if (playback_hr[i].timestamp < offset + start_time) {
      ind = i;
    } else {
      break;
    }
  }

  hr = playback_hr[ind].hr;
  ts = playback_hr[ind].timestamp;
}
