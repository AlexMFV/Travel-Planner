$(function() {
    //create map
    var map = L.map('map').setView([51.505, -0.09], 3);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'}).addTo(map);

    map.addControl( new L.Control.Search({
		url: 'https://nominatim.openstreetmap.org/search?format=json&q={s}',
		jsonpParam: 'json_callback',
		propertyName: 'display_name',
		propertyLoc: ['lat','lon'],
		marker: L.circleMarker([0,0],{radius:30}),
		autoCollapse: true,
		autoType: false,
		minLength: 2
	}) );

    var marker = null;   

    //create pin on click
    map.on('click', function(e) {
        if(marker != null) {
            map.removeLayer(marker);
        }
        marker = L.marker(e.latlng).addTo(map);
        document.getElementById("lat").value = e.latlng.lat;
        document.getElementById("lng").value = e.latlng.lng; 
    });
});

function loadImageURL(){
    //get url from input
    var url = document.getElementById("imageURL").value;
    //set image source to url
    document.getElementById("attractImage").src = url;
}

function addNewTicket() {
    $('#ticketsToAdd').append(ticketElement(1, "Test", "ticket", null, null));
}

function createTicketElement(flight){
    var icon = '<i class="fas fa-plane" style="padding-left: 10px; padding-right: 10px;"></i>';

    $('#selectedFlights').append(
        flightElement(flight.codtripflight, flight.fromName + icon + flight.toName, '', formatDate(flight.date) , flight.value)
    );
}

function ticketElement(id, text, type, date, price){    
    var value = "";
    if(price != null)
         value = "value='" + price + "'";

    return '<li class="list-group-item themedd" id="' + id + type + '">' +
    '<div class="row" style="padding-bottom: 10px;">' +
        '<div class="col-md-9" style="align-self:center; font-size:large;">' +
            text +
        '</div>' +
        '<div class="col-md-3">' +
            '<button type="button" class="btndelete btn btn-sm btn-outline-light float-end" onclick="removeFlight(this)">' +
            '<i class="fas fa-times"></i>' +
            '</button>' +
        '</div>' +
    '</div>' +

    '<div class="row">' +
        '<div class="col-md-6">' +
        //date is not null then add date, otherwise add current date
            '<input type="date" onchange="markAsUpdate(this)" class="form-control" id="date" value="' + (date === null ? new Date().toISOString().slice(0, 10) : date) + '" required>' +
        '</div>' +
        '<div class="col-md-5">' +
            '<input type="number" onchange="markAsUpdate(this)" class="form-control" id="price"' + value + 'placeholder="Price" min="0" step="0.01" required />' +
        '</div>' +
        '<div class="col-md-1 currency">' +
            '<span class="themedd" style="font-size: large">€</span>' +
        '</div>' +
    '</div>' +
    '</li>'
}