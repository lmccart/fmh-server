$(document).ready(function() {


  setInterval(updateHR, 1000);

  function updateHR() {

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