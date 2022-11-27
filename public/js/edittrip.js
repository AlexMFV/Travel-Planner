$(document).on('click', '#flightsToAdd>.list-group-item' , function() {
    //get pressed item name and id
    var id = $(this).attr('id');
    var text = $(this)[0].innerHTML;
    
    addNewFlight(id, text);
});

function addNewFlight(id, text) {

    $('#selectedFlights').append(
        '<li class="list-group-item themedd" id="' + id + '">' +
        '<div class="row" style="padding-bottom: 10px;">' +
            '<div class="col-md-9" style="align-self:center; font-size:large;">' +
                text +
            '</div>' +
            '<div class="col-md-3">' +
                '<button type="button" class="btndelete btn btn-sm btn-outline-light float-end" onclick="removeFlight(\'' + id + '\')">' +
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