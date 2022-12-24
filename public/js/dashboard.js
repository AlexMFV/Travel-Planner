async function loadDashboard(){
    var today = new Date();

    //Get flight report for this year
    glob.flightReport = await getMonthlyFlightReportByYear(today.getFullYear());
    //Get flight report for the previous year
    glob.flightReportPrevYear = await getMonthlyFlightReportByYear(today.getFullYear()-1);

    //Convert the values to flot and calculate total value from this year
    var totalValue = calculateFlightValue(glob.flightReport);
    var totalValuePrevYear = calculateFlightValue(glob.flightReportPrevYear);
    
    //Calculate the change in value from the previous year to this year
    var flightValueChange = calculateChangePercentage(totalValue, totalValuePrevYear, totalValue);
    console.log(flightValueChange);

    modifyElementText("totalFlightValue", totalValue.toFixed(2) + "€");
    modifyElementText("flightValueChange", percentageElement(flightValueChange.toFixed(2), totalValuePrevYear.toFixed(2)));
    modifyElementClass("flightValueChange", flightValueChange < 0 ? "text-success fw-semibold" : "text-danger fw-semibold");
}

async function getMonthlyFlightReportByYear(_year){
    var result = {};
    await $.ajax({
        type: 'POST',
        url: '/monthlyFlightReportByYear',
        data: { year: _year },
        success: function (data) {
            if (data != null && data != undefined) {
                result = JSON.parse(data);
            }
        },
        error: function (data) {
            showErrorMessage(data.responseJSON);
        }
    });
    return result;
}

function modifyElementText(_elementId, _text){
    document.getElementById(_elementId).innerHTML = _text;
}

function modifyElementClass(_elementId, _class){
    var element = document.getElementById(_elementId).className = _class;
}

function percentageElement(value, prevValue){
    if(value < 0)
        return '<i class="bx bx-up-arrow-alt"></i>' + value + '% (' + prevValue + '€)';
    return '<i class="bx bx-down-arrow-alt"></i>+' + value + '% (' + prevValue + '€)';
}

function calculateFlightValue(globVariable){
    var totalValue = 0;
    for (var i = 0; i < globVariable.length; i++) {
        totalValue += parseFloat(globVariable[i].value);
    }
    return totalValue;
}

function calculateChangePercentage(first, last, basedOn){
    if(basedOn == 0)
        return 100; //If there is no value from the previous year, the change is 100%

    var change = (first - last) / basedOn;
    return change * 100;
}