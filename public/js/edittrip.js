$(document).on('click', '#flightsToAdd>.list-group-item' , function() {
    //get pressed item name and id
    var id = $(this).attr('id');
    var text = $(this)[0].innerHTML;
    
    addNewFlight(id, text);
});

function addNewFlight(id, text) {
    $('#selectedFlights').append(
        '<li class="list-group-item themedd" id="' + id + '_n">' +
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
                '<input type="date" class="form-control" id="date" value="' + new Date().toISOString().slice(0, 10) + '" required>' +
            '</div>' +
            '<div class="col-md-6">' +
                '<input type="number" class="form-control" id="price" placeholder="Price" min="0" step="0.01" required />' +
            '</div>' +
        '</div>' +
        '</li>'
    );
}

function removeFlight(index){
    //if the id does not contain '_n' we hide the parent node, otherwise we remove it
    if(!index.parentNode.parentNode.parentNode.id.includes('_n'))
        index.parentNode.parentNode.parentNode.style.display = 'none';
    else
        index.parentNode.parentNode.parentNode.remove();
}

function saveTripRecord(){
    //var trip = {
    //    name: $('#tripName').val(),
    //    country: $('#country').val(),
    //    start_date: $('#startDate').val(),
    //    end_date: $('#endDate').val(),
    //    flights: []
    //};

    flightsToAdd = [{}];
    flightsToUpdate = [{}];
    flightsToDelete = [{}];

    $('#selectedFlights>.list-group-item').each(function(index, element){
        var flight = {
            id: element.id,
            date: $(element).find('#date').val(),
            price: $(element).find('#price').val() === '' ? 0 : $(element).find('#price').val()
        };
        
        console.log(flight);

        //if id contains '_n' then it's a new flight
        if(flight.id.includes('_n'))
            flightsToAdd.push(flight);

        if(flight.id.includes('_u'))
            flightsToUpdate.push(flight);

        if(flight.id.includes('_d'))
            flightsToDelete.push(flight);
    });

    //var tripJson = JSON.stringify(trip);
    //console.log(tripJson);

    //send to server
    //$.ajax({
    //    url: '/api/trips',
    //    type: 'POST',
    //    data: tripJson,
    //    contentType: 'application/json',
    //    success: function(result) {
    //        window.location.href = "/trips";
    //    }
    //});
}