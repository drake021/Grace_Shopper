$(document).ready(function() {

    // Form submit function
    $('.login-form form').on('submit', function(event) {
      // Prevent default usage
      event.preventDefault();
  
      if (document.querySelector('.login-form form').checkValidity()) {
        // Getting data from the form
        const loginData = $(this).serializeArray();
  
        // Comparing user data from login form and localStorage
        if (loginData[0].value === localStorage.mdbAdminUserEmail && loginData[1].value === localStorage.mdbAdminUserPass) {
  
          // Setting Log In state if data correct
          localStorage.setItem("mdbAdminUserLogged", true);
          location.reload();
        } else {
  
          // Login error message
          $('#error-modal .modal-body').html('Your email or password is incorrect.');
          $('#error-modal').modal('toggle');
        }
      } else {
  
        // Login error message
        $('#error-modal .modal-body').html('Please provide correct login data.');
        $('#error-modal').modal('toggle');
      }
  
    })
  })

  $(document).ready(function() {

    // checking if item mdbAdminUserLogged exists in localStorage
    if (localStorage.mdbAdminUserLogged === "true") {
      $('.login-form').hide();
      $('.logout-form').show();
      $('.logged-user-message').html(`You are logged in as <strong>${localStorage.mdbAdminUserFirstName} ${localStorage.mdbAdminUserLastName}</strong>!`);
    }
  });

  $(document).ready(function() {
    // Triggering an event
    $('.logout').on('click', () => {
  
      // Setting mdbAdminUserLogged to false
      localStorage.setItem("mdbAdminUserLogged", false);
  
      // Reloading page
      location.reload();
    })
  });

  $(document).ready(function() {
    // Login error message
    $('#error-modal .modal-body').html('Your email or password is incorrect.');
    $('#error-modal').modal('toggle');
  })
