
var jwt = localStorage.getItem("jwt");
var slug = localStorage.getItem("slug");

function login() {
  const env = document.getElementById("env-input").value;
  const slug = document.getElementById("slug-input").value;
  const email = document.getElementById("email-input").value;
  const password = document.getElementById("password-input").value;

  console.log(env);
  console.log(slug);
  console.log(email);
  console.log(password);

  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", "https://umbrella-dev.yojee.com/api/v3/auth/signin");
  xhttp.setRequestHeader("company_slug", slug);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify({
    "email": email,
    "password": password
  }));
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4) {
      const res = JSON.parse(this.responseText);
      if (this.status === 200) {
        console.log(res);
        localStorage.setItem("jwt", res.data.jwt_tokens.access_token);
        localStorage.setItem("slug", slug);
        Swal.fire({
          text: `${res.data.name}`,
          icon: 'success',
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.isConfirmed) {
            console.log('result.isConfirmed: ', result.isConfirmed)
            loadTemplates();
          }
        });
      } else {
        Swal.fire({
          text: res['message'],
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    }
  };
  return false;
}

function loadTemplates() {
  console.log('Loading active templates ...');
  jwt = localStorage.getItem("jwt");
  slug = localStorage.getItem("slug");
  const templatesSelectEle = document.getElementById("templates-select");

  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", "https://umbrella-dev.yojee.com/api/v4/company/templates/active");
  xhttp.setRequestHeader("company_slug", slug);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.setRequestHeader("Authorization", "Bearer " + jwt);
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
      const res = JSON.parse(this.responseText);
      if (this.status === 200) {
        console.log(res.data);
        let templateList = res.data;
        let options = templateList.map(template => `<option value=${template.id}>${template.template_type_name}</option>`).join('\n');
        templatesSelectEle.innerHTML = options;
      }
    }
  }
  return false;
}

function loginAndFetchTemplate() {
  login();
  loadTemplates();
}

function downloadTemplate() {
  console.log('Download template ...');
  slug = localStorage.getItem("slug");
  const templatesSelectEle = document.getElementById("templates-select");
  const templateId = templatesSelectEle.value;
  const downloadURL = `https://umbrella-dev.yojee.com/api/v4/public/orders/download_sample?company_slug=${slug}&format=csv&template_id=${templateId}`
  console.log(templateId);
  console.log(downloadURL);

  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", downloadURL);
  xhttp.send();
  xhttp.onreadystatechange = function () {
    console.log(this);

    if (this.readyState == 4) {
      if (this.status === 200) {
        console.log(`Download Completed`);
        var hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(this.response);
        hiddenElement.target = '_blank';
        hiddenElement.download = 'template.csv';
        hiddenElement.downloadURL = "template"
        hiddenElement.click();
      }
    }
  }
  return false;
}

function generate() {
  // [1] Download template csv
  downloadTemplate();
  // [2] Generate csv
  const noItemsNeeded = document.getElementById('no-line-item-input').value;
  console.log(noItemsNeeded);

  return false;
}
