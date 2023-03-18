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

function showWarningMessage(message) {
    const alert = "<div id=\"alert1\" class=\"alert alert-warning alert-dismissible\" role=\"alert\">" + message +
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

function redirectSuccess(){
    window.location.href += "?success=true";
}

function redirectPageSuccess(page){
    if(page.includes(".html"))
        window.location.href = "/" + page + "?success=true";
    else
        window.location.href = "/" + page + ".html?success=true";
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

async function getAllFlights() {
    await $.ajax({
        type: 'GET',
        url: '/allFlights',
        data: {},
        success: function (data) {
            if (data != null && data != undefined) {
                glob.flights = JSON.parse(data);
            }
        },
        error: function (data) {
            showErrorMessage(data.responseJSON);
        }
    });
}

async function getAllAttractions() {
    await $.ajax({
        type: 'GET',
        url: '/allAttractions',
        data: {},
        success: function (data) {
            if (data != null && data != undefined) {
                glob.attractions = JSON.parse(data);
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

async function getCountriesEssencial(){
    await $.ajax({
        type: 'GET',
        url: '/countriesEssencial',
        data: {},
        success: function (data) {
            if (data != null && data != undefined) {
                glob.loc_countries = JSON.parse(data);
            }
        },
        error: function (data) {
            showErrorMessage(data.responseJSON);
        }
    });
}

async function getAllTripFlights(id){
    await $.ajax({
        type: 'GET',
        url: '/allTripFlights',
        data: {id: id},
        success: function (data) {
            if (data != null && data != undefined) {
                glob.tripFlights = JSON.parse(data);
            }
        },
        error: function (data) {
            showErrorMessage(data.responseJSON);
        }
    });
}

function forceReloadTable(tableId, data){
    if(data != null && data != undefined)
        $('#'+tableId).DataTable().clear().rows.add(data).draw();
}

function appendItems(selector, tag){
    $('#'+selector).append(tag);
}

//Load Data
async function loadCountries(){
    await getAllCountries();
    forceReloadTable("listTable", glob.countries);
}

async function loadTrips(){
    await getAllTrips();
    forceReloadTable("listTable", glob.trips);
}

async function loadFlights(){
    await getAllFlights();
    forceReloadTable("listTable", glob.flights);
}

async function loadAttractions(){
    await getAllAttractions();
    forceReloadTable("listTable", glob.attractions);
}

async function loadTripInfo(){
    const id = getSearchParam("id");

    await getAllFlights();
    await getAllTripFlights(id);
    //await getAllRestaurants();
    //await getAllAttractions();
    
    //await getTripFlights();

    glob.flights.forEach(flight => {        
        appendItems('flightsToAdd',
        '<li id="' + flight.id + '" class="list-group-item d-flex align-items-center">' +
        flight.from_name +
        '<i class="fas fa-plane" style="padding-left: 10px; padding-right: 10px;"></i>' +
        flight.to_name +
        '</li>');
    });

    glob.tripFlights.forEach(flight => {
        createFlightElement(flight);
    });
}

async function loadCountryLists(){
    //var values = glob.loc_countries
    await getCountriesEssencial();

    var ids = []
    var values = []

    await glob.loc_countries.forEach((value) => {
        ids.push(value.codcountry);
        values.push(value.name);
    });

    await addDataToList("country_from", values, ids);
    await addDataToList("country_to", values, ids);
}

async function loadCountriesToList(listId){
    await getCountriesEssencial();

    var ids = []
    var values = []

    await glob.loc_countries.forEach((value) => {
        ids.push(value.codcountry);
        values.push(value.name);
    });

    await addDataToListGeneric(listId, values, ids);
}

async function loadCountriesToList(listId, defaultId){
    await getCountriesEssencial();

    var ids = []
    var values = []

    await glob.loc_countries.forEach((value) => {
        ids.push(value.codcountry);
        values.push(value.name);
    });

    await addDataToListGeneric(listId, values, ids, defaultId);
}

async function addDataToListGeneric(listId, data, ids){
    const list = document.getElementById(listId);
    list.innerHTML = "";

    data.forEach((value, idx) => {
        const option = document.createElement("option");
        option.innerHTML = value;
        option.value = ids[idx];
        list.add(option);
    });

    list.selectedIndex = 0;
    
    dselect(list, {
        search: true
    });
}

async function addDataToListGeneric(listId, data, ids, defaultId){
    const list = document.getElementById(listId);
    list.innerHTML = "";

    data.forEach((value, idx) => {
        const option = document.createElement("option");
        option.innerHTML = value;
        option.value = ids[idx];
        list.add(option);
    });

    list.selectedIndex = defaultId;
    
    dselect(list, {
        search: true
    });
}

async function addDataToList(listId, data, ids){
    const list = document.getElementById(listId);
    list.innerHTML = "";

    data.forEach((value, idx) => {
        const option = document.createElement("option");
        option.innerHTML = value;
        option.value = ids[idx];
        list.add(option);
    });

    switch(listId){
        case 'country_from': list.selectedIndex = 176; break;
        case 'country_to': list.selectedIndex = 231; break;
        default: list.selectedIndex = 0; break;
    }

    dselect(list, {
        search: true
    });
}

async function selectedIdChanged(){
    const elem1 = document.getElementById("country_from");
    const elem2 = document.getElementById("country_to");

    const idx1 = elem1.selectedIndex;
    const idx2 = elem2.selectedIndex;

    var name1 = glob.loc_countries[idx1].name;
    var lat1 = glob.loc_countries[idx1].latitude;
    var long1 = glob.loc_countries[idx1].longitude;

    var name2 = glob.loc_countries[idx2].name;
    var lat2 = glob.loc_countries[idx2].latitude;
    var long2 = glob.loc_countries[idx2].longitude;

    updateMapData(name1, lat1, long1, name2, lat2, long2);
}

function formatDate(date){
    return new Date(date).toISOString().slice(0,10);
}