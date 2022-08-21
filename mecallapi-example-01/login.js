// We will first get the jwt item from localStorage (The localStorage allow to save key/value pairs in a web browser).
// If jwt has value which means that a user is logged in, the web browser will load index.html.
var jwt = localStorage.getItem("jwt");
if (jwt != null) {
  window.location.href = './index.html'
}

/**
 * We create a function login which will execute when user click Login button in login.html.
 *  In this function, we use XMLHttpRequest to request an API for retrieving response in JSON.
 *   If the response status is ok (meaning that login successful),
 *     we will save the accessToken value to jwt in localStorage and show the popup (Sweetalert).
 *      Once the user click ok in the popup, the web browser will load index.html.
 */
function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", "https://www.mecallapi.com/api/login");
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify({
    "username": username,
    "password": password
  }));
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
      const objects = JSON.parse(this.responseText);
      console.log(objects);
      if (objects['status'] == 'ok') {
        localStorage.setItem("jwt", objects['accessToken']);
        Swal.fire({
          text: objects['message'],
          icon: 'success',
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = './index.html';
          }
        });
      } else {
        Swal.fire({
          text: objects['message'],
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    }
  };
  return false;
}