function doSomeCSS() {
    $("#popupContentHolder").css("right", ($(window).width() - $("#popupContentHolder").outerWidth()) / 2);
    $("#popupContentHolder").css("top", ($(window).height() - $("#popupContentHolder").outerHeight()) / 2);
    $("#main_search").animate({ "margin-top": Math.max(($(window).height() - $("#main_search").outerHeight()) / 2, 0) }, 1000);
    $("#rightColumn").animate({ "margin-top": Math.max(($(window).height() - $("#rightColumn").outerHeight()) / 2, 0) }, 1000);
}
function appear(list){
    list
    .not("br")
    .each(function (index, elem) {
        $(elem).hide().delay(index * 200).fadeIn(1000);
    });
}
function slide(navigation_id, pad_hover, timePerAnim, waitPerAnim) {
    $(navigation_id).children().each(function (ind, elem) {
        $(elem)
        .css("margin-right", "-=300px")
        .delay(waitPerAnim * ind)
        .animate({ marginRight: "+=300px" }, timePerAnim, 'backinout'); //elasout?
        if (ind != 0)
            $(elem).hover(
        	    function () {
        	        $(this).animate({ "paddingRight": pad_hover }, 150, "swing");
        	    },
	            function () {
	                $(this).animate({ "paddingRight": "0" }, 150, "swing");
	            });
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
}
function closePopup() {
    $("#currentPopup").children().fadeOut(1000, function () {
        $("#currentPopup").empty();
    });
}
function setPopups() {
    $(".popup").click(function (event) {
        event.preventDefault();
        closePopup();
        content = $($(this).attr('href')).clone();
        $("#currentPopup").append("<div id='blackblock'></div>");
        $("#blackblock").click(closePopup).fadeIn(1000, function () {
            $("#currentPopup").append("<div id='popupContentHolder'><img src='graphics/fancy_close.png' id='small_x' alt='' onclick='closePopup()' /></div>");
            $("#popupContentHolder").fadeIn(1000, function () {
                $(this)
                .append(content)
                .children().fadeIn(1000);
            });
            doSomeCSS();
        });
    });
}
function poop() {
    $("submit_button").click(function () {
        $("iframe").show(0); //shows ALL iframes, not good. change to id-based show.
        doSomeCSS();
    });
}
$(document).ready(function () {
    $(window).resize(doSomeCSS);
    appear($("#main_search form").children());
    slide("#slidingNavigation", 17, 1700, 200);
    setPopups();
    poop();
});