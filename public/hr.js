$(document).ready(function() {

  var live = true;
  
  if (live) {
    setInterval(updateLiveHR, 1000);
  } else {
    var data;
    var ind = 0;
    var start_time;
    var total_time;

    $.getJSON('hr.json', function(d, error) {
      data = d;

      start_time = data[0].timestamp;
      total_time = data[data.length-1].timestamp - start_time;

      updatePlaybackHR();
      setInterval(updatePlaybackHR, 1000);
    });
  }

  function updatePlaybackHR() {

    var offset = new Date().getTime()%total_time;

    var past_date = new Date(offset + start_time);

    var m = moment(past_date).tz('America/Chicago');

    $('#clock').html(past_date.getDate()+' March 2015 • '+m.tz('America/Chicago').format('h:mm:ss A'));

    if (data[ind].timestamp > offset + start_time) {
      ind = 0;
    }

    for (var i=ind; i<data.length; i++) {
      if (data[i].timestamp < offset + start_time) {
        ind = i;
      } else {
        break;
      }
    }

    heartrate = data[i].hr;
    // console.log(offset + start_time, ind);
    
    // $('#hr').html(data[ind].hr);
  }

  function updateLiveHR() {

    var date = new Date();
    var m = moment(date)
    var str = m.tz('America/Chicago').format('h:mm:ss A'); 
    $('#clock').html('LIVE • '+str);

    $.getJSON('https://followmyheart.herokuapp.com/get_hr', function(data) {
      // $('#hr').html(data.hr);
      //console.log(data)
      heartrate = data.hr;
    });
  }
});