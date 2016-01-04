"use strict";
/*global gWidget*/
/*global gLabel*/
/*global gButton*/
/*global lang*/
/*global app*/
/*global wTimeBar*/

function workbar(workspace) {
    var that = gWidget(),
        timeBar = wTimeBar(),
        stop,
        play,
        marginX = 4,
        marginY = 4,
        buttonH = 16,
        time;

    that.resizeCanvas = function () {
        timeBar.resizeCanvas();
        return that;
    };

    that.changeMs = undefined;

    stop = gButton(lang.tr("stop"), function () {
        workspace.stop();
    }).bg("#f00").w(40).h(buttonH);

    play = gButton(">", function () {
        workspace.play();
    }).w(40).h(buttonH);
    time = gLabel("--:--:--").fontFamily("monospace");

    that.z(10000).border("0").h(app.screen.maxBottom).radius(0).padding(0).canMove(false).bottom(0);
    that.w("100%");

    stop.addTo(that).abs().x(marginX).y(marginY);
    play.addTo(that).abs().x(60 + marginX).y(marginY);
    time.addTo(that).abs().x(120 + marginX).y(marginY);
    timeBar.addTo(that).abs().left(marginX).right(marginX).top(buttonH + 2 * marginY).bottom(marginY);

    timeBar.changeMs = function (ms) {
        if (typeof that.changeMs === "function") {
            that.changeMs(ms);
        }
    };

    workspace.timeUpdated = function (timeStr, currentMs, totalMs) {
        time.setValue(timeStr);
        timeBar.setTotalMs(totalMs);
        timeBar.setCurrentMs(currentMs);
    };

    return that;
}
