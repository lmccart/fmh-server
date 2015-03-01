  setInterval(updateHR, 100);

  function updateHR() {
    $.getJSON('http://followmyheart.herokuapp.com/get_hr', function(data) {
      $('#hr').html(data.hr);
      console.log(data)
    });
  }