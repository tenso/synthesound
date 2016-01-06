"use strict";
/*global gContainer*/
/*global gLabel*/
/*global gButton*/
/*global lang*/
/*global app*/
/*global wTimeBar*/
/*global util*/
/*global gInput*/
/*global log*/
/*global gBase*/

function workbar() {
    var that = gContainer(),
        timeScroll = gBase(),
        timeBar = wTimeBar(),
        play,
        record,
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
        recordOn,
        time,
        buttonGroup = gContainer(),
        timeGroup = gContainer(),
        zoomGroup = gContainer();

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

    function updateTotalTime() {
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

    function updatePlayback() {
        if (typeof that.changePlayback === "function") {
            that.changePlayback(play.getValue());
        }
    }

    function updateRecord() {
        recordOn = record.getValue();
        if (typeof that.changeRecord === "function") {
            that.changeRecord(recordOn);
        }
    }

    that.resizeCanvas = function () {
        timeBar.resizeCanvas();
        return that;
    };

    that.setTime = function (currentMs) {
        time.setValue(util.msToString(currentMs));
        timeBar.setCurrentMs(currentMs);
        return that;
    };

    that.setTotalTime = function (totalMs) {
        totalTime.setValue(util.msToString(totalMs));
        timeBar.setTotalMs(totalMs);
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

    that.abs().z(10000).bg("#fff");
    that.w("100%").h(app.screen.maxBottom).bottom(0);

    //callbacks:
    that.changeCurrentMs = undefined;
    that.changeTotalMs = undefined;
    that.changeTimeParams = undefined;
    that.changePlayback = undefined;

    play = gButton(">", updatePlayback, true).w(40).h(buttonH);
    record = gButton(lang.tr("rec"), updateRecord, true).bg("#f00").w(40).h(buttonH);
    record.setColor("#000", "#fff");

    time = gLabel("--:--:--").fontFamily("monospace");
    totalTime = gInput("--:--:--", updateTotalTime, "").fontFamily("monospace");

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

    //buttons
    buttonGroup.addTabled(record);
    buttonGroup.addTabled(play);
    that.addTabled(buttonGroup);

    //time
    timeGroup.addTabled(time).addTabled(totalTime).addTabled(bpmInput).addTabled(quantInput);
    that.addTabled(timeGroup);

    //zoom
    zoomGroup.addTabled(zoomX).addTabled(zoomY);
    that.addTabled(zoomGroup);

    //timeBar
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
