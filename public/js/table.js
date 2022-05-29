
async function createTripRows(body) {
    //get All Trips and fill glob.trips
    await getAllTrips();

    glob.trips.forEach(trip => {
        const tr = document.createElement('tr'); //Full Row
        let td = document.createElement('td'); //Column

        //First Column td, i.fab fa-angular fa-lg text-danger me-3, strong = Trip Name
        const i = document.createElement('i');
        i.classList.add('fab');
        i.classList.add('fa-angular');
        i.classList.add('text-danger');
        i.classList.add('fa-lg');
        i.classList.add('me-3');

        const tripName = document.createElement('strong');
        tripName.innerHTML = trip.trip_name;

        td.appendChild(i)
        td.appendChild(tripName);
        tr.appendChild(td);

        //Column 2 td = Start date
        td = document.createElement('td');
        td.innerHTML = moment(trip.date_start).format('DD/MM/YYYY');
        tr.appendChild(td);

        //Column 3 td = End date
        td = document.createElement('td');

        td.innerHTML = moment(trip.date_end).format('DD/MM/YYYY');
        tr.appendChild(td);

        let date = Date.now();
        let today = new Date(date).toISOString();

        //Column 4 td = Time Left (days)
        td = document.createElement('td');
        if(trip.date_start > today)
        {
            var diff = new Date(trip.date_start).getTime() - new Date(date).getTime();
            var days = Math.ceil(diff / (1000 * 3600 * 24));
            td.innerHTML = days + " days";
        }
        tr.appendChild(td);

        //Column 5 td = Status
        td = document.createElement('td');
        const span = document.createElement('span');

        let badgeType = null;
        let badgeColor = null;

        span.classList.add("badge");

        if(trip.date_start > today)
        {
            badgeType = 'Upcoming';
            badgeColor = 'bg-label-info';
        }
        
        if(trip.date_start < today && trip.date_end > today)
        {
            badgeType = 'Ongoing';
            badgeColor = 'bg-label-success';
        }

        if(trip.date_end < today)
        {
            badgeType = 'Completed';
            badgeColor = 'bg-label-primary';
        }

        span.classList.add(badgeColor);
        span.innerHTML = badgeType;

        td.appendChild(span);
        tr.appendChild(td);

        //Column 6 td = Actions

        body.appendChild(tr);
    });

    return body;
}

function createColumns(columns){
    const head = document.createElement('thead');
    const tr = document.createElement('tr');

    columns.forEach(column => {
        const th = document.createElement('th');
        th.innerHTML = column;
        tr.appendChild(th);
    });

    head.appendChild(tr);
    return head;
}

function createBody(){
    const body = document.createElement('tbody');
    body.classList.add('table-border-bottom-0');
    return body;
}

async function createTable(columns, tableName){
    console.log("Loading table trip");

    const table = document.getElementById('listTable');
    table.appendChild(createColumns(columns));

    let body = createBody();

    switch(tableName){
        case 'trip': body = await createTripRows(body); break;
        default: break;
    }

    table.appendChild(body);
}