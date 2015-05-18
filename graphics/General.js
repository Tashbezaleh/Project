function fixCSSIssues() {
    $("#popupContentHolder").css("right", ($(window).width() - $("#popupContentHolder").outerWidth()) / 2);
    $("#popupContentHolder").css("top", ($(window).height() - $("#popupContentHolder").outerHeight()) / 2);
    $("#main_search").stop(true).animate({ "margin-top": Math.max(($(window).height() - $("#main_search").outerHeight()) / 2, 0) }, 1000);
    $("#rightColumn").stop(true).animate({ "margin-top": Math.max(($(window).height() - $("#rightColumn").outerHeight()) / 2, 0) }, 1000);
}
function appear(list){
    list
    .not("br, script")
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
function closePopup() {
    $("#currentPopup").children().fadeOut(500, function () {
        $("#currentPopup").empty();
    });
}
function showPopup(content) {
    closePopup();
    $("#currentPopup").append("<div id='blackblock'></div>");
    $("#blackblock").click(closePopup).fadeIn(500, function () {
        $("#currentPopup").append("<div id='popupContentHolder'><img src='graphics/fancy_close.png' id='small_x' alt='' onclick='closePopup()' /></div>");
        $("#popupContentHolder").fadeIn(0, function () {
            $(this)
                .append(content)
                .children().fadeIn(0);
        });
        fixCSSIssues();
    });
}
function setPopups() {
    $(".popup").click(function (e) {
        e.preventDefault();
        showPopup($($(this).attr('href')).clone());
    });
}
function ajaxFail() {
    alert("Whoops... something went wront... blah blah info blah blah ignore blah");
}
function searchDone(data) {
    //do something with server data!
    //one option is:
    // we don't want popup
    //showPopup(data);
    //the other is:
    $("#results").empty().append(data);
    fixCSSIssues();
}
function searchDoneAppear(data) {
    searchDone(data);
    appear($("#results").children());
}
function submitAForm (addr, values, doneFunc) {
    $.get(addr, values)
    .done(doneFunc)
    .fail(ajaxFail);
}
function expirementWithForms() {
    $("#main_search form").submit(function (e) {
        e.preventDefault();
        submitAForm($(this).attr("action"), $(this).serialize(), searchDoneAppear);
    });
    $(document).on("submit", "#add_defi", function (e) {
        e.preventDefault();
        showPopup("תודה על תרומתך לתשבצל'ה!");
        submitAForm($(this).attr("action"), $(this).serialize(), function (data) { });
    });
}
$(document).ready(function () {
    $(window).resize(fixCSSIssues);
    slide("#slidingNavigation", 17, 900, 150);
    setPopups();
    expirementWithForms();
});

window.onload = function(){ 
    fixCSSIssues();
    appear($("#main_search form").children());
};