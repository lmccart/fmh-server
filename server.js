var express = require('express');
var app = express();
app.set('port', process.env.PORT || 3000);

var server = require('http').Server(app);
server.listen(app.get('port'));

// var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

// Connection URL
var stored_hr; // db collection
var playback_hr;
var start_time;
var end_time;
var total_time;

// Use connect method to connect to the Server
// MongoClient.connect(process.env.MONGOLAB_URI, function(err, db) {
//   assert.equal(null, err);
//   stored_hr = db.collection('hr');
//   console.log("Connected correctly to db");
//   stored_hr.find({}).sort({'timestamp': 1}).toArray(function(err, arr) {
//     playback_hr = arr;
//     console.log('loaded playback');
//     start_time = playback_hr[0].timestamp;
//     end_time = playback_hr[playback_hr.length-1].timestamp;
//     total_time = end_time - start_time;
//     setInterval(updatePlaybackHR, 1000);
//     console.log(start_time, total_time);
//   });
// });

// Add headers
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.use(express.static(__dirname + '/public'));

// var hr = 60;
// var ts;
// var ind = 0;
// app.get('/update_hr', function (req, res) {
//   if (process.env.SERVER_PASS === req.query.pass) {
//     var new_hr = parseInt(req.query.hr, 10);
//     if (new_hr !== 0) {
//       hr = new_hr;
//       var r = { hr: hr, timestamp: new Date().getTime() };
//       stored_hr.insert(r, function(err, result) {
//         assert.equal(err, null);
//         console.log("inserted");
//       });
//     }
//     res.send('thanks');
//   } else {
//     res.send('permission denied: thanks for trying');
//   }
// });

// app.get('/get_hr', function (req, res) {
//   res.json({hr: hr, ts:ts});
// });

// function updatePlaybackHR() {
//   var offset = (Date.now()-end_time)%total_time;
//   ts = start_time + offset;
//   if (ts > playback_hr[ind].timestamp && ind == playback_hr.length - 1) {
//     ind = 0;
//   }
//   for (var i=ind; i<playback_hr.length; i++) {
//     if (playback_hr[i].timestamp < ts) {
//       ind = i;
//     } else {
//       break;
//     }
//   }
//   hr = playback_hr[ind].hr;
// }
