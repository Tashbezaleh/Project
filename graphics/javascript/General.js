/** fixes css issues cannot be solved staticly, like popup, main search form and side menu positions. */
function fixCSSIssues() {
    $("#fancyCloseHolder").css("right", Math.max(0, ($(window).width() - $("#fancyCloseHolder").outerWidth()) / 2));
    $("#fancyCloseHolder").css("top", Math.max(0, ($(window).height() - $("#fancyCloseHolder").outerHeight()) / 2));
    $("#main_search").stop(true).animate({ "margin-top": Math.max(($(window).height() - $("#main_search").outerHeight()) / 2, 0) }, 1000);
    $("#rightColumn").stop(true).animate({ "margin-top": Math.max(($(window).height() - $("#rightColumn").outerHeight()) / 2, 0) }, 1000);
}

/** takes a jQuery collection and fades them in one by one with nice effect */
function appear(list, done) {
    done = done || function () { };
    list
    .not("br, script")
    //.slice(1) // <- im not sure about this. it says: everyone but the first in the list.
    .each(function (index, elem) {
        a = "15";
        $(elem).css({ opacity: 0, marginTop: "+=" + a, visibility: "visible" }).delay(index * 100).animate({ opacity: 1, marginTop: "-=" + a }, 500, done);
    });
}

/*  // not in use:
function slide(navigation_id, pad_hover, timePerAnim, waitPerAnim) {
    $(navigation_id).children().each(function (ind, elem) {
        $(elem)
        .css("margin-right", "-=300px")
        .delay(waitPerAnim * ind)
        .animate({ marginRight: "+=300px" }, timePerAnim, 'backinout', function () {
            if (ind != 0)
                $(elem).hover(
                    function () {
                        $(this).stop(true).animate({ "paddingRight": pad_hover }, 150);
                    },
                    function () {
                        $(this).stop(true).animate({ "paddingRight": "0" }, 150);
                    });
        }); //elasout?
    });
}
function sideSlide(father,limit) { //idea only, not yet tested.
    $(window).scroll(function () {
        var windowScroll = $(window).scrollTop();
        var menuScrollTop = $(navigation_id).offset().top;
        var menuScroll = $(navigation_id).offset().top + parseInt($(navigation_id).css("paddingTop"), 10);
        $(navigation_id).stop(true);
        if (windowScroll > menuScrollTop)
            $(navigation_id).animate({ "paddingTop": "+=" + (windowScroll - menuScroll) }, 1000, "backout");
        else
            $(navigation_id).animate({ "paddingTop": "-=" + (menuScroll - menuScrollTop - limit) }, 1000, "elasout"); //bounceout?
    });
}*/

// zooming functions
var scale_factor = 1.5;
function zoomImage(ind, elem) {
    w = parseFloat($(elem).css("width"));
    h = parseFloat($(elem).css("height"));
    if (w != 0)
        $(elem).css("width", scale_factor * w);
    if (h != 0)
        $(elem).css("height", scale_factor * h);
}
function zoomFont(ind, elem) {
    $(elem).css("font-size", scale_factor * parseFloat($(elem).css("font-size")));
}
function zoom() {
    $("body, input").each(zoomFont);
    $("img:not(#magnif_img)").each(zoomImage);
    $("#magnif > a").text(scale_factor < 1 ? "לחץ עלי להגדלה!" : "לחץ עלי להקטנה!")
    fixCSSIssues();
    scale_factor = 1 / scale_factor;
}
function zoomResults() {
    if (scale_factor <= 1) {
        scale_factor = 1 / scale_factor;
        $("#results input").each(zoomFont);
        $("#results img").each(zoomImage);
        scale_factor = 1 / scale_factor;
    }
    fixCSSIssues();
}

/** return true if pattern is valid and not empty. */
function checkPatternValid(patternStr) {
    return !/[^אבגדהוזחטיכלמנסעפצקרשתךםןףץ ?]/.test(patternStr);
}

/**
 * This function checks if the search form in index page is valid.
 * If it isn't, shows a corresponding message.
*/
function isSearchFormValid(self) {
    $("#searchFormError").empty();

    // Definition Input checking
    if ($(self.definition).val() == '') {
        // Definition Input is empty
        $(self.definition).addClass("error_index_boxes");
        $("#searchFormError").append("אנא הכנס הגדרה");
        $("#searchFormError").show();
        return false;
    }
    else {
        // Definition input is valid
        $(self.definition).removeClass("error_index_boxes");
    }

    //Pattern input checking
    if ($(self.pattern).val() == '') {
        // Pattern input is empty
        $("#pattern").css("border-color", "red");
        $("#searchFormError").append("אנא הכנס תבנית");
        $("#searchFormError").show();
        return false;
    }
    else if (!checkPatternValid($(self.pattern).val())) {
        // Pattern input isn't valid
        $("#pattern").css("border-color", "red");
        $("#searchFormError").append("אנא הכנס תבנית חוקית");
        $("#searchFormError").show();
        return false;
    }
    else {
        // Pattern input is valid
        $("#pattern").css("border-color", "black");
    }

    // The form is valid.
    $("#searchFormError").html("</br>");
    return true;
}

/**
 * This function checks if the add definition form in the popup is valid.
 * If it isn't, shows a corresponding message.
*/
function isAddDefiFormValid(self) {
    $("#currentPopup #addDefiFormError").empty();

    // Definition Input checking
    if ($(self.definition).val() == '') {
        // Definition Input is empty
        $(self.definition).addClass("error_index_boxes");
        $("#currentPopup #addDefiFormError").append("אנא הכנס הגדרה</br>");
        $("#currentPopup #addDefiFormError").show();
        return false;
    }
    else {
        // Definition input is valid
        $(self.definition).removeClass("error_index_boxes");
    }

    // Answer Input checking
    if ($(self.answer).val() == '') {
        // Answer Input is empty
        $(self.answer).addClass("error_index_boxes");
        $("#currentPopup #addDefiFormError").append("אנא הכנס פתרון</br>");
        $("#currentPopup #addDefiFormError").show();
        return false;
    }
    else {
        // Answer Input is valid
        $(self.answer).removeClass("error_index_boxes");
    }

    // The form is valid.
    $("#currentPopup #addDefiFormError").html("</br></br>");
    return true;
}

/** close the currently open popup. */
function closePopup() {
    $("#currentPopup").children().fadeOut(500, function () {
        $("#currentPopup").empty();
    });
}

/** open a popup with the content given, and calls onPopupReady when done. */
function showPopup(content, onPopupReady) {
    $(content).show();
    if ($("#popupContentHolder").length > 0) //check if there is an open popup
        return $("#popupContentHolder").fadeOut(100, function () {
            $(this).empty().append(content).css("top", "-=30").fadeIn({ queue: false, duration: 500 }).animate({ top: "+=30" }, 500);
            fixCSSIssues();
        });
    $("#currentPopup").append("<div id='blackblock'></div>");
    $("#blackblock").click(closePopup).fadeIn(500, function () {
        $("#currentPopup").append("<div id='fancyCloseHolder'><img src='graphics/fancy_close.png' id='small_x' width='30px' alt='' onclick='closePopup()' /><div id='popupContentHolder'></div></div>");
        if (scale_factor < 1) {
            scale_factor = 1 / scale_factor;
            $("#small_x").each(zoomImage);
            scale_factor = 1 / scale_factor;
        }
        $("#popupContentHolder").append(content);
        $("#popupContentHolder").fadeIn({ queue: false, duration: 500 });
        fixCSSIssues();
        $("#popupContentHolder").css("top", "-=30").animate({ top: "+=30" }, 500, function () {
            $(this).children().fadeIn(500);
        });
        if (typeof onPopupReady !== 'undefined')
            onPopupReady.call($("#popupContentHolder"));
        else
            $("#popupContentHolder input:first").focus();
    });
}

/** activates the popup mechanism. */
function setPopups() {
    $(document).on("click", ".popup", function (e) {
        e.preventDefault();
        showPopup($($(this).attr('href')).clone(true));
    });
}
/** Default function to be called on ajax failure. */
function ajaxFail(request, error) {
    alert("אופס! קרתה שגיאה, אנא נסה/י שוב מאוחר יותר");
}

/** appends the results from the server to the document */
function searchDone(data) {
    $("#results").empty().append(data);
    zoomResults();
}
/** appends the results from the server to the document and calls 'appear' for animation */
function searchDoneAppear(data) {
    searchDone(data);
    appear($("#results table tr"));
}

/** Submit (using get method) the given values to the given address, and call doneFunc when response arrives. */
function submitAForm(addr, values, doneFunc) {
    $.get(addr, values)
    .done(doneFunc)
    .fail(ajaxFail);
}

/** shows the error message in $(selector) if isError is true. */
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

/** Declares the behavior of form's submit event, for each form in the page. */
function expirementWithForms() {
    $("#main_search form").submit(function (e) {
        e.preventDefault();
        if (isSearchFormValid(this)) {
            $("#results").empty().append('<img src="graphics/spinner.gif" />');
            fixCSSIssues();
            appear($("#results").children());
            submitAForm($(this).attr("action"), $(this).serialize(), searchDoneAppear);
        }
    });
    $(document).on("submit", "#add_defi", function (e) {
        e.preventDefault();
        if (!isAddDefiFormValid(this)) return;
        $("#popupContentHolder").fadeOut(500);
        submitAForm($(this).attr("action"), $(this).serialize(), function (data) {
            showPopup("<h3>" + data + "</h3>");
        });
    });
    $(document).on("submit", "#contact_form", function (e) {
        e.preventDefault();
        if (!showError("#popupContentHolder #contact_error", "גוף ההודעה ריק!", $.trim($("#popupContentHolder #mail_body").val()) == "")) {
            $("#popupContentHolder #mail_body").addClass("niceInvalidInput");
            return;
        }
        $.post("contact_us", $(this).serialize())
            .done(function (data) {
                // Show proper message if contact succeeded and error otherwise
                $("#popupContentHolder").fadeOut(500).fadeIn({
                    duration: 500,
                    start: function () {
                        msg = data == "sent" ? "הודעתך נשלחה ותענה בהקדם" : "אירעה שגיאה, הודעתך לא נשלחה";
                        $(this).empty().html("<img src='graphics/fancy_close.png' id='small_x' width='30px' alt='' onclick='closePopup()' /><h3>" + msg + "</h3>");
                        fixCSSIssues();
                    }
                });
            })
        .fail(ajaxFail);
    });
}
/** Submit a rate request from the user to the server. */
function submitRate(definition, answer, pattern, button) {
    submitAForm("result_action", {
        "definition": definition,
        "answer": answer,
        "action": button.value,
        "pattern": pattern
    }, searchDone);
    button.checked = false;

    // user 'thank you':
    $(button).closest("td").html("<b style='color: rgb(249,59,151);'>תודה על תרומתך!</b>");
}

/** allows only certain keys to be pressed in inputs [type=text] that match the selector_string */
function allowOnly(selector_string, allowed, error_div) {
    basic = "אבגדהוזחטיכלמנסעפצקרשתךםןףץ \r";
    // usual awesome gal hack
    $(document).on("keypress", selector_string, function (e) {
        if (e.which == 0 || e.which == 8) return; // firefox problems...
        return showError(error_div, "תו זה אינו חוקי!", (basic + allowed).indexOf(String.fromCharCode(e.which)) < 0);
    });
}

/** Causes the main search form to submit with the given values */
function searchDefi(definition, pattern) {
    $("#definition").val(definition);
    $("#pattern").val(pattern);
    $("#main_search form").submit();
}

$(document).ready(function () {
    $(window).resize(fixCSSIssues);
    appear($("#slidingNavigation").children());
    appear($(".news"));
    setPopups();
    expirementWithForms();
    $(document).on("focus", "input, textarea", function () {
        $(this).removeClass("error_index_boxes");
        $(this).removeClass("niceInvalidInput");
    });
    $(document).on("focus focusout", "input", function () {
        $("#searchFormError").empty().html("<br/ >");
        $("#popupContentHolder #contact_error").empty().html("<br/ >");
    });
    $(document).keyup(function (e) {
        if (e.keyCode == 27) closePopup(); // escape key maps to keycode `27`
    });
    $("#magnif").click(zoom).css("right", "-=" + $("#magnif a").outerWidth()).hover(function () {
        $(this).stop(true).animate({ right: 0 }, 100, "easein");
    }, function () {
        $(this).stop(true).animate({ right: -$("#magnif a").outerWidth() }, 1000, "bounceout");
    });
    allowOnly("#definition", ",'-;()\"", "#searchFormError");
    allowOnly("#add_defi_definition", ",'-;()\"", "#currentPopup #addDefiFormError");
    allowOnly("#answer", "", "#currentPopup #addDefiFormError");
    allowOnly("#source_name", "0123456789!,'-;()\"", "#currentPopup #addDefiFormError");
    allowOnly("#pattern", "?", "#searchFormError");
});

window.onload = function () {
    fixCSSIssues();
    appear($("#main_search form").children());
};