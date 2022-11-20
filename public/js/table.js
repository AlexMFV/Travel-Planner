$(function (){
    const page = window.location.pathname.slice(1).replace('.html', '');
    let options = undefined;

    switch(page){
        case 'listtrip': options = tripsTable(); break;
        case 'countries': options = countriesTable(); break;
        case 'listflight': options = flightsTable(); break;
        default: console.log("No table found"); break;
    }

    if(options != undefined)
        $("#listTable").DataTable(options);
});
 
//Table definitions
function tripsTable() {
    let date = Date.now();
    let today = new Date(date).toISOString();

    return {
        data: glob.trips,
        columns: [
            { data: null, render: function ( data, type, row ) {
                return '<a href="/editTrip?id=' + row.codtrip + '" class="btn btn-outline-primary" target="_blank">Plan</a>'
            } },
            { data: 'trip_name', title: 'Trip Name', "defaultContent": 'No data' ,render: (data, type, row) => { return '<strong>' + row.trip_name + '</strong>' } },
            { data: 'date_start', title: 'Start Date', "defaultContent": 'No data' , render: function (data, type, row) { return moment(row.date_start).format('DD/MM/YYYY'); } },
            { data: 'date_end', title: 'End Date', "defaultContent": 'No data' , render: function (data, type, row) { return moment(row.date_end).format('DD/MM/YYYY'); } },
            {
                data: 'time_left', title: 'Time Left', "defaultContent": 'No data' , render: function (data, type, row) {

                    if (row.date_start > today) {
                        var diff = new Date(row.date_start).getTime() - new Date(date).getTime();
                        var days = Math.ceil(diff / (1000 * 3600 * 24));
                        row.time_left = days + " days";
                    }
                    else
                        return '';

                    return row.time_left;
                }
            },
            {
                data: 'status', title: 'Status', "defaultContent": 'No data' , render: function (data, type, row) {
                    //Do something and return as HTML inside the row tr for the specific td
                    const span = document.createElement('span');
                    span.classList.add("badge");

                    if (row.date_start > today) {
                        row.status = 'Upcoming';
                        span.classList.add('bg-label-info');
                    }

                    if (row.date_start < today && row.date_end > today) {
                        row.status = 'Ongoing';
                        span.classList.add('bg-label-success');
                    }

                    if (row.date_end < today) {
                        row.status = 'Completed';
                        span.classList.add('bg-label-primary');
                    }

                    span.innerHTML = row.status;
                    return span.outerHTML;
                }
            },
        ],
        "order": 1
    }
}

function countriesTable() {
    if(glob.countries == undefined || glob.countries == null)
        countriesTable();

    return {
        data: glob.countries,
        columns: [
            { data: 'name', title: 'Country Name', render: (data, type, row) => { return '<strong>' + row.name + '</strong>' }, "defaultContent": 'No data' },
            { data: 'currency_name', title: 'Currency Name', "defaultContent": 'No data' },
            { data: 'currency', title: 'Currency', "defaultContent": 'No data' },
            { data: 'currency_symbol', title: 'Currency Symbol',  "defaultContent": 'No data' },
        ],
        "order": 1
    }
}

function flightsTable() {
    if(glob.flights == undefined || glob.flights == null)
        flightsTable();

    return {
        data: glob.flights,
        columns: [
            { data: 'from_name', title: 'Flight Origin', "defaultContent": 'No data' ,render: (data, type, row) => { return '<strong>' + row.from_name + '</strong>' } },
            { data: 'to_name', title: 'Flight Destination', "defaultContent": 'No data' , render: function (data, type, row) { return '<strong>' + row.to_name + '</strong>' } },
            { data: 'duration', title: 'Flight Duration', "defaultContent": 'No data' , render: function (data, type, row) { return row.duration; } },
        ],
        "order": 1
    }
}