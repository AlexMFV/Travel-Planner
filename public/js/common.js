//For every page check for cookies on load
addEventListener("DOMContentLoaded", async function() {
    let cookie = getCookie("UDTLS"); //Checks for user details in cookie

    //If a cookie exists then send to server to process
    //Otherwise redirect to login page, if not in login page
    if (cookie == "" && window.location.pathname != "/") {
        redirectToLogin();
    }
    else {
        var data = {
            cookie: cookie
        };

        await fetch('/checkCookie', getHeader(data, ReqType.POST)).then(function (res) {
            if (res.status !== 200) {
                console.log('There was a problem. Status Code: ' +
                    res.status);
                return;
            }

            res.json().then(function (accepted) {
                //If in login page, then redirect to home page
                if (accepted && (window.location.pathname == "/" || window.location.pathname == "/login.html")) {
                    redirectToHome();
                }
                else{
                    if(!accepted && (window.location.pathname != "/" && window.location.pathname != "/login.html")){
                        redirectToLogin();
                    }
                }
            });
        }).catch(function (err) {
            console.log('Fetch Error: ', err);
        });
    }

    checkMessages();
});

var ReqType = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    DELETE: "DELETE"
};

function getCookie(cookie) {
    return ('; ' + document.cookie).split(`; ${cookie}=`).pop().split(';')[0];
}

function setCookie(cookie, content) {
    document.cookie = cookie + "=" + content + ";";
}

function deleteCookie(cookie) {
    document.cookie = cookie + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
}

function getHeader(data, type) {
    const options = {
        method: type,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    };

    return options;
}

function redirectToHome() {
    window.location.href = "/dashboard.html";
}

function redirectToLogin() {
    window.location.href = "/";
}

function logoutUser() {
    deleteCookie("UDTLS");

    //Request the server with /logout
    // and delete the session
    /* req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
        res.redirect('/');
    }); */

    redirectToLogin();
}

function getUsername() {
    return getCookie("UDTLS_USERNAME");
}

function getName(){
    return getCookie("UDTLS_USER");
}

function showErrorMessage(message) {
    const alert = "<div id=\"alert1\" class=\"alert alert-danger alert-dismissible\" role=\"alert\">" + message +
    "<button type=\"button\" class=\"btn-close\" data-bs-dismiss=\"alert\" aria-label=\"Close\"></button></div>";

    document.getElementById("error").innerHTML = alert;
}

function showSuccessMessage(message) {
    const alert = "<div id=\"alert1\" class=\"alert alert-success alert-dismissible\" role=\"alert\">" + message +
    "<button type=\"button\" class=\"btn-close\" data-bs-dismiss=\"alert\" aria-label=\"Close\"></button></div>";

    document.getElementById("error").innerHTML = alert;
}

function deleteErrorMessage() {
    document.getElementById("error").innerHTML = "";
}

function checkMessages(){
    const success = getSearchParam("success");
    if(success){
        showSuccessMessage("The record was created successfully!");
    }
}

function getSearchParam(param){
    var url_string = window.location.href;
    var url = new URL(url_string);
    return url.searchParams.get(param);
}

async function getAllTrips() {
    await $.ajax({
        type: 'GET',
        url: '/allTrips',
        data: {},
        success: function (data) {
            if (data != null && data != undefined) {
                glob.trips = JSON.parse(data);
            }
        },
        error: function (data) {
            showErrorMessage(data.responseJSON);
        }
    });
}

async function getAllCountries() {
    await $.ajax({
        type: 'GET',
        url: '/allCountries',
        data: {},
        success: function (data) {
            if (data != null && data != undefined) {
                glob.countries = JSON.parse(data);
            }
        },
        error: function (data) {
            showErrorMessage(data.responseJSON);
        }
    });
}