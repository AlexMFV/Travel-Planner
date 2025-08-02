var ELEMENTTYPE = { FLIGHT: 0, ATTRACTION: 1 };

$(function() {
    var tripInfo = getTripInfo();
});

//-----------EVENT HANDLERS----------------

$(document).on('click', '#flightsToAdd>.list-group-item' , function() {
    //get pressed item name and id
    var id = $(this).attr('id');
    var text = $(this)[0].innerHTML;
    
    addElement(id, text, ELEMENTTYPE.FLIGHT);
});

$(document).on('click', '#attracsToAdd>.list-group-item' , function() {
    //get pressed item name and id
    var id = $(this).attr('id');
    var text = $(this)[0].innerHTML;

    addElement(id, text, ELEMENTTYPE.ATTRACTION);
});

//-----------END EVENT HANDLERS----------------

//-----------COMMON FUNCTIONS----------------

function getIcon(type){
    switch(type){
        case ELEMENTTYPE.FLIGHT:
            return '<i class="fas fa-plane" style="padding-left: 10px; padding-right: 10px;"></i>';
        case ELEMENTTYPE.ATTRACTION:
            return '<i class="fas fa-map-marker-alt" style="padding-left: 10px; padding-right: 10px;"></i>';
    }
}

function getElement(id, text, type){
    switch(type){
        case ELEMENTTYPE.FLIGHT:
            return flightElement(id, text, '_n', null, null);
        case ELEMENTTYPE.ATTRACTION:
            return attractElement(id, text, '_n', null, null);
    }
}

function getFinalElement(type){
    switch(type){
        case ELEMENTTYPE.FLIGHT:
            return '#selectedFlights';
        case ELEMENTTYPE.ATTRACTION:
            return '#selectedAttracs';
    }
}

function addElement(id, text, type){
    //var icon = getIcon(type);
    var element = getElement(id, text, type);
    var finalElement = getFinalElement(type);

    $(finalElement).append(element);
}

//-----------END COMMON FUNCTIONS----------------

function createFlightElement(flight){
    var icon = '<i class="fas fa-plane" style="padding-left: 10px; padding-right: 10px;"></i>';

    $('#selectedFlights').append(
        flightElement(flight.codtripflight, flight.fromName + icon + flight.toName, '', formatDate(flight.date) , flight.value)
    );
}

function flightElement(id, text, type, date, price){    
    var value = "";
    if(price != null)
         value = "value='" + price + "'";

    return '<li class="list-group-item themedd" id="' + id + type + '">' +
    '<div class="row" style="padding-bottom: 10px;">' +
        '<div class="col-md-9" style="align-self:center; font-size:large;">' +
            text +
        '</div>' +
        '<div class="col-md-3">' +
            '<button type="button" class="btndelete btn btn-sm btn-outline-light float-end" onclick="removeEntry(this)">' +
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

function attractElement(id, text, type, date, price){    
    var value = "";
    if(price != null)
         value = "value='" + price + "'";

    return '<li class="list-group-item themedd" id="' + id + type + '">' +
    '<div class="row" style="padding-bottom: 10px;">' +
        '<div class="col-md-9" style="align-self:center; font-size:large;">' +
            text +
        '</div>' +
        '<div class="col-md-3">' +
            '<button type="button" class="btndelete btn btn-sm btn-outline-light float-end" onclick="removeEntry(this)">' +
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

function markAsUpdate(id){
    var parent = id.parentNode.parentNode.parentNode;
    if(!parent.id.includes('_u') && !parent.id.includes('_n'))
        parent.id += '_u';
}

function saveTripRecord(){
    //var trip = {
    //    name: $('#tripName').val(),
    //    country: $('#country').val(),
    //    start_date: $('#startDate').val(),
    //    end_date: $('#endDate').val(),
    //    flights: []
    //};

    flightsToAdd = [];
    flightsToUpdate = [];
    flightsToDelete = [];

    $('#selectedFlights>.list-group-item').each(function(index, element){
        var flight = {
            id: element.id,
            date: $(element).find('#date').val(),
            price: $(element).find('#price').val() === '' ? 0 : $(element).find('#price').val()
        };

        //if id contains '_n' then it's a new flight
        if(flight.id.includes('_n'))
        {
            flight.id = flight.id.replace('_n', '');
            flightsToAdd.push(flight);
        }

        if(flight.id.includes('_u'))
        {
            flight.id = flight.id.replace('_u', '');
            flightsToUpdate.push(flight);
        }

        if(flight.id.includes('_d'))
        {
            flight.id = flight.id.replace('_d', '');
            flightsToDelete.push(flight);
        }
    });

    //get param 'id' from url
    var id = getSearchParam('id'); //This is the ID of the trip

    //flightsToAdd should add each entry to the database as a new tripflight
    flightsToAdd.forEach(flight => {
        $.ajax({
            url: '/newTripFlight',
            type: 'POST',
            data: {
                tripFlightId: id,
                flightId: flight.id,
                date: flight.date,
                value: flight.price
            },
            error: function (data) {
                showErrorMessage(data.responseJSON);
                return;
            }
        });
    });

    flightsToUpdate.forEach(flight => {
        $.ajax({
            url: '/updateTripFlight',
            type: 'POST',
            data: {
                tripFlightId: flight.id,
                date: flight.date,
                value: flight.price
            },
            error: function (data) {
                showErrorMessage(data.responseJSON);
                return;
            }
        });
    });

    flightsToDelete.forEach(flight => {
        var flightId = flight.id;
        $.ajax({
            url: '/deleteTripFlight',
            type: 'POST',
            data: { tripFlightId: flightId },
            error: function (data) {
                showErrorMessage(data.responseJSON);
                return;
            }
        });
    });

    redirectPageSuccess('listtrip');
}

function getTripInfo(){
    const id = getSearchParam("id");
    $.ajax({
        url: '/getTripInfo',
        type: 'GET',
        data: { id:id },
        success: function (data) {
            var jsonData = JSON.parse(data);
            $('#trip_dates').html("( " + moment(jsonData.date_start).format('DD/MM/YYYY') + " - " + moment(jsonData.date_end).format('DD/MM/YYYY') + " )");
            $('#trip_name').html(jsonData.trip_name + " " + $("#trip_dates").get(0).outerHTML);

            var status = calculateTripStatus(jsonData.date_start, jsonData.date_end);
            $('#trip_status').html(status);
            if(status == 'Upcoming')
                $('#trip_status').addClass('bg-label-info').removeClass('bg-label-primary');
            else if(status == 'Ongoing')
                $('#trip_status').addClass('bg-label-success').removeClass('bg-label-primary');
        },
        error: function (data) {
            showErrorMessage(data.responseJSON);
            return;
        }
    });
}

function calculateTripStatus(start, end){
    var today = new Date();
    var startDate = new Date(start);
    var endDate = new Date(end);

    if(today < startDate)
        return 'Upcoming';
    else if(today > endDate)
        return 'Completed';
    else
        return 'Ongoing';
}