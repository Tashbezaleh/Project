function ajaxFail(request, error) {
    alert("אופס! קרתה שגיאה, אנא נסה/י שוב מאוחר יותר");
}


function submitAForm(addr, values, doneFunc) {
    $.get(addr, values)
    .done(doneFunc)
    .fail(ajaxFail);
}

function isFormValid(self) {
	return true;
}

function initializeForms() {
	$(document).on("submit", "#add_que_form", function (e) {
		e.preventDefault();
		if (!isFormValid(this)) return;
		$("#popupContentHolder").fadeOut(500);
		submitAForm($(this).attr("action"), $(this).serialize(), function (data) {
            $("#popupContentHolder").fadeIn({
                duration: 500,
                start: function () {
                    $(this).empty().html("<img src='graphics/fancy_close.png' id='small_x' width='30px' alt='' onclick='closePopup()' /><h3>" + data + "</h3>");
                }
            });
        });
	});
}

$(document).ready(function() {
	initializeForms();
});