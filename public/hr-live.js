$(document).ready(function() {

  $('#clock').html('LIVE');

  setInterval(updateHR, 1000);

  function updateHR() {
    $.getJSON('https://followmyheart.herokuapp.com/get_hr', function(data) {
      $('#hr').html(data.hr);
      //console.log(data)
    });
  }
});