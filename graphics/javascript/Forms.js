function submitAForm(addr, values, doneFunc) {
    $.get(addr, values)
    .done(doneFunc)
    .fail(ajaxFail);
}

function expirementWithForms() {
    $("#add_question form").submit(function (e) {
        e.preventDefault();
        if (isFormValid(this)) {
            $("#results").empty().append('<img src="graphics/spinner.gif" />');
            fixCSSIssues();
            appear($("#results").children());
            submitAForm($(this).attr("action"), $(this).serialize(), searchDoneAppear);
        }
    });
    $(document).on("submit", "#add_defi", function (e) {
        e.preventDefault();
        if (!isFormValid(this)) return;
        $("#popupContentHolder").fadeOut(500);
        submitAForm($(this).attr("action"), $(this).serialize(), function (data) {
            $("#popupContentHolder").fadeIn({
                duration: 500,
                start: function () {
                    $(this).empty().html("<img src='graphics/fancy_close.png' id='small_x' width='30px' alt='' onclick='closePopup()' /><h3>" + data + "</h3>");
                    fixCSSIssues();
                }
            });
        });
    });
    $(document).on("submit", "#contact_form", function (e) {
        e.preventDefault();
        $.post("contact_us", $(this).serialize())
            .done(function (data) {
                // Show proper error message if needed
                if (showError("#popupContentHolder #contact_error", "גוף ההודעה ריק!", data === "empty")) {
                    showError("#popupContentHolder #contact_error", "לפני שתשלח אנו רוצים לוודא שאתה אנושי, אנא הקלק בתוך הריבוע", data === "captcha");
                }
                if (data != "sent")
                    return;
                // Show proper message if contact succeeded
                $("#popupContentHolder").fadeOut(500).fadeIn({
                    duration: 500,
                    start: function () {
                        $(this).empty().html("<img src='graphics/fancy_close.png' id='small_x' width='30px' alt='' onclick='closePopup()' /><h3>הודעתך נשלחה ותענה בהקדם</h3>");
                        fixCSSIssues();
                    }
                });
            })
        .fail(ajaxFail);
    });
}