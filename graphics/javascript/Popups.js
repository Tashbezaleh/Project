function closePopup() {
    $("#currentPopup").children().fadeOut(500, function () {
        $("#currentPopup").empty();
    });
}

function showPopup(content, onPopupReady) {
    closePopup();
    $("#currentPopup").append("<div id='blackblock'></div>");
        $("#currentPopup").append("<div id='popupContentHolder'><img src='graphics/fancy_close.png' id='small_x' width='30px' alt='' onclick='closePopup()' /></div>");
        $("#popupContentHolder").append(content);
    $("#blackblock").click(closePopup).fadeIn(500, function () {
        $("#popupContentHolder").css("right", ($(window).width() - $("#popupContentHolder").outerWidth()) / 2);
        $("#popupContentHolder").css("top", ($(window).height() - $("#popupContentHolder").outerHeight()) / 2);
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

$(document).ready(setPopups);