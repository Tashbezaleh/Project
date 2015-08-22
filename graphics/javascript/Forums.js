function ajaxFail(request, error) {
    alert("אופס! קרתה שגיאה, אנא נסה/י שוב מאוחר יותר");
}


function submitAForm(addr, values, doneFunc) {
    $.get(addr, values)
    .done(doneFunc)
    .fail(ajaxFail);
}

function isQuestionFormValid(self) {
    //This function checks if the add question form in the popup is valid.
    //If it isn't, shows a corresponding message.

    $("#addQuesFormError", self).empty();

    // Question Input checking
    if ($(self.question).val() == '') {
        // Question Input is empty
        $(self.question).addClass("add_q_error_boxes");
        $("#addQuesFormError", self).append("אנא הכנס הגדרה</br>");
        $("#addQuesFormError", self).show();
        return false;
    }
    else {
        // Question input is valid
        $(self.question).removeClass("add_q_error_boxes");
    }

    //Pattern input checking
    if ($(self.pattern).val().indexOf('?') < 0) {
        // Pattern input is empty or doesnt have any blank characters
        $("#pat_input", self).css("border-color", "red");
        $("#addQuesFormError", self).append("אנא הכנס תבנית עם תיבה ריקה אחת לפחות");
        $("#addQuesFormError", self).show();
        return false;
    }
    else {
        // Pattern input is valid
        $("#pat_input", self).css("border-color", "black");
    }

    // The form is valid.
    $("#addQuesFormError", self).html("</br></br>");
    return true;
}

function isCommentFormValid(self) {
    //This function checks if the add comment form in the accordion is valid.
    //If it isn't, shows a corresponding message.

    $(".error", self).empty();

    //Answer input checking
    if ($(self.answer).val() == '' || $(self.answer).val().indexOf("?") != -1) {
        // Answer input is empty
        $("#ans_input").css("border-color", "red");
        $(".error", self).append("אנא הכנס תשובתך");
        $(".error", self).show();
        return false;
    }
    else {
        // Answer input is valid
        $("#ans_input").css("border-color", "black");
    }

    // The form is valid.
    $(".error", self).html("</br>");
    return true;
}

function initializeForms() {
    $(document).on("submit", "#add_que_form", function (e) {
        e.preventDefault();
        if (!isQuestionFormValid(this)) return;
        $("#popupContentHolder").fadeOut(500);
        submitAForm($(this).attr("action"), $(this).serialize(), function (data) {
            showPopup("<h3>" + data + "</h3>");
        });
    });
    $(document).on("submit", ".accordion form", function (e) {
        e.preventDefault();
        if (!isCommentFormValid(this)) return;
        submitAForm($(this).attr("action"), $(this).serialize(), function (data) {
            showPopup("<img src='graphics/fancy_close.png' id='small_x' width='30px' alt='' onclick='closePopup()' /><h3>" + data + "</h3>");
        });
    });
}

function getQueryVariable(variable) {
    //retrieving variable from the url
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
    return "";
}

function showError(selector, message, isError) {
    elem = $(selector).empty();
    if (isError) {
        elem.stop(true, true).fadeOut(150).append(message).fadeIn(150);
        return false;
    }
    else {
        elem.html("<br />");
        return true;
    }
}

function allowOnly(selector_string, allowed, error_div) {
    basic = "אבגדהוזחטיכלמנסעפצקרשתךםןףץ \r";
    // usual awesome gal hack
    $(document).on("keypress", selector_string, function (e) {
        if (e.which == 0 || e.which == 8) return; // firefox problems...
        return showError(error_div, "תו זה אינו חוקי!", (basic + allowed).indexOf(String.fromCharCode(e.which)) < 0);
    });
}

$(document).ready(function () {
    initializeForms();

    // Hide empty qtexts
    $(".qtext").each(function () {
        if ($(this).html().trim() == '')
            $(this).css('display', 'none');
    });

    // Check whether should open popup
    if (getQueryVariable("add_ques") == "open") {
        definition = getQueryVariable("definition");
        pattern = getQueryVariable("pattern");
        showPopup($("#add_question").clone(true));
        $("#currentPopup #ques_input").val(decodeURI(definition));
        $("#currentPopup #pat_input").val(decodeURI(pattern));
    }

    // Allow only certain characters

    // Add question form
    allowOnly("#source_name", "0123456789!,'-;()\"", "#currentPopup #addQuesFormError");
    allowOnly("#ques_input", ",'-;()\"", "#currentPopup #addQuesFormError");
    allowOnly("#currentPopup blocks-input input", "", "#currentPopup #addQuesFormError");
    allowOnly("#add_que_form textarea", "0123456789!,'-;()\"", "#currentPopup #addQuesFormError");


    // Add comment form
    $(".accordion-section-content form").each(function () {
        allowOnly("#" + this.id + " #source", "0123456789!,'-;()\"", "#" + this.id + " .error");
        allowOnly("#" + this.id + " blocks-input input", "", "#" + this.id + " .error");
        allowOnly("#" + this.id + " textarea", "0123456789!,'-;()\"", "#" + this.id + " .error");
    });
});