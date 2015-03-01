  setInterval(updateHR, 100);

  function updateHR() {
    $.getJSON('/get_hr', function(data) {
      $('#hr').html(data.hr);
      console.log(data)
    });
  }