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
        toggleSize,
        bpmInput,
        quantInput,
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
            that.changeTimeParams(bpmInput.getValueInt(), quantInput.getValueInt());
        }
    }

    function setTotalTime() {
        var total = util.stringToMs(totalTime.getValue());
        if (typeof that.changeTotalMs === "function") {
            that.changeTotalMs(total);
        }
        return that;
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

    that.setTimeParams = function (bpm, quant) {
        bpmInput.setValue(bpm);
        quantInput.setValue(quant);
        timeBar.setTimeParams(bpm, quant);
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

    that.z(10000).border("0").h(app.screen.maxBottom).radius(0).padding(0).canMove(false).bottom(0);
    that.w("100%");

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
    quantInput.addTo(that).abs().x(400 + marginX).y(marginY);

    toggleSize.addTo(that).abs().right(marginX).y(marginY);

    timeBar.addTo(that).abs().left(marginX).right(marginX).top(buttonH + 2 * marginY).bottom(marginY);

    timeBar.changeCurrentMs = function (ms) {
        if (typeof that.changeCurrentMs === "function") {
            that.changeCurrentMs(ms);
        }
    };

    return that;
}
