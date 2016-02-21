/*jslint node: true */

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
/*global appScreen*/
/*global gIO*/
/*global util*/
/*global lang*/
/*global tracker*/
/*global sCGlobal*/
/*global scBaseUID*/
/*global gBase*/
/*global window*/
/*global note*/

"use strict";

function workspace() {
    var that = gBase(),
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
            if (comp.toMainOutput) {
                log.info("adding output:" + comp.type() + " " + comp.uid());
                that.mixerOut.addInput(comp.getSequencer().getSComp());

                comp.on("removeOutput", function (sComp) {
                    log.info("removing output:" + comp.type() + " " + comp.uid());
                    that.mixerOut.delInput(sComp);
                });
            }

            comp.setArgs(data.sArgs);
            comp.setCurrentMs(timeTracker.currentMs(), timeTracker.currentStepMs());
            //comp.saveInitialArgs();
            comp.move(data.x, data.y);
        } else {
            log.error("workspace.createSComp: dont know type:" + data.type);
            return undefined;
        }
        return comp;
    }

    function initSComp() {
        that.iOpenContextMenu = function (e, mouse) {
            util.unused(e);
            var menu = wMenu().move(mouse.x - 20, mouse.y - 20),
                sConstructor;

            function menuEntry(id, xPos, yPos) {
                return function () {
                    var comp = createSComp({type: id, x: xPos, y: yPos});
                    comp.iWasSelected();
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
            toPort = toSCComp.getPort(con.to.isOut, con.to.portType);
            fromPort = fromSCComp.getPort(con.from.isOut, con.from.portType);

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
                nodes[i].setCurrentMs(timeTracker.currentMs(), timeTracker.currentStepMs());
            }
        }

        that.emit("timeUpdated", timeTracker.currentMs());
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

    that.setCurrentMs = function (ms) {
        if (timeTracker.setCurrentMs(ms)) {
            updateTime();
        }
        return that;
    };

    that.setTotalMs = function (ms) {
        timeTracker.setTotalMs(ms);
        updateTime();
        that.emit("totalTimeUpdated", timeTracker.totalMs());
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

    that.modifySCompState = function (comp, operation, selection, states) {
        var seq = comp.getSequencer(),
            i,
            isLengthBased,
            stepForOpen,
            currentArgs;

        if (!comp) {
            log.error("workspace.modifySCompState: no comp");
            return;
        }
        isLengthBased = comp.stateMode() === "notes";

        //FIXME: cant do it like this when moving (relative!)
        selection.startMs = timeTracker.quantizeValue(selection.startMs);
        selection.endMs = timeTracker.quantizeValue(selection.endMs, true);
        selection.lenMs = timeTracker.quantizeValue(selection.lenMs, true);

        if (isLengthBased) {
            stepForOpen = {gate: true, freq: selection.startValue};
        }

        if (operation === "delete") {
            for (i = 0; i < states.length; i += 1) {
                seq.remove(states[i]);
            }
        } else if (operation === "duplicate") {
            for (i = 0; i < states.length; i += 1) {
                seq.duplicate(states[i]);
            }
        } else if (operation === "updateStateToCurrent") {
            for (i = 0; i < states.length; i += 1) {
                currentArgs = seq.getSComp().getArgs();
                //FIXME: ugly special case:
                if (comp.stateMode() === "notes") {
                    if (currentArgs.hasOwnProperty("gate")) {
                        currentArgs.gate = true;
                    }
                }
                states[i].updateArgs(currentArgs);
            }
        } else if (operation === "moveStart") {
            for (i = 0; i < states.length; i += 1) {
                states[i].moveStart();
            }
        } else if (operation === "move") {
            for (i = 0; i < states.length; i += 1) {
                states[i].move(selection.lenMs, selection.numNotes);
            }
            seq.sortSteps();
        } else if (operation === "moveOff") {
            for (i = 0; i < states.length; i += 1) {
                states[i].moveOff(selection.lenMs);
            }
            seq.sortSteps();
        } else if (operation === "beginNew") {
            if (!seq.openStep()) {
                seq.openAt(selection.startMs, stepForOpen, !isLengthBased);
                if (isLengthBased) {
                    seq.openStep().msOff = selection.endMs;
                }
            } else {
                if (isLengthBased) {
                    seq.openStep().msOff = selection.endMs;
                } else {
                    seq.openStep().ms = selection.endMs;
                }
            }
        } else if (operation === "endNew") {  //FIXME: notes vs values
            if (seq.openStep()) {
                seq.closeAt(selection.endMs, !isLengthBased);
            }
        }
        //re-apply state:
        comp.setCurrentMs(timeTracker.currentMs(), timeTracker.currentStepMs());
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
            that.emit("totalTimeUpdated", timeTracker.totalMs());
            //FIXME: make object args
            that.emit("timeParamsUpdated",
                      timeTracker.bpm(), timeTracker.quantization(),
                      timeTracker.measureMs(), timeTracker.quantizationOn());
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
        log.info("init audio, sample rate:" + out.sampleRate() + " channels " + out.numChannels());

        timeTracker = tracker(that.sampleRate());
        timeTracker.playbackFinished = function () {
            that.setPlayback(false); //triggers some close events, hence ms "hopping"
            that.setCurrentMs(0, 0);
        };
        out.runIndexUpdated = stepFrame;
        that.setTotalMs(60000);
        that.setTimeParams(120, 1 / 4, false);
        that.setLoop({isOn: false, ms0: 0, ms1: 0});
        setFrames(0);
        that.startAudio();
        return true;
    };

    that.setTimeParams = function (bpm, quant, quantOn) {
        timeTracker.setBpm(bpm);
        timeTracker.setQuantization(quant);
        timeTracker.setQuantizationOn(quantOn);

        that.emit("timeParamsUpdated", bpm, quant, timeTracker.measureMs(), quantOn);
    };

    that.sampleRate = function () {
        return out.sampleRate();
    };

    that.setPlayback = function (play) {
        timeTracker.setPlayback(play);
        that.emit("playbackUpdated", play);
    };

    that.setRecord = function (record) {
        sCGlobal.recordingOn = record;
    };

    that.setLoop = function (args) {
        timeTracker.setLoop(args);
        that.emit("loopUpdated", timeTracker.getLoop());
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

    that.setClass("workspace").top(appScreen.minY).h("100%");
    that.typeIs = "workspace";

    return that;
}
