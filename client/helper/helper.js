/* eslint-disable comma-dangle */
/* eslint-disable linebreak-style */
/* eslint-disable indent */
const handleError = (message) => {
    $("#errorMessage").text(message);
    $("#domoMessage").animate({
        width: 'toggle'
    }, 350);
};

const redirect = (response) => {
    $("#domoMesasage").animate({
        width: 'hide'
    }, 350);
    window.location = response.redirect;
}

const sendAjax = (type, action, data, success) => {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function (xhr, status, error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};