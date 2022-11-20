async function addNewFlight(){
    const elem1 = document.getElementById("country_from");
    const elem2 = document.getElementById("country_to");

    const fromId = elem1.value;
    const toId = elem2.value;

    await $.ajax({
        type: 'POST',
        url: '/newFlight',
        data: {
            from: fromId,
            to: toId
        },
        success: function (data) {
            if (data != null && data != undefined)
                redirectSuccess();
        },
        error: function (data) {
            showErrorMessage(data.responseJSON);
        }
    });
}