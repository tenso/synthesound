/*jslint node: true */

/*global gContainer*/
/*global gLabel*/
/*global gButton*/
/*global lang*/
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

"use strict";

function workbar() {
    var that = gContainer(),
        topBar = gContainer(),
        timeScroll = gBase(),
        tracker = gBase(),
        timeBar = wTimeBar(),
        timeCanvas = timeBar.getCanvas(),
        keys = {
            ctrl: false,
            shift: false
        },
        selectedStates = [],
        play,
        record,
        currentMs = 0,
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
        totalMs,
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
        if (operation === "move") {
            if (!moveActive) {
                moveActive = true;
                op = "moveStart";
            }
        } else if (operation === "moveOff") {
            if (!moveActive) {
                moveActive = true;
                op = "moveOffStart";
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

    function renderPlain(canvas, current) {
        var i,
            timeX;

        canvas.lineWidth(1);
        canvas.strokeStyle("#aaa");
        canvas.line(0, 0.5, 1.0, 0.5);

        canvas.lineWidth(2);
        for (i = 0; i < current.length; i += 1) {
            if (isSelectedState(current[i])) {
                canvas.strokeStyle(colors.selected);
            } else {
                canvas.strokeStyle(colors.normal);
            }
            timeX = current[i].ms / totalMs;
            canvas.line(timeX,  0, timeX, 1.0);
        }
    }

    function renderNotes(canvas, current) {
        var i,
            timeX,
            lenX,
            noteY,
            noteNum,
            y,
            noteH = 1.0 / (maxNote - minNote);

        //draw note grid:
        canvas.strokeStyle("#aaa");
        for (i = 0; i < maxNote - minNote; i += 1) {
            y = i * noteH;
            canvas.line(0,  y, 1.0, y);
        }

        //draw notes:
        for (i = 0; i < current.length; i += 1) {
            if (current[i].hasOwnProperty("msOff")) {
                if (!current[i].args.hasOwnProperty("gate")) {
                    log.error("no gate for note");
                } else {
                    timeX = current[i].ms / totalMs;
                    if (current[i].msOff === -1) {
                        lenX = currentMs / totalMs - timeX;
                        if (lenX < 0) {
                            lenX = 0;
                        }
                    } else {
                        lenX = current[i].msOff / totalMs - timeX;
                    }

                    noteNum = note.note(current[i].args.freq);
                    noteY = 1.0 - (noteNum * noteH);

                    if (isSelectedState(current[i])) {
                        canvas.fillStyle(colors.selected);
                    } else {
                        canvas.fillStyle(colors.normal);
                    }
                    //FIXME: dont need to draw notes not in viewport!
                    canvas.fillRect(timeX, noteY, lenX, noteH);
                }
            }
        }
    }

    function renderEvents(canvas) {
        if (!sComp) {
            return;
        }
        var sArgs = sComp.getSequencer().data();

        if (!sComp) {
            log.error("workbar.renderEvents: no sComp");
            return that;
        }

        if (sComp.stateMode() === "notes") {
            renderNotes(canvas, sArgs);
        } else {
            renderPlain(canvas, sArgs);
        }
        return that;
    }

    /**/

    function updateBpmAndQuantification() {
        that.emit("changeTimeParams", bpmInput.getValueInt(), 1 / quantInput.getValue(), quantOn.getValue());
    }

    function updateTotalTime() {
        totalMs = util.stringToMs(totalTime.getValue());
        that.emit("changeTotalMs", totalMs);
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

    function updateScroll() {
        infoBar.scroll({
            y: timeScroll.scrollTop / timeScroll.scrollHeight
        });
        timeBar.scroll({
            x: timeScroll.scrollLeft / timeScroll.scrollWidth,
            y: timeScroll.scrollTop / timeScroll.scrollHeight
        });
    }

    that.resizeCanvas = function () {
        that.setTopOfBar(that.parentNode.offsetHeight - initialHeight);
        return that;
    };

    that.setTime = function (ms) {
        currentMs = ms;
        time.setValue(util.msToString(currentMs));
        timeBar.setCurrentMs(currentMs);
        return that;
    };

    that.setTotalTime = function (total) {
        totalMs = total;
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

    zoomX = gSlider(0, 0, 2400, function (value) {
        var songLenScale = totalMs / 60000;
        timeBar.w("calc(" + (100 + songLenScale * value) + "% - 40px)");
        timeBar.zoom({x: 1 + songLenScale * value / 100});
        updateScroll();
    }, true);

    zoomY = gSlider(0, 100, 1200, function (value) {
        timeBar.h(value + "%");
        timeBar.zoom({y: value / 100});
        infoBar.zoom({y: value / 100});
        updateScroll();
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

    tracker.addTo(that).abs().left(marginX).right(marginX * 2 + 10).top(buttonH + 2 * marginY).bottom(10);

    timeScroll.addTo(tracker);
    timeScroll.abs().w("100%").h("100%");
    timeScroll.overflow("scroll");
    timeBar.addTo(timeScroll).abs().left(40).top(0).right(0).bottom(0);

    infoBar.addTo(tracker).abs().left(0).top(0).w(40).h("calc(100% - 23px)");

    timeCanvas.addTo(tracker);
    timeCanvas.abs().left(40).top(0).w("calc(100% - 62px)").h("calc(100% - 23px)");

    timeScroll.onscroll = function () {
        updateScroll();
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

        if (that.getTop() < 0) {
            newY = 0;
            that.top(newY);
        }

        if (that.getH() < minHeight) {
            newY = that.parentNode.offsetHeight - minHeight;
            that.top(newY);
        }

        that.emit("changeTopPosition", newY);
        initialHeight = that.getH();
        timeCanvas.w("calc(100% - 62px)").h("calc(100% - 23px)"); //FIXME: why needed!?
        timeCanvas.resize(timeCanvas.getW(), timeCanvas.getH()); //FIXME: fill should be default
        infoBar.h("calc(100% - 23px)"); //FIXME: why needed!?
        infoBar.resize(infoBar.getW(), infoBar.getH());
        timeBar.scroll({
            x: timeScroll.scrollLeft / timeScroll.scrollWidth,
            y: timeScroll.scrollTop / timeScroll.scrollHeight
        });
        infoBar.scroll({
            y: timeScroll.scrollTop / timeScroll.scrollHeight
        });
        return that;
    };

    //keyboard and mouse
    //FIXME: should really not use captureMouse routines here as that is not in workspace container.
    topBar.onmousedown = function (e) {
        gui.captureMouse(e);
    };

    topBar.on("mousePressAndMove", function (e, mouse) {
        that.setTopOfBar(e.pageY - mouse.captureOffsetInElement.y);
    });

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
        //zoomX.setValue(400);
        //zoomY.setValue(400);
        timeScroll.scrollTop = timeBar.getH() / 2;
    };
    return that;
}
