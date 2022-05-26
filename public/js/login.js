async function processLogin()
{
    var username = document.getElementById("username").value.toUpperCase();
    var password = document.getElementById("password").value;
    var remember = document.getElementById("remember").checked;

    var data = {
        user: username,
        pass: password
    };

    await fetch('/login', getHeader(data, ReqType.POST)).then(function (res) {
        if (res.status !== 200) {
          console.log('There was a problem. Status Code: ' +
            res.status);
          return;
        }
  
        res.json().then(function (data) {
          if (data.exists) {

            setCookie("UDTLS", data.cookie);
            setCookie("UDTLS_USER", data.user.first_name + " " + data.user.last_name);
            setCookie("UDTLS_USERNAME", data.user.username);
            //setCookie("UDTLS_PIC", data.user.picture);

            redirectToHome();
          }
          else {
            //Change to a modal 👀
            alert("Incorrect details, please try again!");
          }
        });
      }).catch(function (err) {
        console.log('Fetch Error: ', err);
      });
}