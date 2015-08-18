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

    $("#currentPopup #addQuesFormError").empty();

    // Question Input checking
    if ($(self.question).val() == '') {
        // Question Input is empty
        $(self.question).addClass("add_q_error_boxes");
        $("#currentPopup #addQuesFormError").append("אנא הכנס הגדרה</br>");
        $("#currentPopup #addQuesFormError").show();
        return false;
    }
    else {
        // Question input is valid
        $(self.question).removeClass("add_q_error_boxes");
    }

    //Pattern input checking - abit unnecessary
    if ($(self.pattern).val() == '') {
        // Pattern input is empty
        $("#pat_input").css("border-color", "red");
        $("#currentPopup #addQuesFormError").append("אנא הכנס תבנית");
        $("#currentPopup #addQuesFormError").show();
        return false;
    } 
    else {
        // Pattern input is valid
        $("#pat_input").css("border-color", "black");
    }

    // The form is valid.
    $("#currentPopup #addQuesFormError").html("</br></br>");
    return true;
}

function isCommentFormValid(self) {
	//This function checks if the add comment form in the accordion is valid.
    //If it isn't, shows a corresponding message.

    $(".error",self).empty();

    //Answer input checking
    if ($(self.answer).val() == '' || $(self.answer).val().indexOf("?") != -1) {
        // Answer input is empty
        $("#ans_input").css("border-color", "red");
        $(".error",self).append("אנא הכנס תשובתך");
        $(".error",self).show();
        return false;
    } 
    else {
        // Answer input is valid
        $("#ans_input").css("border-color", "black");
    }

    // The form is valid.
    $(".error",self).html("</br>");
    return true;
}

function initializeForms() {
	$(document).on("submit", "#add_que_form", function (e) {
		e.preventDefault();
		if (!isQuestionFormValid(this)) return;
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
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  } 
  return "";
}

$(document).ready(function() {
	initializeForms();
    
    // Hide empty qtexts
    $(".qtext").each(function() {
        if ($(this).html().trim() == '')
            $(this).css('display','none');
    });

    // Check whether should open popup
	if (getQueryVariable("add_ques")=="open") {
		definition = getQueryVariable("definition");
		pattern = getQueryVariable("pattern");
		showPopup($("#add_question").html());	
		$("#currentPopup #ques_input").val(decodeURI(definition));
		$("#currentPopup #pat_input").val(decodeURI(pattern));
	}
});