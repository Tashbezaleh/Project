function fixCSSIssues() {
    $("#popupContentHolder").css("right", ($(window).width() - $("#popupContentHolder").outerWidth()) / 2);
    $("#popupContentHolder").css("top", ($(window).height() - $("#popupContentHolder").outerHeight()) / 2);
    $("#main_search").stop(true).animate({ "margin-top": Math.max(($(window).height() - $("#main_search").outerHeight()) / 2, 0) }, 1000);
    $("#rightColumn").stop(true).animate({ "margin-top": Math.max(($(window).height() - $("#rightColumn").outerHeight()) / 2, 0) }, 1000);
}
function appear(list) {
    list
    .not("br, script")
    .each(function (index, elem) {
        $(elem).hide().delay(index * 200).fadeIn(1000);
    });
}

$(document).ready(function () {
    $("#main").fadeOut(0).css({ "margin-top": $(window).height() *1.0/4 });
    $(".menu_button").each(function (dude) {
        dude.css({ "position": "absolute", "top": this.top(), "left": this.left() });
    }).hide();
});
window.onload = function () {
    $("#main").fadeIn({ queue: false, duration: 500 }).animate({ "margin-top": Math.max(($(window).height() - $("#main").outerHeight()) / 4, 0) },500,function(){
        $(".menu_button").each(function (index, elem) {
            $(elem).delay(index * 200).show(1000);
        });
    });
};