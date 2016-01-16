"use strict";
/*global log*/
/*global test*/
/*global sOutNode*/
/*global sMix*/
/*global sCScope*/
/*global sCOut*/
/*global sCGen*/
/*global sCVKey*/
/*global sCAdsr*/
/*global sCDelay*/
/*global sCMix*/
/*global sCConst*/
/*global sCOp*/
/*global sCNotePitch*/
/*global wMenu*/
/*global app*/
/*global gIO*/
/*global util*/
/*global lang*/
/*global tracker*/
/*global sCGlobal*/
/*global scBaseUID*/
/*global gBase*/
/*global window*/
/*global note*/

function workspace() {
    var that = gBase().setClass("workspace").top(app.screen.minY).h("100%"),
        out,
        audioCtx,
        AudioContext = window.AudioContext || window.webkitAudioContext,
        audioRunning = false,
        timeTracker,
        constructorMap = {
            sCGen: sCGen,
            sCMix: sCMix,
            sCDelay: sCDelay,
            sCAdsr: sCAdsr,
            sCOut: sCOut,
            sCVKey: sCVKey,
            sCScope: sCScope,
            sCConst: sCConst,
            sCOp: sCOp,
            sCNotePitch: sCNotePitch
        };


    function findSCComp(uid) {
        var nodes =  that.childNodes,
            i;

        for (i = 0; i < nodes.length; i += 1) {
            if (nodes[i].uid) {
                if (nodes[i].uid() === uid) {
                    return nodes[i];
                }
            }
        }
        return undefined;
    }

    function createSComp(data) {
        var comp;
        if (data.uid >= scBaseUID.peek()) {
            scBaseUID.bumpTo(data.uid + 1);
        }
        if (constructorMap.hasOwnProperty(data.type)) {
            comp = constructorMap[data.type](that, data.uid);
            comp.setArgs(data.sArgs);
            comp.setCurrentMs(timeTracker.currentStepMs());
            comp.saveArgs(0); //add inital state as ms=0
            comp.move(data.x, data.y);
        } else {
            log.error("workspace: dont know sId:" + data.type);
        }
        return undefined;
    }

    function initSComp() {
        that.iOpenContextMenu = function (e, mouse) {
            util.unused(e);
            var menu = wMenu().move(mouse.x - 20, mouse.y - 20),
                sConstructor;

            function menuEntry(id, xPos, yPos) {
                return function () {
                    createSComp({type: id, x: xPos, y: yPos});
                    menu.remove();
                };
            }

            that.add(menu);

            for (sConstructor in constructorMap) {
                if (constructorMap.hasOwnProperty(sConstructor)) {
                    menu.addRow(lang.tr(sConstructor), menuEntry(sConstructor, mouse.x, mouse.y));
                }
            }
        };
    }

    function addConnection(con) {
        var toSCComp,
            toPort,
            fromSCComp,
            fromPort;

        toSCComp = findSCComp(con.to.uid);
        fromSCComp = findSCComp(con.from.uid);

        if (toSCComp && fromSCComp) {
            toPort = toSCComp.getPort(con.to.portName, con.to.isOut, con.to.portType);
            fromPort = fromSCComp.getPort(con.from.portName, con.from.isOut, con.from.portType);

            if (toPort && fromPort) {
                gIO.connectPorts(fromPort, toPort);
            } else {
                log.error("did not find ports");
            }
        } else {
            log.error("did not find comps");
            log.obj(con);
        }
    }

    function offsetDataUid(data, offset) {
        var param;
        for (param in data) {
            if (data.hasOwnProperty(param)) {
                if (util.isCollection(data[param])) {
                    offsetDataUid(data[param], offset);
                } else if (param === "uid") {
                    data[param] += offset;
                }
            }
        }
    }

    function updateTime() {
        var nodes =  that.childNodes,
            i;

        for (i = 0; i < nodes.length; i += 1) {
            if (typeof nodes[i].setCurrentMs === "function") {
                nodes[i].setCurrentMs(timeTracker.currentStepMs());
            }
        }

        if (typeof that.timeUpdated === "function") {
            that.timeUpdated(timeTracker.currentStepMs());
        }

        if (timeTracker.currentStepMs() >= timeTracker.totalMs()) {
            that.setCurrentMs(0);
            that.setPlayback(false);
        }
    }

    function stepFrame(frames) {
        if (timeTracker.stepFrames(frames)) {
            updateTime();
        }
    }

    function setFrames(frames) {
        if (timeTracker.setFrames(frames)) {
            updateTime();
        }
    }

    function isWithinSelection(step, valueType, selection) {
        if (valueType === "") {
            return (step.ms >= selection.startMs
                && step.ms <= selection.endMs);
        }
        return (step.ms >= selection.startMs
            && step.ms <= selection.endMs
            && step.args[valueType] >= selection.startValue
            && step.args[valueType] <= selection.endValue);
    }

    that.setCurrentMs = function (ms) {
        if (timeTracker.setCurrentMs(ms)) {
            updateTime();
        }
        return that;
    };

    that.setTotalMs = function (ms) {
        timeTracker.setTotalMs(ms);
        updateTime();
        if (typeof that.totalTimeUpdated === "function") {
            that.totalTimeUpdated(timeTracker.totalMs());
        }
        return that;
    };

    that.data = function () {
        var nodes =  that.childNodes,
            i,
            data = {
                app: app,
                tracker: {},
                workspace: []
            };

        for (i = 0; i < nodes.length; i += 1) {
            if (typeof nodes[i].typeClass === "string") {
                if (nodes[i].typeClass === "sCBase") {
                    data.workspace.push(nodes[i].data());
                }
            }
        }
        data.tracker = timeTracker.data();
        data.connections = gIO.data();

        return data;
    };

    that.modifySCompState = function (comp, operation, selection) {
        var seqs = comp.getSequencers(),
            type,
            i;

        if (operation === "delete") {
            for (type in seqs) {
                if (seqs.hasOwnProperty(type)) {
                    for (i = 0; i < seqs[type].numSteps(); i += 0) {
                        if (isWithinSelection(seqs[type].step(i), selection.valueType, selection)) {
                            seqs[type].removeIndex(i);
                        } else {
                            i += 1;
                        }
                    }
                }
            }
        }
        //re-apply state:
        comp.setCurrentMs(timeTracker.currentStepMs());

        if (typeof sCGlobal.currentUpdated === "function") {
            if (sCGlobal.current === comp) {
                sCGlobal.currentUpdated(comp);
            }
        }
    };

    that.addSCompNote = function (sComp, selection, minNote, maxNote) {
        var noteFreq,
            seq;

        selection.startMs = timeTracker.quantizeValue(selection.startMs);
        selection.endMs = timeTracker.quantizeValue(selection.endMs);

        if (sComp) {
            if (sComp.stateMode() === "notes") {
                seq = sComp.getSequencer();
                if (sComp && !seq.openStep()) {
                    noteFreq = note.hz(parseInt(minNote + (1.0 - selection.endH) * (maxNote - minNote), 10));
                    seq.openAt(selection.startMs, {gate: true, freq: noteFreq});
                    seq.openStep().msOff = selection.endMs;
                } else {
                    seq.openStep().msOff = selection.endMs;
                }
            } else {
                log.error("workspace.addSCompNote: comp is not note-based");
            }
        }
    };

    that.finishSCompNote = function (sComp, selection) {
        var seq;

        selection.startMs = timeTracker.quantizeValue(selection.startMs);
        selection.endMs = timeTracker.quantizeValue(selection.endMs);

        if (sComp) {
            if (sComp.stateMode() === "notes") {
                seq = sComp.getSequencer();
                if (seq.openStep()) {
                    seq.closeAt(selection.endMs);
                }
            } else {
                log.error("workspace.finishSCompNote: comp is not note-based");
            }
        }
    };

    that.loadWorkspace = function (data) {
        var i,
            uidOffset = 0;

        log.info("loading from version: " + data.app.ver);

        log.info("reset tracker time");
        timeTracker.setFrames(0);

        uidOffset = scBaseUID.peek();
        log.info("workspace uid: " + uidOffset + ", offset loaddata");
        offsetDataUid(data, uidOffset);
        log.info("create components");
        for (i = 0; i < data.workspace.length; i += 1) {
            createSComp(data.workspace[i]);
        }

        log.info("create connections");
        for (i = 0; i < data.connections.length; i += 1) {
            addConnection(data.connections[i]);
        }

        if (that.onworkspacechanged) {
            that.onworkspacechanged();
        }

        log.info("load tracker");
        if (data.tracker) {
            timeTracker.load(data.tracker);
            if (typeof that.totalTimeUpdated === "function") {
                that.totalTimeUpdated(timeTracker.totalMs());
            }
            if (typeof that.timeParamsUpdated === "function") {
                that.timeParamsUpdated(timeTracker.bpm(), timeTracker.quantization(),
                                       timeTracker.measureMs(), timeTracker.quantizationOn());
            }
            updateTime();
        } else {
            log.error("file is missing tracker data");
        }
    };

    that.init = function () {
        if (!test.verifyFunctionality(AudioContext, "audio.AudioContext") ||
                !test.verifyFunctionality(Array.prototype.fill, "Array.fill")) {
            return false;
        }
        audioCtx = new AudioContext();
        initSComp();
        that.mixerOut = sMix();

        //create actual output node:
        out = sOutNode(audioCtx, 2, 4096);
        out.setInput(that.mixerOut);
        log.info("init audio, sample rate:" + out.sampleRate + " channels " + out.channels);

        timeTracker = tracker(that.sampleRate());
        out.runIndexUpdated = stepFrame;
        that.setTotalMs(60000);
        that.setTimeParams(120, 1 / 4, false);
        setFrames(0);
        that.startAudio();
        return true;
    };

    that.setTimeParams = function (bpm, quant, quantOn) {
        timeTracker.setBpm(bpm);
        timeTracker.setQuantization(quant);
        timeTracker.setQuantizationOn(quantOn);

        if (typeof that.timeParamsUpdated === "function") {
            that.timeParamsUpdated(bpm, quant, timeTracker.measureMs(), quantOn);
        }
    };

    that.sampleRate = function () {
        return out.sampleRate;
    };

    that.setPlayback = function (play) {
        timeTracker.setPlayback(play);
        if (typeof that.playbackUpdated === "function") {
            that.playbackUpdated(play);
        }
    };

    that.setRecord = function (record) {
        sCGlobal.recordingOn = record;
    };

    that.startAudio = function () {
        if (audioRunning) {
            return false;
        }

        out.connect(audioCtx.destination);
        audioRunning = true;
        return true;
    };

    that.stopAudio = function (freq) {
        util.unused(freq);

        if (!audioRunning) {
            return false;
        }
        audioRunning = false;

        out.disconnect(audioCtx.destination);
        return true;
    };

    that.setViewHeight = function (h) {
        that.h(h - that.offsetTop + 1); //FIXME: dont know why +1 is needed
    };

    that.key = undefined; /*FIXME: globally coupled to sCVKey*/
    that.mixerOut = undefined; /*FIXME: globally coupled to sCOut*/

    //callbacks
    that.onworkspacechanged = undefined;
    that.timeUpdated = undefined;
    that.totalTimeUpdated = undefined;
    that.timeParamsUpdated = undefined;
    that.currentSCompUpdated = undefined;

    sCGlobal.currentUpdated = function (comp) {
        if (typeof that.currentSCompUpdated === "function") {
            that.currentSCompUpdated(comp);
        }
    };

    that.typeIs = "workspace";

    return that;
}
