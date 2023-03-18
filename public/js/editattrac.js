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
            console.log(jsonData);
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
            var jsonData = JSON.parse(data);
            console.log(jsonData);
            //var jsonData = JSON.parse(data);
            //var ticketList = $('#ticket_list');
            //jsonData.forEach(ticket => {
            //    var ticketItem = createTicketItem(ticket);
            //    ticketList.append(ticketItem);
            //});
        },
        error: function (data) {
            showErrorMessage(data.responseJSON);
            return;
        }
    });

    loadImageURL();
    return jsonData;
}

function loadImageURL(){
    //get url from input
    var url = document.getElementById("imageURL").value;
    //set image source to url
    document.getElementById("attractImage").src = url;
}