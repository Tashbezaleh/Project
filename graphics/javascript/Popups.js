function closePopup(func) {
    $("#currentPopup").children().fadeOut(500, function () {
        $("#currentPopup").empty();
    });
}

function showPopup(content, onPopupReady) {
    if ($("#popupContentHolder").length > 0) //check if there is an open popup
        return $("#popupContentHolder").fadeOut(100, function () {
            $("#popupContentHolder").empty().append($(content).show(0)).fadeIn({ queue: false, duration: 500 });
            $("#fancyCloseHolder").css("right", ($(window).width() - $("#fancyCloseHolder").outerWidth()) / 2);
            $("#fancyCloseHolder").css("top", ($(window).height() - $("#fancyCloseHolder").outerHeight()) / 2);
            $("#popupContentHolder").css("top", "-=30").animate({ top: "+=30" }, 500);
        });
    $("#currentPopup").append("<div id='blackblock'></div>");
    $("#currentPopup").append("<div id='fancyCloseHolder'><img src='graphics/fancy_close.png' id='small_x' width='30px' alt='' onclick='closePopup()' /><div id='popupContentHolder'></div></div>");
    $("#popupContentHolder").append($(content).show(0));
    $("#blackblock").click(closePopup).fadeIn(500, function () {
        $("#popupContentHolder").fadeIn({ queue: false, duration: 500 });
        $("#fancyCloseHolder").css("right", ($(window).width() - $("#fancyCloseHolder").outerWidth()) / 2);
        $("#fancyCloseHolder").css("top", ($(window).height() - $("#fancyCloseHolder").outerHeight()) / 2);
        $("#popupContentHolder").css("top", "-=30").animate({ top: "+=30" }, 500);

        if (typeof onPopupReady !== 'undefined')
            onPopupReady.call($("#popupContentHolder"));
        else
            $("#popupContentHolder input:first").focus();
    });
}
function setPopups() {
    $(document).on("click", ".popup", function (e) {
        e.preventDefault();
        showPopup($($(this).attr('href')).clone(true));
    });
}

$(document).ready(setPopups);