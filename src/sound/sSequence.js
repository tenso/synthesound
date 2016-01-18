"use strict";
/*global test*/
/*global util*/
/*global log*/
/*global note*/

function addSequenceDataFunctions(that) {
    var moveStartData = {};

    that.moveStart = function () {
        moveStartData.ms = that.ms;
        moveStartData.msOff = that.msOff;
        if (that.args.hasOwnProperty("freq")) {
            moveStartData.note = note.note(that.args.freq);
        } else {
            moveStartData.note = 0;
        }
        if (that.argsOff.hasOwnProperty("freq")) {
            moveStartData.noteOff = note.note(that.argsOff.freq);
        } else {
            moveStartData.noteOff = 0;
        }
    };

    //FIXME: notes vs values: hardcoded to take numNotes!!
    that.move = function (movedMs, numNotes) {
        var arg;

        that.ms = moveStartData.ms + movedMs;
        that.msOff = moveStartData.msOff + movedMs;

        if (that.args.hasOwnProperty("freq")) {
            that.args.freq = note.hz(moveStartData.note + numNotes);
        }
        if (that.argsOff.hasOwnProperty("freq")) {
            that.argsOff.freq = note.hz(moveStartData.noteOff + numNotes);
        }
    };
    return that;
}

function sCloseSequanceData(seqData, sArgsOff, msOff) {
    seqData.msOff = msOff;
    seqData.argsOff = sArgsOff;
    return seqData;
}

function sOpenSequanceData(seqData) {
    seqData.msOff = -1;
    return seqData;
}

function sSequanceData(sArgs, msTime, sArgsOff, msTimeOff) {
    var that = {
            ms: msTime,
            args: sArgs
        };

    if (sArgsOff) {
        sCloseSequanceData(that, sArgsOff, msTimeOff);
    }
    return addSequenceDataFunctions(that);
}

function sSequence(sComp, sId, argUpdateCb) {
    var that = {},
        seqData = [],
        atMs = -1,
        openStep;

    //FIXME: does not enabled states with state.ms===atMs (need one more)!
    //       Used for now: this means that saveAt() will never trigger per automatic
    //FIXME: optimize!
    that.moveToMs = function (ms) {
        var i;

        if (ms < atMs) {
            //jump back in time, activate prev. state
            //NOTE: activate all prev steps so complete states are not needed
            atMs = -1;
        }

        for (i = 0; i < seqData.length; i += 1) {
            //enable states
            if (seqData[i].ms > atMs && seqData[i].ms <= ms) {
                sComp.setArgs(seqData[i].args);
                if (argUpdateCb) {
                    argUpdateCb(sId, seqData[i].args);
                }
            }
            //disable states
            if (seqData[i].hasOwnProperty("msOff") && seqData[i].msOff >= 0) {
                if (seqData[i].msOff > atMs && seqData[i].msOff <= ms) {
                    if (!seqData[i].hasOwnProperty("argsOff")) {
                        log.warn("sSequence.moveToMs: state has msOff but no argsOff, fetching argsOff from sComp");
                        seqData[i].argsOff = sComp.getArgsOff();
                    }
                    sComp.setArgs(seqData[i].argsOff);
                    if (argUpdateCb) {
                        argUpdateCb(sId, seqData[i].argsOff);
                    }
                }
            }
        }
        atMs = ms;
        return that;
    };

    //FIXME: dont want complete states, only changes
    that.saveAt = function (ms, seqArgs) {
        var i,
            at = typeof ms === "number" ? ms : atMs,
            data = seqArgs || sSequanceData(sComp.getArgs(), at);

        for (i = 0; i < seqData.length; i += 1) {
            if (at === seqData[i].ms) {
                seqData[i] = data;
                return data;
            }
            if (at < seqData[i].ms) {
                seqData.splice(i, 0, data);
                return data;
            }
        }
        seqData.splice(seqData.length, 0, data);
        return data;
    };

    that.hasArgAt = function (ms) {
        var i;

        for (i = 0; i < seqData.length; i += 1) {
            if (ms === seqData[i].ms) {
                return true;
            }
        }
        return false;
    };

    that.openAt = function (ms, args) {
        var at = typeof ms === "number" ? ms : atMs,
            data;

        if (openStep) {
            that.closeAt();
        }

        data = sSequanceData(args || sComp.getArgs(), at);
        sOpenSequanceData(data);
        openStep = that.saveAt(at, data);
        return openStep;
    };

    that.closeAt = function (ms) {
        var at = typeof ms === "number" ? ms : atMs;

        if (!openStep) {
            log.error("no open step");
            return that;
        }

        sCloseSequanceData(openStep, sComp.getArgsOff(), at);
        openStep = undefined;
        return that;
    };

    that.openStep = function () {
        return openStep;
    };

    that.setArgs = function (args) {
        return sComp.setArgs(args);
    };

    that.load = function (data) {
        var i;
        if (!util.isArray(data)) {
            log.warn("sSequence.load: non array data wont load");
            seqData = [];
        } else {
            seqData = data;

            for (i = 0; i < seqData.length; i += 1) {
                if (!seqData[i].move) {
                    addSequenceDataFunctions(seqData[i]);
                }
            }
        }
        return that;
    };

    that.data = function () {
        return seqData;
    };

    that.step = function (index) {
        if (index < 0 || index >= seqData.length) {
            log.error("sSequence.step: index oob:" + index);
            return;
        }
        return seqData[index];
    };

    that.numSteps = function () {
        return seqData.length;
    };

    that.remove = function (step) {
        var index = seqData.indexOf(step);
        if (index >= 0) {
            seqData.splice(index, 1);
        } else {
            log.error("sSequence.remove: no such element:");
            log.obj(step);
        }
        return that;
    };

    that.removeIndex = function (index) {
        if (index >= 0 && index < seqData.length) {
            seqData.splice(index, 1);
        } else {
            log.error("sSequence.removeIndex: no such index:" + index);
        }
        return that;
    };

    return that;
}

/* TEST */

function stubScomp() {
    var that = {},
        lastArgs = [],
        returnedArgs = [],
        saveCount = 0;

    that.setArgs = function (args) {
        lastArgs.push(args);
        return that;
    };

    that.getArgs = function () {
        returnedArgs.push("saved" + saveCount);
        saveCount += 1;
        return returnedArgs[returnedArgs.length - 1];
    };

    that.getArgsOff = function () {
        return "saved" + saveCount + "-off";
    };

    //introspect:
    that.argSeq = function (index) {
        return lastArgs[index];
    };

    that.argSeqLength = function () {
        return lastArgs.length;
    };

    return that;
}

function test_sSequence() {
    var sComp = stubScomp(),
        seq = sSequence(sComp, 0),
        saveData,
        loadData = [
            {
                ms: 0,
                args: "loaded0"
            },
            {
                ms: 1000,
                args: "loaded1"
            }
        ];

    seq.load(loadData);
    seq.moveToMs(0);
    seq.saveAt(750);
    test.verify(seq.step(0).args, "loaded0");
    test.verify(seq.step(0).ms, 0);
    test.verify(seq.step(1).args, "saved0");
    test.verify(seq.step(1).ms, 750);
    test.verify(seq.step(2).args, "loaded1");
    test.verify(seq.step(2).ms, 1000);

    test.verify(sComp.argSeq(0), "loaded0");
    test.verify(sComp.argSeqLength(), 1);

    seq.moveToMs(500);
    test.verify(sComp.argSeq(0), "loaded0");
    test.verify(sComp.argSeqLength(), 1);

    seq.moveToMs(1250);
    test.verify(sComp.argSeq(0), "loaded0");
    test.verify(sComp.argSeq(1), "saved0");
    test.verify(sComp.argSeq(2), "loaded1");
    test.verify(sComp.argSeqLength(), 3);

    seq.saveAt(1500);
    test.verify(sComp.argSeq(0), "loaded0");
    test.verify(sComp.argSeq(1), "saved0");
    test.verify(sComp.argSeq(2), "loaded1");
    test.verify(sComp.argSeqLength(), 3);

    seq.moveToMs(1500);
    test.verify(sComp.argSeq(0), "loaded0");
    test.verify(sComp.argSeq(1), "saved0");
    test.verify(sComp.argSeq(2), "loaded1");
    test.verify(sComp.argSeq(3), "saved1");
    test.verify(sComp.argSeqLength(), 4);

    saveData = seq.data();
    test.verify(saveData[0].ms, 0);
    test.verify(saveData[0].args, "loaded0");
    test.verify(saveData[1].ms, 750);
    test.verify(saveData[1].args, "saved0");
    test.verify(saveData[2].ms, 1000);
    test.verify(saveData[2].args, "loaded1");
    test.verify(saveData[3].ms, 1500);
    test.verify(saveData[3].args, "saved1");

    test.verify(seq.step(0).args, "loaded0");
    test.verify(seq.step(0).ms, 0);
    test.verify(seq.step(1).args, "saved0");
    test.verify(seq.step(1).ms, 750);
    test.verify(seq.step(2).args, "loaded1");
    test.verify(seq.step(2).ms, 1000);
    test.verify(seq.step(3).args, "saved1");
    test.verify(seq.step(3).ms, 1500);
}

function test_sSequenceOpenClose() {
    var sComp = stubScomp(),
        seq = sSequence(sComp, 0);

    //NOTE: this test will not apply any states to sComp automatically

    seq.moveToMs(1000);
    test.verify(sComp.argSeqLength(), 0);

    seq.openAt();
    test.verify(seq.numSteps(), 1);
    test.verify(seq.step(0).args, "saved0");
    test.verify(seq.step(0).ms, 1000);
    test.verify(seq.step(0).msOff, -1);

    seq.moveToMs(1250);
    test.verify(sComp.argSeqLength(), 0);

    seq.closeAt();
    test.verify(seq.numSteps(), 1);
    test.verify(seq.step(0).args, "saved0");
    test.verify(seq.step(0).ms, 1000);
    test.verify(seq.step(0).argsOff, "saved1-off");
    test.verify(seq.step(0).msOff, 1250);

    seq.moveToMs(1250);
    test.verify(sComp.argSeqLength(), 0);

    seq.openAt();
    test.verify(seq.numSteps(), 2);
    test.verify(seq.step(1).args, "saved1");
    test.verify(seq.step(1).ms, 1250);

    seq.openAt();
    test.verify(seq.numSteps(), 2);
    test.verify(seq.step(1).args, "saved2");
    test.verify(seq.step(1).ms, 1250);
    test.verify(seq.step(1).msOff, -1);

    seq.moveToMs(2000);
    seq.openAt();
    test.verify(seq.numSteps(), 3);
    test.verify(seq.step(1).args, "saved2");
    test.verify(seq.step(1).ms, 1250);
    test.verify(seq.step(1).argsOff, "saved3-off");
    test.verify(seq.step(1).msOff, 2000);
    test.verify(seq.step(2).args, "saved3");
    test.verify(seq.step(2).ms, 2000);
    test.verify(seq.step(2).msOff, -1);

    seq.moveToMs(3000);
    seq.closeAt();
    test.verify(seq.step(0).args, "saved0");
    test.verify(seq.step(0).ms, 1000);
    test.verify(seq.step(0).argsOff, "saved1-off");
    test.verify(seq.step(0).msOff, 1250);
    test.verify(seq.step(1).args, "saved2");
    test.verify(seq.step(1).ms, 1250);
    test.verify(seq.step(1).argsOff, "saved3-off");
    test.verify(seq.step(1).msOff, 2000);
    test.verify(seq.step(2).args, "saved3");
    test.verify(seq.step(2).ms, 2000);
    test.verify(seq.step(2).msOff, 3000);
    test.verify(seq.step(2).argsOff, "saved4-off");


    //reply recording and make sure states are enabled/disabled correctly
    seq.moveToMs(0);
    test.verify(sComp.argSeqLength(), 0);

    seq.moveToMs(1000);
    test.verify(sComp.argSeqLength(), 1);
    test.verify(sComp.argSeq(0), "saved0");

    seq.moveToMs(1250);
    test.verify(sComp.argSeqLength(), 3);
    test.verify(sComp.argSeq(1), "saved1-off");
    test.verify(sComp.argSeq(2), "saved2");

    seq.moveToMs(2000);
    test.verify(sComp.argSeqLength(), 5);
    test.verify(sComp.argSeq(3), "saved3-off");
    test.verify(sComp.argSeq(4), "saved3");

    seq.moveToMs(4000);
    test.verify(sComp.argSeqLength(), 6);
    test.verify(sComp.argSeq(5), "saved4-off");
}

function test_sSequenceOpenCloseAndLoad() {
    var sComp = stubScomp(),
        seq = sSequence(sComp, 0),
        step,
        loadData = [
            {
                ms: 0,
                args: "loaded0",
                msOff: 500,
                argsOff: "loaded0-off"
            },
            {
                ms: 1000,
                args: "loaded1",
                msOff: 1500,
                argsOff: "loaded1-off"
            }
        ];

    seq.load(loadData);
    seq.moveToMs(0);
    test.verify(sComp.argSeqLength(), 1);
    test.verify(sComp.argSeq(0), "loaded0");

    seq.moveToMs(100);
    seq.openAt();
    test.verify(sComp.argSeqLength(), 1);
    test.verify(sComp.argSeq(0), "loaded0");
    test.verify(seq.step(0).args, "loaded0");
    test.verify(seq.step(0).ms, 0);
    test.verify(seq.step(0).msOff, 500);
    test.verify(seq.step(0).argsOff, "loaded0-off");
    test.verify(seq.step(1).args, "saved0");
    test.verify(seq.step(1).ms, 100);


    seq.moveToMs(1000);
    test.verify(seq.step(0).args, "loaded0");
    test.verify(seq.step(0).ms, 0);
    test.verify(seq.step(0).msOff, 500);
    test.verify(seq.step(0).argsOff, "loaded0-off");
    test.verify(seq.step(1).args, "saved0");
    test.verify(seq.step(1).ms, 100);
    test.verify(seq.step(1).msOff, -1);
    test.verify(seq.step(2).args, "loaded1");
    test.verify(seq.step(2).ms, 1000);
    test.verify(seq.step(2).msOff, 1500);
    test.verify(seq.step(2).argsOff, "loaded1-off");

    seq.closeAt();
    test.verify(seq.step(1).msOff, 1000);


    //note wont apply new open/close step made on the fly... (FIXME?)
    seq.moveToMs(1500);
    test.verify(sComp.argSeqLength(), 4);
    test.verify(sComp.argSeq(0), "loaded0");
    test.verify(sComp.argSeq(1), "loaded0-off");
    test.verify(sComp.argSeq(2), "loaded1");
    test.verify(sComp.argSeq(3), "loaded1-off");
}

test.addTest(test_sSequence, "sSequence load-save");
test.addTest(test_sSequenceOpenClose, "sSequence open-close");
test.addTest(test_sSequenceOpenCloseAndLoad, "sSequence open-close and load");
