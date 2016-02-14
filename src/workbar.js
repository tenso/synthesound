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
/*global note*/
/*global wNoteInfoBar*/
/*global event*/

function workbar() {
    var that = event(gContainer()),
        topBar = gContainer(),
        timeScroll = gBase(),
        timeBar = wTimeBar(),
        keys = {
            ctrl: false,
            shift: false
        },
        selectedStates = [],
        play,
        record,
        loop,
        loopParams = {
            isOn: false,
            ms0: 0,
            ms1: 0
        },
        marginX = 4,
        marginY = 6,
        buttonH = 16,
        minHeight = 46,
        initialHeight = 400,
        totalTime,
        moveActive = false,
        sComp,
        bpmInput,
        quantInput,
        quantOn,
        zoomX,
        zoomY,
        recordOn,
        time,
        colors = {
            selected: "#f88",
            normal: "#8f8"
        },
        minNote = 1, //FIXME move to infoBar?
        maxNote = 88,
        infoBar = wNoteInfoBar(minNote, maxNote),
        buttonGroup = gContainer().paddingRight(25),
        timeGroup = gContainer().paddingRight(25),
        quantGroup = gContainer().paddingRight(25);

    function isWithinSelection(step, valueType, selection) {
        if (valueType === "") {
            return (step.ms >= selection.minMs
                && step.ms <= selection.maxMs);
        }

        return (((step.ms >= selection.minMs && step.ms <= selection.maxMs)
                || (step.msOff >= selection.minMs && step.msOff <= selection.maxMs))
            && step.args[valueType] >= selection.startValue
            && step.args[valueType] <= selection.endValue);
    }

    function isSelectedState(state) {
        var i;
        for (i = 0; i < selectedStates.length; i += 1) {
            if (selectedStates[i] === state) {
                return true;
            }
        }
        return false;
    }

    function selectStates(selection, modify) {
        if (!sComp) {
            return;
        }
        var seq = sComp.getSequencer(),
            i,
            j,
            found,
            modifySet = [];

        for (i = 0; i < seq.numSteps(); i += 1) {
            if (isWithinSelection(seq.step(i), selection.valueType, selection)) {
                modifySet.push(seq.step(i));
            }
        }

        if (!modify) {
            selectedStates = modifySet;
        } else {
            for (i = 0; i < selectedStates.length; i += 0) {
                found = false;
                for (j = 0; j < modifySet.length; j += 1) {
                    //if found: remove, otherwise add
                    if (selectedStates[i] === modifySet[j]) {
                        selectedStates.splice(i, 1);
                        modifySet.splice(j, 1);
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    i += 1;
                }
            }
            selectedStates = selectedStates.concat(modifySet);
        }
        timeBar.draw();
    }

    function valueToNote(value) {
        return parseInt(minNote + (1.0 - value) * (maxNote - minNote), 10);
    }

    function scaleSelection(selection) {
        if (sComp && sComp.stateMode() === "notes") {
            selection.startValue = note.hz(valueToNote(selection.maxH));
            selection.endValue = note.hz(valueToNote(selection.minH));
            selection.numNotes = valueToNote(selection.endH) - valueToNote(selection.startH);
            selection.valueType = "freq";
        } else {
            selection.startValue = selection.startH;
            selection.endValue = selection.endH;
            selection.valueType = "";
        }
        selection.lenMs = selection.endMs - selection.startMs;
        selection.lenValue = selection.startValue - selection.endValue;
        return selection;
    }

    function selectAllStates() {
        timeBar.selectAll();
        selectStates(scaleSelection(timeBar.getSelection()));
    }

    function editSComp(operation) {
        var op = operation;
        if (operation === "move" || operation === "moveOff") {
            if (!moveActive) {
                moveActive = true;
                op = "moveStart";
            }
        } else if (operation === "moveEnd") {
            moveActive = false;
            return;
        }
        if (sComp) {
            that.emit("changeSCompState", sComp, op, scaleSelection(timeBar.getSelection()), selectedStates);
            timeBar.draw();
        }
    }

    function copySelectedStates() {
        editSComp("duplicate");
    }

    /*FIXME: render sArgs, move*/

    function renderPlain(canvas, ctx, currentMs, totalMs, pixelsPerMs, current) {
        var i,
            timeX;

        util.unused(currentMs);
        util.unused(totalMs);

        ctx.strokeStyle = "#aaa";
        ctx.beginPath();
        ctx.moveTo(0,  canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();

        ctx.lineWidth = 2;
        for (i = 0; i < current.length; i += 1) {
            if (isSelectedState(current[i])) {
                ctx.strokeStyle = colors.selected;
            } else {
                ctx.strokeStyle = colors.normal;
            }
            ctx.beginPath();
            timeX = current[i].ms * pixelsPerMs;
            ctx.moveTo(timeX,  0);
            ctx.lineTo(timeX, canvas.height);
            ctx.stroke();
        }
    }

    function renderNotes(canvas, ctx, currentMs, totalMs, pixelsPerMs, current) {
        var i,
            timeX,
            lenX,
            noteY,
            noteNum,
            y,
            pixelsPerNote = canvas.height / (maxNote - minNote);

        util.unused(totalMs);

        //draw note grid:
        for (i = 0; i < maxNote - minNote; i += 1) {
            ctx.beginPath();
            ctx.strokeStyle = "#aaa";
            y = i * pixelsPerNote;
            ctx.moveTo(0,  y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
        //draw notes:
        for (i = 0; i < current.length; i += 1) {
            if (current[i].hasOwnProperty("msOff")) {
                if (!current[i].args.hasOwnProperty("gate")) {
                    log.error("no gate for note");
                } else {
                    timeX = current[i].ms * pixelsPerMs;
                    if (current[i].msOff === -1) {
                        lenX = currentMs * pixelsPerMs - timeX;
                        if (lenX < 0) {
                            lenX = 0;
                        }
                    } else {
                        lenX = current[i].msOff * pixelsPerMs - timeX;
                    }

                    noteNum = note.note(current[i].args.freq);
                    noteY = canvas.height - (noteNum * pixelsPerNote);

                    if (isSelectedState(current[i])) {
                        ctx.fillStyle = colors.selected;
                    } else {
                        ctx.fillStyle = colors.normal;
                    }
                    ctx.fillRect(timeX, noteY, lenX, pixelsPerNote);
                }
            }
        }
    }


    function renderEvents(canvas, currentMs, totalMs, pixelsPerMs) {
        if (!sComp) {
            return;
        }
        var sArgs = sComp.getSequencer().data(),
            ctx = canvas.getContext("2d");

        if (!sComp) {
            log.error("workbar.renderEvents: no sComp");
            return that;
        }


        if (sComp.stateMode() === "notes") {
            renderNotes(canvas, ctx, currentMs, totalMs, pixelsPerMs, sArgs);
        } else {
            renderPlain(canvas, ctx, currentMs, totalMs, pixelsPerMs, sArgs);
        }
        return that;
    }

    /**/

    function updateBpmAndQuantification() {
        that.emit("changeTimeParams", bpmInput.getValueInt(), 1 / quantInput.getValue(), quantOn.getValue());
    }

    function updateTotalTime() {
        var total = util.stringToMs(totalTime.getValue());
        that.emit("changeTotalMs", total);
        return that;
    }

    function updatePlayback() {
        that.emit("changePlayback", play.getValue());
    }

    function updateLoop() {
        loopParams.isOn = loop.getValue();
        that.emit("changeLoop", loopParams);
    }

    function updateRecord() {
        recordOn = record.getValue();
        that.emit("changeRecord", recordOn);
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

    that.setTimeParams = function (bpm, quant, measureMs, qOn) {
        bpmInput.setValue(bpm, true);
        quantInput.setValue(1 / quant, true);
        quantOn.setValue(qOn, true);
        timeBar.setTimeParams(bpm, quant, measureMs);
    };

    that.setPlayback = function (isOn) {
        var seq;
        play.setValue(isOn, true);

        if (sComp) {
            seq = sComp.getSequencer();
            if (seq.openStep()) {
                log.d("closing open step");
                seq.closeAt();
            }
        }
    };

    that.setLoop = function (args) {
        loopParams = args;
        loop.setValue(loopParams.isOn, true);
        timeBar.setLoop(args);
    };

    that.setCurrentSComp = function (comp) {
        selectedStates = [];
        sComp = comp;
        timeBar.draw();
        return that;
    };

    that.currentSCompStateChanged = function () {
        if (selectedStates.length === 1 && !play.getValue()) {
            editSComp("updateStateToCurrent");
        }
    };

    that.abs().bg("#fff");
    that.w("100%").bottom(0);

    play = gButton(">", updatePlayback, true).w(40).h(buttonH);
    record = gButton(lang.tr("rec"), updateRecord, true).bg("#f44").w(40).h(buttonH);
    record.setColor("#000", "#fff");
    loop = gButton(lang.tr("loop"), updateLoop, true).w(40).h(buttonH);

    time = gLabel("--:--:--").fontFamily("monospace");
    totalTime = gInput("--:--:--", updateTotalTime, "").fontFamily("monospace");

    bpmInput = gInput("", updateBpmAndQuantification, "bpm", 30).labelPos("left");
    quantInput = gInput("", updateBpmAndQuantification, "/", 30).labelPos("left");
    quantOn = gButton("1", updateBpmAndQuantification, true).w(20).h(buttonH);

    zoomX = gSlider(0, 100, 1200, function (value) {
        timeBar.w("calc(" + value + "% - 40px)");
        timeBar.resizeCanvas();
    }, true);

    zoomY = gSlider(0, 100, 400, function (value) {
        timeBar.h(value + "%");
        timeBar.resizeCanvas();
        infoBar.h(value + "%");
        infoBar.resizeCanvas();
    });

    topBar.abs().cursor("ns-resize").left(0).right(0).top(0).h(2).bg("#888");
    that.add(topBar);
    //buttons
    buttonGroup.addTabled(record);
    buttonGroup.addTabled(play);
    buttonGroup.addTabled(loop);
    that.addTabled(buttonGroup);

    //time
    timeGroup.addTabled(time).addTabled(totalTime);
    that.addTabled(timeGroup);

    quantGroup.addTabled(bpmInput.paddingRight(10)).addTabled(quantOn).addTabled(quantInput);
    that.addTabled(quantGroup);

    //zoom
    zoomX.addTo(that).abs().right(marginX * 2 + 10).top(marginY * 2);
    zoomY.addTo(that).abs().right(marginX).top(marginY + 24);


    //timeBar
    timeScroll.addTo(that).abs().left(marginX).right(marginX * 2 + 10).top(buttonH + 2 * marginY).bottom(0);
    timeScroll.overflow("scroll");

    timeBar.addTo(timeScroll).abs().left(40).top(0).w("calc(100% - 40px)").h("100%");

    infoBar.addTo(timeScroll).abs().left(0).top(0).w(40).h("100%");
    timeScroll.onscroll = function () {
        infoBar.left(timeScroll.scrollLeft);
    };

    timeBar.on("changeCurrentMs", function (ms) {
        that.emit("changeCurrentMs", ms);
    });

    timeBar.on("selectionUpdated", function (selection, done) {
        util.unused(selection);
        if (sComp) {
            if (selectedStates.length) {
                editSComp(done ? "moveEnd" : (keys.shift ? "moveOff" : "move"));
            } else {
                editSComp(done ? "endNew" : "beginNew");
            }
        }
    });

    timeBar.on("newSelection", function (selection) {
        if (sComp) {
            selectStates(scaleSelection(selection), keys.shift);
        }
    });

    timeBar.on("renderOver", renderEvents);

    timeBar.on("loopUpdated", function (args) {
        util.setArgs(loopParams, args);
        that.emit("changeLoop", util.copyData(loopParams));
    });

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

        that.emit("changeTopPosition", newY);
        initialHeight = that.getH();
        timeBar.resizeCanvas();
        infoBar.resizeCanvas();
        return that;
    };

    //keyboard and mouse
    //FIXME: should really not use captureMouse and iMouse... routines here as that is not in workspace container.
    topBar.onmousedown = function (e) {
        gui.captureMouse(e);
    };

    topBar.iMousePressAndMove = function (e, mouse) {
        that.setTopOfBar(e.pageY - mouse.captureOffsetInElement.y);
    };

    document.addEventListener("keydown", function (e) {
        var key = String.fromCharCode(e.keyCode).toLowerCase();

        if (key === " ") {
            e.preventDefault();
            play.set();
        }
        if (e.keyCode === 46) {
            e.preventDefault();
            editSComp("delete");
            selectedStates = [];
        }
        keys.ctrl = e.ctrlKey;
        keys.shift = e.shiftKey;

        if (keys.ctrl && key === "a") {
            selectAllStates();
        }
        if (keys.ctrl && key === "c") {
            copySelectedStates();
        }

    }, false);

    document.addEventListener("keyup", function (e) {
        keys.ctrl = e.ctrlKey;
        keys.shift = e.shiftKey;
    }, false);

    that.addEventListener("wheel", function (e) {
        if (keys.ctrl) {
            e.preventDefault();
            if (keys.shift) {
                zoomX.setValue(zoomX.getValue() - e.deltaX / 2);
            } else {
                zoomY.setValue(zoomY.getValue() - e.deltaY / 2);
            }
        }
    }, false);

    window.addEventListener("resize", function () {
        that.resizeCanvas();
    }, false);

    that.setDefaults = function () {
        zoomX.setValue(400);
        zoomY.setValue(400);
        timeScroll.scrollTop = timeBar.getH() / 2;
    };
    return that;
}
