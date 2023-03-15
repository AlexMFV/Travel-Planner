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
    $('#ticketsToAdd').append(ticketElement(1, "Test", "ticket", null, null));
}

function createTicketElement(ticket){
    var icon = '<i class="fas fa-plane" style="padding-left: 10px; padding-right: 10px;"></i>';

    $('#selectedTickets').append(
        //ticketElement(ticket.codtripflight, flight.fromName + icon + flight.toName, '', formatDate(flight.date) , flight.value)
    );
}

function ticketElement(id, text, type, date, noPeople){    
    var value = "";
    if(noPeople != null)
         value = "value='" + noPeople + "'";

    //Get number of childs in list "ticketsToAdd"
    var num = document.getElementById("ticketsToAdd").childElementCount;

    return '<li class="list-group-item themedd" id="' + id + type + '">' +
    '<div class="row" style="padding-bottom: 10px;">' +
        '<div class="col-md-9" style="align-self:center; font-size:large;">' +
            '<input type="text" class="form-control" placeholder="Ticket title" id="ticketName' + num + '">' +
        '</div>' +
        '<div class="col-md-3">' +
            '<button type="button" class="btndelete btn btn-sm btn-outline-light float-end" onclick="removeTicket(this)">' +
            '<i class="fas fa-times"></i>' +
            '</button>' +
        '</div>' +
    '</div>' +

    //'<div class="row">' +
    //    '<div class="col-md-5">' +
    //        'Ticket for:' +
    //        '<input type="number" onchange="markAsUpdate(this)" class="form-control" id="numberPeople"' + value + 'placeholder="No. People" min="1" step="1" required />' +
    //        //' person/people' +
    //    '</div>' +
    //'</div>' +

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

function checkInputs() {
    const attracNameField = document.getElementById("attrac_name");
    const attracNameValue = attracNameField.value.trim();

    if (attracNameValue == null || attracNameValue == "") {
        showErrorMessage("Please complete all the mandatory fields!");
        attracNameField.style.border = "1px solid red";
        return false;
    }

    // Check if attraction image source is empty or default "no image found" source
    let imageSrc = "";
    if (attractImageSrc && attractImageSrc !== "https://www.ncenet.com/wp-content/uploads/2020/04/No-image-found.jpg") {
        imageSrc = attractImageSrc;
    }

    // Get ticket information
    const ticketList = [];
    const ticketItems = $("#ticketsToAdd li");
    ticketItems.each(function (i) {
        const nameField = document.getElementById(`ticketName${i}`);
        const nameValue = nameField.value.trim();
        const personField = document.getElementById(`ticketPersons${i}`);
        const personValue = personField.value.trim();

        if (nameValue != '' && personValue != '') {
            ticketList.push({
                name: ticketNameValue,
                persons: parseInt(ticketPersonsValue)
            });
        }
    });

    console.table(ticketList);

    // Make ajax request
    //$.ajax({
    //    url: "/newAttraction",
    //    type: "POST",
    //    contentType: "application/json",
    //    data: JSON.stringify({
    //        name: attracNameValue,
    //        imageSrc: imageSrc,
    //        tickets: ticketList
    //    }),
    //    success: function (data) {
    //        console.log(data);
    //    },
    //    error: function (xhr, status, error) {
    //        console.error(error);
    //    }
    //});

    return true;
}

function removeTicket(index){
    var parent = index.parentNode.parentNode.parentNode;
    //if the id does not contain '_n' we hide the parent node, otherwise we remove it
    if(!parent.id.includes('_n'))
    {
        if(!parent.id.includes('_d') && !parent.id.includes('_u'))
            parent.id += '_d';
        else if(parent.id.includes('_u'))
            parent.id = parent.id.replace('_u', '_d');

        parent.style.display = 'none';
    }
    else
        parent.remove();
}

function createAttraction() {
    var name = document.getElementById("name").value;
    var description = document.getElementById("description").value;
    var imageURL = document.getElementById("imageURL").value;
    //var imageFile = document.getElementById("imageFile").value;
    var lat = marker._latlng.lat;
    var lng = marker._latlng.lng;

    var attraction = {
        name: name,
        description: description,
        imageURL: imageURL,
        lat: lat,
        lng: lng
    };

    $.ajax({
        url: '/api/attractions',
        type: 'POST',
        data: JSON.stringify(attraction),
        contentType: 'application/json',
        success: function(data) {
            console.log(data);
        }
    });
}