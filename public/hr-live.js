  setInterval(updateHR, 100);

  function updateHR() {
    $.getJSON('https://followmyheart.herokuapp.com/get_hr', function(data) {
      $('#hr').html(data.hr);
      console.log(data)
    });
  }