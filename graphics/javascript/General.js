function fixCSSIssues() {
    $("#popupContentHolder").css("right", ($(window).width() - $("#popupContentHolder").outerWidth()) / 2);
    $("#popupContentHolder").css("top", ($(window).height() - $("#popupContentHolder").outerHeight()) / 2);
    $("#main_search").stop(true).animate({ "margin-top": Math.max(($(window).height() - $("#main_search").outerHeight()) / 2, 0) }, 1000);
    $("#rightColumn").stop(true).animate({ "margin-top": Math.max(($(window).height() - $("#rightColumn").outerHeight()) / 2, 0) }, 1000);

    $("#recentActivities").css("max-height", ($(window).height()) * 0.8);
}

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
/*function sideSlide(father,limit) { //idea only, not yet tested.
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

function checkPatternValid(patternStr) {
    // return true if pattern is valid and not empty(!)
    // use $.trim(patternStr)=='' to check if patternStr is empty.
    return !/[^אבגדהוזחטיכלמנסעפצקרשתךםןףץ ?]/.test(patternStr);
}

function isSearchFormValid(self) {
    //This function checks if the search form in index page is valid.
    //If it isn't, shows a corresponding message.
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

function isAddDefiFormValid(self) {
    //This function checks if the add definition form in the popup is valid.
    //If it isn't, shows a corresponding message.

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

function closePopup() {
    $("#currentPopup").children().fadeOut(500, function () {
        $("#currentPopup").empty();
    });
}

function showPopup(content, onPopupReady) {
    closePopup();
    $("#currentPopup").append("<div id='blackblock'></div>");
    $("#blackblock").click(closePopup).fadeIn(500, function () {
        $("#currentPopup").append("<div id='popupContentHolder'><img src='graphics/fancy_close.png' id='small_x' width='30px' alt='' onclick='closePopup()' /></div>");
        if (scale_factor < 1) {
            scale_factor = 1 / scale_factor;
            $("#small_x").each(zoomImage);
            scale_factor = 1 / scale_factor;
        }
        $("#popupContentHolder").append(content);
        fixCSSIssues();
        $("#popupContentHolder").css("top", "-=30").fadeIn({ queue: false, duration: 500 }).animate({ top: "+=30" }, 500, function () {
            $(this).children().fadeIn(500);
        });
        if (typeof onPopupReady !== 'undefined')
            onPopupReady.call($("#popupContentHolder"));
        else
            $("#popupContentHolder input:first").focus();
    });
}
function setPopups() {
    $(document).on("click", ".popup", function (e) {
        e.preventDefault();
        showPopup($($(this).attr('href')).html());
    });
}
// function setHelpButtons() {
//     $("#definitionHelpAnchor").click(function(e) {
//         e.preventDefault();
//         showPopup($($(this).attr('href')).html());
//     });
//     $("#patternHelpAnchor").click(function(e) {
//         e.preventDefault();
//         showPopup($($(this).attr('href')).html());
//     });
// }
function ajaxFail(request, error) {
    alert("אופס! קרתה שגיאה, אנא נסה/י שוב מאוחר יותר");
}

function searchDone(data) {
    //do something with server data!
    //one option is:
    // we don't want popup
    //showPopup(data);
    //the other is:
    $("#results").empty().append(data);
    zoomResults();
}
function searchDoneAppear(data) {
    searchDone(data);
    appear($("#results table tr"));
}
function submitAForm(addr, values, doneFunc) {
    $.get(addr, values)
    .done(doneFunc)
    .fail(ajaxFail);
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

function allowOnly(selector_string, allowed, error_div) {
    basic = "אבגדהוזחטיכלמנסעפצקרשתךםןףץ \r";
    // usual awesome gal hack
    $(document).on("keypress", selector_string, function (e) {
        return showError(error_div, "תו זה אינו חוקי!", (basic + allowed).indexOf(String.fromCharCode(e.which)) < 0);
    });
}

function searchDefi(definition, pattern) {
    $("#definition").val(definition);
    $("#pattern").val(pattern);
    $("#main_search form").submit();
}

$(document).ready(function () {
    $(window).resize(fixCSSIssues);
    appear($("#slidingNavigation").children(), function () {
        if (!$(this).is(":first-child"))
            $(this).hover(
                function () {
                    $(this).stop(true).animate({ "paddingRight": 17 }, 150);
                },
                function () {
                    $(this).stop(true).animate({ "paddingRight": "0" }, 150);
                });
    });
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
    //setTimeout(function(){$("#contact_form").append('<script src="https://www.google.com/recaptcha/api.js"></script><div class="g-recaptcha" data-sitekey="6LdvSgsTAAAAANYJ7SwEP5Q3XLDCHyc20X0d9ttX"></div>');},3000);
};