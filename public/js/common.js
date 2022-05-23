var ReqType = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    DELETE: "DELETE"
};

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

function redirectToHome(){
    window.location.href = "/dashboard.html";
}

function redirectToLogin(){
    window.location.href = "/";
}

function logoutUser(){
    //Clear cookies and/or session the redirectToLogin()
    redirectToLogin();
}