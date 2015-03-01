
var express = require('express');
var app = express();
app.set('port', process.env.PORT || 3000);

var server = require('http').Server(app);
var io = require('socket.io')(server);
server.listen(app.get('port'));

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

// Connection URL
var stored_hr;

// Use connect method to connect to the Server
MongoClient.connect(process.env.MONGOLAB_URI, function(err, db) {
  assert.equal(null, err);
  stored_hr = db.collection('hr');
  console.log("Connected correctly to db");
});

var hr = 0;


io.on('connection', function (socket) {
  console.log('socket connected');
  io.emit('hr', 100);
});

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8888');

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
  console.log(req.query);
  hr = parseInt(req.query.hr, 10);
  var r = { hr: hr, timestamp: new Date().getTime() };

  stored_hr.insert(r, function(err, result) {
    assert.equal(err, null);
    console.log("inserted");
  });

  res.send('thanks');
});


app.get('/get_hr', function (req, res) {
  res.json({hr: hr});
});




app.use(express.static(__dirname + '/public'));


// var server = app.listen(app.get('port'), function () {
//   console.log('Example app listening at http://%s:%s', server.address().address, server.address().port);
// });