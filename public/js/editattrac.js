var map = L.map('map').setView([51.505, -0.09], 3);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

map.addControl(new L.Control.Search({
    url: 'https://nominatim.openstreetmap.org/search?format=json&q={s}',
    jsonpParam: 'json_callback',
    propertyName: 'display_name',
    propertyLoc: ['lat', 'lon'],
    marker: L.circleMarker([0, 0], { radius: 30 }),
    autoCollapse: true,
    autoType: false,
    minLength: 2
}));

//create pin on click
map.on('click', function (e) {
    if (map.marker != null) {
        map.removeLayer(map.marker);
    }
    map.marker = L.marker(e.latlng).addTo(map);
});

$(function() {
    //create map
    
});

async function loadAttractionInfo(){
    var jsonData = await getAttractionInfo();
    await loadCountriesToList('countrySelect', jsonData.codcountry-1);
}

async function getAttractionInfo(){
    const id = getSearchParam("id");
    var jsonData = null;
    await $.ajax({
        url: '/getAttracInfo',
        type: 'GET',
        data: { id:id },
        success: function (data) {
            jsonData = JSON.parse(data);
            $('#attrac_name').val(jsonData.name);
            $('#imageURL').val(jsonData.imageRef);            
            $('#countrySelect').val(jsonData.codcountry);

            //get lat and lng
            var lat = jsonData.latitude;
            var lng = jsonData.longitude;

            if(map.marker != null) {
                map.removeLayer(map.marker);
            }
            map.marker = L.marker(L.latLng(lat, lng)).addTo(map);

            if(lat != null && lng != null){
                map.setView(map.marker.getLatLng(), 17);
            }
        },
        error: function (data) {
            showErrorMessage(data.responseJSON);
            return;
        }
    });

    //request getAttracTickets
    await $.ajax({
        url: '/getAttracTickets',
        type: 'GET',
        data: { id:id },
        success: function (data) {
            let jsonData = [];
            jsonData = JSON.parse(data);
            var ticketList = $('#ticketsToAdd');
            jsonData.forEach(ticket => {
                var ticketItem = ticketElement(ticket);
                ticketList.append(ticketItem);
            });
        },
        error: function (data) {
            showErrorMessage(data.responseJSON);
            return;
        }
    });

    loadImageURL();
    return jsonData;
}

function ticketElement(ticket){    
    var value = "";
    if(ticket.n_people != null)
         value = "value='" + ticket.n_people + "'";

    return '<li class="list-group-item themedd" id="' + ticket.codticket + '">' +
    '<div class="row" style="padding-bottom: 10px;">' +
        '<div class="col-md-9" style="align-self:center; font-size:large;">' +
            '<input type="text" class="form-control" oninput="markAsUpdate(this, 3)" value="' + ticket.description + '" placeholder="Ticket title" id="ticketName">' +
        '</div>' +
        '<div class="col-md-3">' +
            '<button type="button" class="btndelete btn btn-sm btn-outline-light float-end" onclick="removeEntry(this)">' +
            '<i class="fas fa-times"></i>' +
            '</button>' +
        '</div>' +
    '</div>' +
    '<div class="row">' +
    '<div class="col-md-12">' +
        '<div class="row">' +
            '<div class="col-3">' +
                '<label for="numberPeople">Ticket for:</label>' +
            '</div>' +
            '<div class="col-6">' +
                '<input type="number" onchange="markAsUpdate(this, 5)" value="' + ticket.n_people + '" class="form-control" id="numberPeople" placeholder="No. People" min="1" step="1" required />' +
           ' </div>' +
        '</div>' +
    '</div>' +
    '</div>' +
    '</li>'
}

function addNewTicket() {
    $('#ticketsToAdd').append(
        ticketNewElement(document.getElementById("ticketsToAdd").childElementCount, null, "_n", null, null)
    );
}

function ticketNewElement(id, text, type, date, noPeople){    
    var value = "";
    if(noPeople != null)
         value = "value='" + noPeople + "'";

    return '<li class="list-group-item themedd" id="' + id + type + '">' +
    '<div class="row" style="padding-bottom: 10px;">' +
        '<div class="col-md-9" style="align-self:center; font-size:large;">' +
            '<input type="text" class="form-control" placeholder="Ticket title" id="ticketName">' +
        '</div>' +
        '<div class="col-md-3">' +
            '<button type="button" class="btndelete btn btn-sm btn-outline-light float-end" onclick="removeEntry(this)">' +
            '<i class="fas fa-times"></i>' +
            '</button>' +
        '</div>' +
    '</div>' +
    '<div class="row">' +
    '<div class="col-md-12">' +
        '<div class="row">' +
            '<div class="col-3">' +
                '<label for="numberPeople">Ticket for:</label>' +
            '</div>' +
            '<div class="col-6">' +
                '<input type="number" onchange="markAsUpdate(this)" class="form-control" id="numberPeople" placeholder="No. People" min="1" step="1" required />' +
           ' </div>' +
        '</div>' +
    '</div>' +
    '</div>' +
    '</li>'
}

function loadImageURL(){
    //get url from input
    var url = document.getElementById("imageURL").value;
    //set image source to url
    document.getElementById("attractImage").src = url;
}

function markAsUpdate(id, levels){
    var parent = id;
    for(var i = 0; i < levels; i++){
        parent = parent.parentNode;
    }
    if(!parent.id.includes('_u') && !parent.id.includes('_n'))
        parent.id += '_u';
}

function updateAttraction(){
    ticketsToAdd = [];
    ticketsToUpdate = [];
    ticketsToDelete = [];

    //get param 'id' from url
    var id = getSearchParam('id'); //This is the ID of the trip

    //latitude and longitude from map marker
    var lat = map.marker.getLatLng().lat;
    var lng = map.marker.getLatLng().lng;
    var price = 0;

    //Ajax request to update attraction
    $.ajax({
        url: '/updateAttraction',
        type: 'POST',
        data: {
            id: id,
            name: document.getElementById("attrac_name").value,
            imageSrc: document.getElementById("imageURL").value,
            hasTickets: document.getElementById("ticketsToAdd").childElementCount > 0 ? 1 : 0,
            noTicketPrice: price,
            lat: lat,
            lng: lng,
            country: document.getElementById("countrySelect").value,
        },
        success: function (data) {
            showSuccessMessage(data);
            return;
        },
        error: function (data) {
            showErrorMessage(data.responseJSON);
            return;
        }
    });

    $('#ticketsToAdd>.list-group-item').each(function(index, element){
        var ticket = {
            id: element.id,
            name: $(element).find('#ticketName').val(),
            number: $(element).find('#numberPeople').val() === '' ? 0 : $(element).find('#numberPeople').val()
        };

        //if id contains '_n' then it's a new attrac
        if(ticket.id.includes('_n'))
        {
            ticket.id = ticket.id.replace('_n', '');
            ticketsToAdd.push(ticket);
        }

        if(ticket.id.includes('_u'))
        {
            ticket.id = ticket.id.replace('_u', '');
            ticketsToUpdate.push(ticket);
        }

        if(ticket.id.includes('_d'))
        {
            ticket.id = ticket.id.replace('_d', '');
            ticketsToDelete.push(ticket);
        }
    });

    //flightsToAdd should add each entry to the database as a new tripflight
    ticketsToAdd.forEach(ticket => {
        $.ajax({
            url: '/newTicket',
            type: 'POST',
            data: {
                id: id,
                name: ticket.name,
                number: ticket.number
            },
            error: function (data) {
                showErrorMessage(data.responseJSON);
                return;
            }
        });
    });

    ticketsToUpdate.forEach(ticket => {
        $.ajax({
            url: '/updateTicket',
            type: 'POST',
            data: {
                id: ticket.id,
                name: ticket.name,
                number: ticket.number
            },
            error: function (data) {
                showErrorMessage(data.responseJSON);
                return;
            }
        });
    });

    ticketsToDelete.forEach(ticket => {
        $.ajax({
            url: '/deleteTicket',
            type: 'POST',
            data: { id: ticket.id },
            error: function (data) {
                showErrorMessage(data.responseJSON);
                return;
            }
        });
    });

    redirectPageSuccess('listattractions');
}