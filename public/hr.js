$(document).ready(function() {

  var live = false;
  var timestamp;
  
  if (live) {
    setInterval(updateLiveHR, 1000);
  } else {
    var data;
    var ind = 0;
    var start_time;
    var total_time;

    $.getJSON('hr-all.json', function(d, error) {
      data = d;

      start_time = data[0][0];
      total_time = data[data.length-1][0] - start_time;

      updatePlaybackHR();
      setInterval(updatePlaybackHR, 1000);
    });
  }


  function updatePlaybackHR() {

    var offset = new Date().getTime()%total_time;

    var past_date = new Date(offset + start_time);

    var m = moment(past_date).tz('America/Chicago');

    $('#clock').html(past_date.getDate()+' March 2015 • '+m.tz('America/Chicago').format('h:mm:ss A'));

    if (data[ind][0] > offset + start_time) {
      ind = 0;
    }

    for (var i=ind; i<data.length; i++) {
      if (data[i][0] < offset + start_time) {
        ind = i;
      } else {
        break;
      }
    }

    heartrate = data[i][1];
  }

  function updateLiveHR() {

    if (timestamp) {
      var now_time = Date.now();
      if (!last_time) last_time = now_time;
      timestamp += now_time - last_time;
      last_time = now_time;

      var date = new Date(timestamp);
      var m = moment(date).tz('America/Chicago'); 
      // console.log(m.tz('America/Chicago'));
      $('#clock').html(m.format('D')+' March 2015 • '+m.format('h:mm:ss A'));
    } else {
      last_time = Date.now();
    }

    // if (live) { // LIVE
    //   var date = new Date();
    //   var m = moment(date)
    //   var str = m.tz('America/Chicago').format('h:mm:ss A'); 
    //   $('#clock').html('LIVE • '+str);
    // }
    $.getJSON('https://followmyheart.herokuapp.com/get_hr', function(data) {
    //$.getJSON('/get_hr', function(data) {
      //console.log(data)
      heartrate = data.hr;
      if (!timestamp) timestamp = data.ts;
    });
  }
});