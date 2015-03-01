$(document).ready(function() {
  var data;
  var ind = 0;
  var start_time;
  var total_time;

  $.getJSON('hr.json', function(d, error) {
    data = d;

    start_time = data[0].timestamp;
    total_time = data[data.length-1].timestamp - start_time;

    updateHR();
  });


  setInterval(updateHR, 100);

  function updateHR() {

    var offset = new Date().getTime()%total_time;

    var past_date = new Date(offset + start_time);
    var mins = past_date.getMinutes().toString();
    if (mins.length == 1) mins = '0'+mins;
    var secs = past_date.getSeconds().toString();
    if (secs.length == 1) mins = '0'+mins;
    
    $('#clock').html(past_date.getHours()+':'+mins+':'+secs);

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
    console.log(offset + start_time, ind);
    
    $('#hr').html(data[ind].hr);
  }
});