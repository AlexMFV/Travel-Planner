var marker = null;

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

    //create pin on click
    map.on('click', function(e) {
        if(marker != null) {
            map.removeLayer(marker);
        }
        marker = L.marker(e.latlng).addTo(map);
        //document.getElementById("lat").value = e.latlng.lat;
        //document.getElementById("lng").value = e.latlng.lng; 
    });
});

function loadImageURL(){
    //get url from input
    var url = document.getElementById("imageURL").value;
    //set image source to url
    document.getElementById("attractImage").src = url;
}

function addNewTicket() {
    $('#ticketsToAdd').append(
        ticketElement(document.getElementById("ticketsToAdd").childElementCount, null, "_n", null, null)
    );
}

function ticketElement(id, text, type, date, noPeople){    
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

function markAsUpdate(id){
    var parent = id.parentNode.parentNode.parentNode.parentNode.parentNode;
    if(!parent.id.includes('_u') && !parent.id.includes('_n'))
        parent.id += '_u';
}

async function checkInputs() {
    const attracNameField = document.getElementById("attrac_name");
    const attracNameValue = attracNameField.value.trim();
    const countryValue = document.getElementById("countrySelect").value;

    let missingValues = false;

    attracNameField.style.border = "1px solid #d9dee3";
    if (attracNameValue == null || attracNameValue == "") {
        showErrorMessage("Please complete all the mandatory fields!");
        attracNameField.style.border = "1px solid red";
        missingValues = true;
    }

    // Check if attraction image source is empty or default "no image found" source
    let imageSrc = "";
    const attractImageSrc = document.getElementById("attractImage").src;
    if (attractImageSrc && attractImageSrc !== "https://www.ncenet.com/wp-content/uploads/2020/04/No-image-found.jpg") {
        imageSrc = attractImageSrc;
    }

    // Get ticket information
    const ticketList = [];
    $('#ticketsToAdd>.list-group-item').each(function(index, element){
        $(element).find('#ticketName').css("border", "1px solid #d9dee3"); //clean up the border
        $(element).find('#numberPeople').css("border", "1px solid #d9dee3"); //clean up the border

        var ticket = {
            name: $(element).find('#ticketName').val(),
            number: $(element).find('#numberPeople').val() === '' ? 0 : $(element).find('#numberPeople').val()
        };

        if(ticket.name == '')
        {
            $(element).find('#ticketName').css("border", "1px solid red");
            missingValues = true;
        }

        if(ticket.number == 0)
        {
            $(element).find('#numberPeople').css("border", "1px solid red");
            missingValues = true;
        }

        ticketList.push(ticket);
    });

    if(missingValues)
    {
        showErrorMessage("Please complete all the mandatory fields!");
        return false;
    }

    var imageURL = document.getElementById("imageURL").value;
    var hasTickets = ticketList.length > 0;
    var price = 0; //This should be the price of the attraction apart from ticket prices like entry, maybe we can remove it and use tickets as entry or something

    //if marker exists, change the values to the new ones, else make them 0
    var newLat = 0;
    var newLng = 0;
    if (marker != null) {
        newLat = marker.getLatLng().lat;
        newLng = marker.getLatLng().lng;
    }

    //Make ajax request to add the main attraction
    await $.ajax({
        url: "/newAttraction",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            name: attracNameValue,
            country: countryValue,
            imageSrc: imageSrc,
            hasTickets: hasTickets,
            noTicketPrice: price,
            lat: newLat,
            lng: newLng,
            tickets: ticketList,
        }),
        success: function (data) {
            if (data != undefined && data)
                redirectSuccess();
            else
                showErrorMessage("Error adding attraction!");
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });

    return true;
}