async function processLogin()
{
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var remember = document.getElementById("remember").checked;

    var data = {
        user: username,
        pass: password,
        save: remember
    };

    await fetch('/login', getHeader(data, ReqType.POST)).then(function (res) {
        if (res.status !== 200) {
          console.log('There was a problem. Status Code: ' +
            res.status);
          return;
        }
  
        res.json().then(function (exists) {
          if (exists) {
            //Change this to Modal
            //const cookie = new Cookies(); //Instantiate the cookie
            //let id = uuidv4(); //Create UUID for the DB
            //let cookieID = uuidv4(); //Create the cookie UUID

            //glob.createCookies(cookie, id, cookieID, user, pass);
            redirectToHome(history);
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