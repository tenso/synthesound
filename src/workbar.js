"use strict";
/*global gWidget*/
/*global gLabel*/
/*global gButton*/
/*global lang*/
/*global app*/
/*global wTimeBar*/
/*global util*/
/*global gInput*/
/*global log*/

function workbar(workspace) {
    var that = gWidget(),
        timeBar = wTimeBar(),
        stop,
        play,
        marginX = 4,
        marginY = 6,
        buttonH = 16,
        totalTime,
        sComp,
        time;

    function setTotalTime() {
        var total = util.stringToMs(totalTime.getValue());
        if (typeof that.changeTotalMs === "function") {
            that.changeTotalMs(total);
        }
    }

    that.resizeCanvas = function () {
        timeBar.resizeCanvas();
        return that;
    };

    that.setTime = function (currentMs, totalMs) {
        var strVal = util.msToString(totalMs);
        time.setValue(util.msToString(currentMs));
        if (totalTime.getValue() !== strVal) {
            totalTime.setValue(strVal);
        }
        timeBar.setTotalMs(totalMs);
        timeBar.setCurrentMs(currentMs);
    };

    that.setCurrentSComp = function (comp) {
        sComp = comp;

        if (!comp) {
            log.d("clear");
        } else {
            log.d("show comp:" + comp.uid());
        }
    };

    //callbacks:
    that.changeCurrentMs = undefined;
    that.changeTotalMs = undefined;

    stop = gButton(lang.tr("stop"), function () {
        workspace.stop();
    }).bg("#f00").w(40).h(buttonH);

    play = gButton(">", function () {
        workspace.play();
    }).w(40).h(buttonH);
    time = gLabel("--:--:--").fontFamily("monospace");
    totalTime = gInput("--:--:--", setTotalTime, "").fontFamily("monospace");

    that.z(10000).border("0").h(app.screen.maxBottom).radius(0).padding(0).canMove(false).bottom(0);
    that.w("100%");

    stop.addTo(that).abs().x(marginX).y(marginY);
    play.addTo(that).abs().x(60 + marginX).y(marginY);
    time.addTo(that).abs().x(120 + marginX).y(marginY);
    totalTime.addTo(that).abs().x(200 + marginX).y(marginY);
    timeBar.addTo(that).abs().left(marginX).right(marginX).top(buttonH + 2 * marginY).bottom(marginY);

    timeBar.changeCurrentMs = function (ms) {
        if (typeof that.changeCurrentMs === "function") {
            that.changeCurrentMs(ms);
        }
    };

    return that;
}
