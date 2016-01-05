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
/*global gBase*/

function workbar(workspace) {
    var that = gWidget(),
        timeScroll = gBase(),
        timeBar = wTimeBar(),
        stop,
        play,
        marginX = 4,
        marginY = 6,
        buttonH = 16,
        totalTime,
        sComp,
        toggleSize,
        bpmInput,
        quantInput,
        zoomX,
        zoomY,
        time;

    /*FIXME: render sArgs, move*/

    function renderEvents(canvas, ctx, currentMs, totalMs, pixelsPerMs) {
        if (!sComp) {
            log.error("workbar.renderEvents: no sComp");
            return that;
        }
        var sArgs = sComp.getArgs(),
            type,
            colors = ["#000", "#f00", "#00f"],
            currentColor = 0,
            i,
            timeX;

        for (type in sArgs) {
            if (sArgs.hasOwnProperty(type)) {
                ctx.beginPath();
                ctx.strokeStyle = colors[currentColor];

                for (i = 0; i < sArgs[type].length; i += 1) {
                    timeX = sArgs[type][i].ms * pixelsPerMs;
                    ctx.moveTo(timeX,  0);
                    ctx.lineTo(timeX, canvas.height);
                }

                ctx.stroke();

                currentColor += 1;
                currentColor %= colors.length;
            }
        }
        return that;
    }

    /**/

    function updateBpmAndQuantification() {
        if (typeof that.changeTimeParams === "function") {
            that.changeTimeParams(bpmInput.getValueInt(), 1 / quantInput.getValue());
        }
    }

    function setTotalTime() {
        var total = util.stringToMs(totalTime.getValue());
        if (typeof that.changeTotalMs === "function") {
            that.changeTotalMs(total);
        }
        return that;
    }

    function zoomTimeBar() {
        timeBar.w(zoomX.getValueInt() + "%").h(zoomY.getValueInt() + "%");
        timeBar.resizeCanvas();
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
        return that;
    };

    that.setTimeParams = function (bpm, quant, measureMs) {
        bpmInput.setValue(bpm, true);
        quantInput.setValue(1 / quant, true);
        timeBar.setTimeParams(bpm, quant, measureMs);
    };

    that.setCurrentSComp = function (comp) {
        sComp = comp;

        if (!comp) {
            timeBar.setRenderer(undefined);
        } else {
            timeBar.setRenderer(renderEvents);
        }
        return that;
    };

    that.z(10000).border("0").radius(0).padding(0).canMove(false);
    that.w("100%").h(app.screen.maxBottom).bottom(0);

    //callbacks:
    that.changeCurrentMs = undefined;
    that.changeTotalMs = undefined;
    that.changeTimeParams = undefined;

    stop = gButton(lang.tr("stop"), function () {
        workspace.stop();
    }).bg("#f00").w(40).h(buttonH);

    play = gButton(">", function () {
        workspace.play();
    }).w(40).h(buttonH);
    time = gLabel("--:--:--").fontFamily("monospace");
    totalTime = gInput("--:--:--", setTotalTime, "").fontFamily("monospace");

    bpmInput = gInput("", updateBpmAndQuantification, "bpm", 30).labelPos("left");
    quantInput = gInput("", updateBpmAndQuantification, "quant 1/", 30).labelPos("left");

    zoomX = gInput("100", zoomTimeBar, "%", 30).labelPos("left");
    zoomY = gInput("100", zoomTimeBar, "x %", 30).labelPos("left");

    toggleSize = gButton("^", function () {
        if (that.getH() > app.screen.maxBottom) {
            that.h(app.screen.maxBottom);
            toggleSize.setTitle("^");
        } else {
            that.h("80%");
            toggleSize.setTitle("-");
        }
        timeBar.resizeCanvas();
    });

    stop.addTo(that).abs().x(marginX).y(marginY);
    play.addTo(that).abs().x(60 + marginX).y(marginY);
    time.addTo(that).abs().x(120 + marginX).y(marginY);
    totalTime.addTo(that).abs().x(200 + marginX).y(marginY);
    bpmInput.addTo(that).abs().x(300 + marginX).y(marginY);
    quantInput.addTo(that).abs().x(380 + marginX).y(marginY);
    zoomX.addTo(that).abs().x(600 + marginX).y(marginY);
    zoomY.addTo(that).abs().x(660 + marginX).y(marginY);

    timeScroll.addTo(that).abs().left(marginX).right(marginX).top(buttonH + 2 * marginY).bottom(0);
    timeScroll.overflow("scroll");

    toggleSize.addTo(that).abs().right(marginX).y(marginY);
    timeBar.addTo(timeScroll).abs().left(0).top(0).w("100%").h("100%");

    timeBar.changeCurrentMs = function (ms) {
        if (typeof that.changeCurrentMs === "function") {
            that.changeCurrentMs(ms);
        }
    };

    return that;
}
