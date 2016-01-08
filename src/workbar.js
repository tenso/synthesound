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
/*global document*/
/*global gui*/
/*global window*/
/*global gSlider*/

function workbar() {
    var that = gContainer(),
        timeScroll = gBase(),
        timeBar = wTimeBar(),
        play,
        record,
        marginX = 4,
        marginY = 6,
        buttonH = 16,
        minHeight = 46,
        initialHeight = 200,
        totalTime,
        sComp,
        bpmInput,
        quantInput,
        quantOn,
        zoomX,
        zoomY,
        recordOn,
        time,
        buttonGroup = gContainer().paddingRight(25),
        timeGroup = gContainer().paddingRight(25),
        quantGroup = gContainer().paddingRight(25);

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
            that.changeTimeParams(bpmInput.getValueInt(), 1 / quantInput.getValue(), quantOn.getValue());
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
        that.setTopOfBar(that.parentNode.offsetHeight - initialHeight);
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

    that.abs().bg("#fff");
    that.w("100%").bottom(0);

    //callbacks:
    that.changeCurrentMs = undefined;
    that.changeTotalMs = undefined;
    that.changeTimeParams = undefined;
    that.changePlayback = undefined;
    that.changeSize = undefined;

    play = gButton(">", updatePlayback, true).w(40).h(buttonH);
    record = gButton(lang.tr("rec"), updateRecord, true).bg("#f00").w(40).h(buttonH);
    record.setColor("#000", "#fff");

    time = gLabel("--:--:--").fontFamily("monospace");
    totalTime = gInput("--:--:--", updateTotalTime, "").fontFamily("monospace");

    bpmInput = gInput("", updateBpmAndQuantification, "bpm", 30).labelPos("left");
    quantInput = gInput("", updateBpmAndQuantification, "/", 30).labelPos("left");
    quantOn = gButton("1", updateBpmAndQuantification, true).w(20).h(buttonH);

    zoomX = gSlider(0, 100, 1200, function (value) {
        timeBar.w(value + "%");
        timeBar.resizeCanvas();
    }, true);

    zoomY = gSlider(0, 100, 400, function (value) {
        timeBar.h(value + "%");
        timeBar.resizeCanvas();
    });

    //buttons
    buttonGroup.addTabled(record);
    buttonGroup.addTabled(play);
    that.addTabled(buttonGroup);

    //time
    timeGroup.addTabled(time).addTabled(totalTime);
    that.addTabled(timeGroup);

    quantGroup.addTabled(bpmInput.paddingRight(10)).addTabled(quantOn).addTabled(quantInput);
    that.addTabled(quantGroup);

    //zoom
    zoomX.addTo(that).abs().right(marginX *2 + 10).top(marginY * 2);
    zoomY.addTo(that).abs().right(marginX).top(marginY + 24);


    //timeBar
    timeScroll.addTo(that).abs().left(marginX).right(marginX * 2 + 10).top(buttonH + 2 * marginY).bottom(0);
    timeScroll.overflow("scroll");

    timeBar.addTo(timeScroll).abs().left(0).top(0).w("100%").h("100%");

    timeBar.changeCurrentMs = function (ms) {
        if (typeof that.changeCurrentMs === "function") {
            that.changeCurrentMs(ms);
        }
    };

    that.setTopOfBar = function (y) {
        var newY = y;
        that.top(newY);

        if (that.getTop() < app.screen.minY) {
            newY = app.screen.minY;
            that.top(newY);
        }

        if (that.getH() < minHeight) {
            newY = that.parentNode.offsetHeight - minHeight;
            that.top(newY);
        }

        if (typeof that.changeTopPosition === "function") {
            that.changeTopPosition(newY);
        }
        timeBar.resizeCanvas();

        return that;
    };

    //keyboard and mouse

    that.onmousedown = function (e) {
        gui.captureMouse(e);
    };

    that.iMousePressAndMove = function (e, mouse) {
        that.setTopOfBar(e.pageY - mouse.captureOffsetInElement.y);
    };

    document.addEventListener("keydown", function (e) {
        var key = String.fromCharCode(e.keyCode).toLowerCase();

        if (key === " ") {
            e.preventDefault();
            play.set();
        }
    }, false);

    window.addEventListener("resize", function (e) {
        that.resizeCanvas();
    }, false);

    return that;
}
