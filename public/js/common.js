//For every page check for cookies on load
$(function () {
    let cookie = getCookie("UDTLS"); //Checks for user details in cookie
    
    //DEBUG ONLY
    console.log("from getCookie(UDTLS): " + cookie);

    //If a cookie exists then send to server to process
    //Otherwise redirect to login page, if not in login page
    if (cookie == null && window.location.pathname != "/") {
        redirectToLogin();
    }
    else {
        var data = {
            cookie: this.cookie
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
                    if(!accepted && (window.location.pathname != "/" || window.location.pathname != "/login.html")){
                        redirectToLogin();
                    }
                }
            });
        }).catch(function (err) {
            console.log('Fetch Error: ', err);
        });
    }
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
    //Clear cookies and/or session the redirectToLogin()
    redirectToLogin();
}