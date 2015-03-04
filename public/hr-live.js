$(document).ready(function() {


  setInterval(updateHR, 1000);

  function updateHR() {

    var date = new Date();
    var mins = date.getMinutes().toString();
    if (mins.length == 1) mins = '0'+mins;
    var secs = date.getSeconds().toString();
    if (secs.length == 1) secs = '0'+secs;
    
    var ampm = date.getHours() < 12 ? ' AM' : ' PM';
    $('#clock').html('LIVE • '+date.getHours()%12+':'+mins+':'+secs+ampm);


    $.getJSON('https://followmyheart.herokuapp.com/get_hr', function(data) {
      // $('#hr').html(data.hr);
      //console.log(data)
      heartrate = data.hr;
    });
  }
});