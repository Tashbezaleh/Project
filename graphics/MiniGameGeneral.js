var waitConst = 150, fadeConst = 1000;
function showMain() {
    clearInterval(parseInt($("#timer").attr("timerID")));
    toFade = $("#main>div:not(#main_menu)");
    toFadeHeight = 0;
    toFade.each(function () {
        if (!$(this).is(".menu_button") && $(this).is(":visible"))
            toFadeHeight = Math.max(toFadeHeight, $(this).outerHeight());
    });
    $("#main").fadeIn({ queue: false, duration: 500 }).animate({ "margin-top": Math.max(($(window).height() - $("#main").outerHeight() + toFadeHeight) / 4, 0) }, 500, function () {
        $("#main_menu .menu_button").each(function (index, elem) {
            $(elem).delay(index * waitConst).show(fadeConst);
        });
    });
    toFade.fadeOut(500);
}

function hideMain(fun) {
    toHide = $("#main_menu .menu_button");
    toHide.stop(true).each(function (index, elem) {
        $(elem).delay(index * waitConst).hide(fadeConst);
    });
    $("#main").fadeIn({ queue: false, duration: 500 }).animate({ "margin-top": Math.max(($(window).height() - $("#main").outerHeight()) / 4, 0) }, (toHide.length - 1) * waitConst + fadeConst, fun);
}

function StopGame() {
    showMain();
    $("#Game").empty();
}

function finishGame(data, div) {
    clearInterval(parseInt($("#timer").attr("timerID")));
    table = $("<table class=\"niceTable\"/>").append("<th>הגדרה</th><th>תשובתך</th><th>תשובות אפשריות</th><th>ניקוד</th>");
    Score = 0;
    div.find(".question").each(function () {
        i = parseInt($(this).attr("QuestionNumber"));
        userAnswer = $(this).find("input").val();
        userCorrect = data[i][1].indexOf(userAnswer) >= 0;
        userScore = userCorrect ? Math.floor(userAnswer.length * 10 / data[i][1].length) : 0;
        table.append(
            $("<tr/>").append($("<td style='max-width:200px;white-space:initial;'/>").text(data[i][0]))
            .append($("<td/>").css("color", userCorrect ? "green" : "red").text(userAnswer))
            .append($("<td style='max-width:300px;white-space:initial;'/>").text(data[i][1]))
            .append($("<td/>").text(userScore)));
        Score += userScore;
    });
    $("#Game").fadeOut(100, function () {
        $(this).html(table).prepend("<br/>").prepend($("<div id='restartButton' class='menu_button'>שחק שוב!<br/><br/><img src='graphics/play.jpg' height='50'></div>").click(InitGame)).append("<br/> ציונך הוא: <b>" + Score + "</b><br/><br/><h4>הכנס את התוצאה שלך לטבלת המנצחים!</h4>שם:<br/>")
        .append($("<form/>").append("<input id='name' class='nice'/><br/><br/><input type='submit' value='שלח!' class='nice'/>").submit(function (e) {
            e.preventDefault();
            SubmitScoring($.trim($("#name").val()), Score);
            $("#Game").fadeOut(300);
        })).append("<br /><br /><br />").fadeIn(fadeConst);
    });
}

function updateTimer(timer, time) {
    cetiSec = time % 100;
    if (cetiSec < 10) cetiSec = "0" + cetiSec;
    $(timer).children("b").text(Math.floor(time / 100));
    $(timer).children("sup").text(cetiSec);
    return timer;
}

function addQuestionDiv(data, i, div) {
    if (i >= data.length)
        if (div.children().first().is("h3"))
            return finishGame(data, div);
        else $("<h3/>").text("נגמרו ההגדרות, לחץ אנטר לסיום המשחק").prependTo(div.prepend("<br />"));
    else {
        $("<div/>").attr("QuestionNumber", i).addClass("question").append($("<label/>").text(data[i][0] + " (" + data[i][1][0].length + ")").append("<br />").append($("<input/>").focus(function () {
            $(".current").removeClass("current").stop().fadeTo(1000, 0.62);
            cur = $(this).css("color", "black").parents(".question");
            cur.addClass("current").stop().fadeTo(500, 1);
            div.data('active', cur).lavalamp('update');
            $('html, body').stop(true).animate({ "scrollTop": Math.max(cur.offset().top - ($(window).height() - cur.outerHeight()) / 2, 0) }, 1000);
        }).keyup(function (e) {
            if (e.which == 13 || e.which == 38) {
                current = $(".current").prevAll(".question").first();
                if (current.length == 0)
                    addQuestionDiv(data, parseInt($(".current").attr("QuestionNumber")) + 1, div);
                else current.find("input").focus().select();
            }
            else if (e.which == 40) {
                current = $(".current").nextAll(".question").first();
                if (current.length > 0) current.find("input").focus().select();
            }
        }).focusout(function () {
            $(this).css("color", data[i][1].indexOf($(this).val()) >= 0 ? "green" : "red");
        })).hide().show(fadeConst)).prependTo(div.prepend("<br />")).addClass("active").find("input").focus();
    }
    div.lavalamp('update');
}

function StartGame(div, timer, data) {
    time = 6000;
    clearInterval(parseInt($("#timer").attr("timerID")));
    timer.attr("timerID", setInterval(function () {
        updateTimer(timer, time--);
        if (time < 1000)
            timer.css("color", "red");
        if (time <= 0)
            finishGame(data, div);
    }, 10));
    div.lavalamp({ enableHover: false });
    addQuestionDiv(data, 0, div);
    div.data('active', $(".current").first()).lavalamp('update');
}

function InitGame() {
    divGame = $("#Game");
    divGame.html($("<h3/>").text("טוען את המשחק...")).append("<img src='graphics/MG_Spinner.gif' />").fadeIn(300);
    $.get("/getDefinitions.html")
    .done(function (str) {
        if (divGame.is(':empty')) return; //this means 'return to main menu' called before ajax finished.
        str = $("<div/>").html(str).text(); // important!
        data = JSON.parse(str);
        divGame.stop().fadeOut(300, function () {
            divGame.empty();
            div = $("<div/>").appendTo(divGame);
            timer = $("<div id='timer'/>").append("<b/>").append("<sup/>");
            updateTimer(timer, 6000);
            timerButton = $("<div id='timerButton' class='menu_button'/>").html("סיים משחק!<br/>").append(timer).appendTo(divGame).hide().click(function (e) {
                finishGame(data, div);
            });
            $("<h1 style='color:Red;'/>").text('3').appendTo(div.empty().fadeIn(300)).fadeOut(1500);
            setTimeout(function () {
                $("<h1 style='color:Red;'/>").text('2').appendTo(div.empty()).fadeOut(1500);
                setTimeout(function () {
                    $("<h1 style='color:Red;'/>").text('1').appendTo(div.empty()).fadeOut(1500);
                    setTimeout(function () {
                        if (divGame.find(div).length > 0) { //this means 'return to main menu' called before ajax finished.
                            timerButton.fadeIn(fadeConst);
                            StartGame(div.html("<br/>"), timer, data);
                        }
                    }, 1000);
                }, 1000);
            }, 1000);
            divGame.fadeIn(100);
        });
    }).fail(function (a, b) {
        alert("אופס, קרתה טעות. קורה לטובים ביותר. הנה דברים שאין סיבה שתקרא:\n" + b);
        showMain();
    });
}

function SubmitScoring(name, score) {
    $("#scoringBoard").html($("<h3/>").text("מוריד את טבלת המנצחים...")).append("<img src='graphics/MG_Spinner.gif' />").fadeIn(fadeConst);
    $.get("/ScoringBoard.html", { "name": name || "", "score": score || "" }).done(function (data) {
        $("#scoringBoard").stop().fadeOut(300, function () {
            $(this).html(data).fadeIn(300);
        });
    }).fail(function (a, b) {
        alert(" הורדת טבלת המנצחים נכשלה, עמכם הסליחה.");
        showMain();
    });
}

function allowOnly(selector_string, allowed) {
    basic = "אבגדהוזחטיכלמנסעפצקרשתךםןףץ \r";
    // usual awesome gal hack
    $(document).on("keypress", selector_string, function (e) {
        //err = $("#errorMessage").empty();
        if ((basic + allowed).indexOf(String.fromCharCode(e.which)) < 0) {
            //err.fadeOut(150).append("תו זה אינו חוקי!").fadeIn(150);
            return false;
        }
        /*else {
        err.html("<br />");
        }*/
    });
}

$(document).ready(function () {
    $("#main").hide().css({ "margin-top": $(window).height() * 1.0 / 4 });
    $("#main>div:not(#main_menu)").hide();
    $("#backButton").click(StopGame);
    $(document).on("mouseenter", ".menu_button", function () {
        $(this).animate({ "marginTop": 0, "bottom": "+=20" }, 150);
    });
    $(document).on("mouseleave", ".menu_button", function () {
        $(this).animate({ "marginTop": 20, "bottom": "-=20" }, 150);
    });
    allowOnly("div[questionnumber] input", "");
    allowOnly("#name", "0123456789!,'-;()\"");
    $("#main_menu .menu_button").css("background-color", function (ind, old) {
        return ["rgb(172, 232, 130)", "rgb(20, 156, 172)", "rgb(237, 210, 119)", "rgb(230, 123, 105)"][ind];
    }).hide().each(function (i) {
        $(this).click(i, function () {
            var f;
            switch (i) {
                case 0: f = InitGame; break;
                case 1: f = function () {
                    $("#help").fadeIn(fadeConst);
                }; break;
                case 2: f = SubmitScoring; break;
            }
            hideMain(function () {
                $("#backButton").delay(200).fadeIn(fadeConst);
                f();
            });
        });
    });
});
window.onload = showMain;
