$(function () {
    //Trip description defaults to todays month (text) and year
    const date = new Date(Date.now());
    updatePlaceholder('tripDescription', date.toLocaleString('en-US', {month: 'long'}) + ' ' + date.getFullYear());

    //Make start and end date todays date
    let yourDate = new Date()
    const today = yourDate.toISOString().split('T')[0];

    updateValue('startDate', today);
    updateValue('endDate', today);
});

function updatePlaceholder(name, placeholder) {
    const elem = document.getElementById(name);
    elem.placeholder = placeholder;
}

function updateValue(name, value){
    const elem = document.getElementById(name);
    elem.value = value;
}

function checkDates(){
    console.log("Test");
    //if start date is after end date, set end date to start date
    if(document.getElementById('startDate').value > document.getElementById('endDate').value){
        updateValue('endDate', document.getElementById('startDate').value);
    }
}

function checkInputs(){
    if(document.getElementById('tripDescription').value == '' || document.getElementById('startDate').value == '' || document.getElementById('endDate').value == ''){
        showErrorMessage("One or more fields are empty or have an invalid value, please try again!");
    }
    else {
        deleteErrorMessage();
        createTrip();
    }
}

function createTrip(){
    console.log("Needs to be implemented!");
}