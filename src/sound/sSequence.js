"use strict";
/*global test*/
/*global util*/
/*global log*/

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
    var data = {
        ms: msTime,
        args: sArgs
    };
    
    if (sArgsOff) {
        sCloseSequanceData(data, sArgsOff, msTimeOff);
    }
    
    return data;
}

function sSequence(sComp, sId, argUpdateCb) {
    var that = {},
        seqData = [],
        atMs = -1;

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
                if (seqData[i].hasOwnProperty("argsOff")) {
                    if (seqData[i].msOff > atMs && seqData[i].msOff <= ms) {
                        sComp.setArgs(seqData[i].argsOff);
                        if (argUpdateCb) {
                            argUpdateCb(sId, seqData[i].argsOff);
                        }
                    }
                } else {
                    log.error("sSequence.moveToMs: state has msOff but no argsOff");
                }
            }
        }
        atMs = ms;
        return that;
    };

    //FIXME: dont want complete states, only changes
    that.saveAt = function (ms, sArgs) {
        var i,
            at = typeof ms === "number" ? ms : atMs,
            data = sArgs || sSequanceData(sComp.getArgs(), at);

        for (i = 0; i < seqData.length; i += 1) {
            if (at === seqData[i].ms) {
                seqData[i] = data;
                return;
            }
            if (at < seqData[i].ms) {
                seqData.splice(i, 0, data);
                return;
            }
        }
        seqData.splice(seqData.length, 0, data);
        return that;
    };

    that.openAt = function (ms) {
        var i,
            at = typeof ms === "number" ? ms : atMs,
            data;
        
        that.closePrevOpen();
        data = sSequanceData(sComp.getArgs(), at);
        sOpenSequanceData(data);
        return that.saveAt(at, data);
    };
    
    that.closePrevOpen = function (ms) {
        var at = typeof ms === "number" ? ms : atMs;
        
        if (seqData.length > 0) {
            if (seqData[seqData.length - 1].hasOwnProperty("msOff") && seqData[seqData.length - 1].msOff === -1) {
                sCloseSequanceData(seqData[seqData.length - 1], sComp.getArgs(), at);
            }
        }
        return that;
    };
    
    that.setArgs = function (args) {
        return sComp.setArgs(args);
    };

    that.load = function (data) {
        if (!util.isArray(data)) {
            log.warn("sSequence.load: non array data wont load");
            seqData = [];
        } else {
            seqData = data;
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
    
    seq.closePrevOpen();
    test.verify(seq.numSteps(), 1);
    test.verify(seq.step(0).args, "saved0");
    test.verify(seq.step(0).ms, 1000);
    test.verify(seq.step(0).argsOff, "saved1");
    test.verify(seq.step(0).msOff, 1250);
    
    seq.moveToMs(1250);
    test.verify(sComp.argSeqLength(), 0);
    
    seq.openAt();
    test.verify(seq.numSteps(), 2);
    test.verify(seq.step(1).args, "saved2");
    test.verify(seq.step(1).ms, 1250);
    
    //open on same ms should overwrite, it will however first close the open (saved4 not 3)
    seq.openAt();
    test.verify(seq.numSteps(), 2);
    test.verify(seq.step(1).args, "saved4");
    test.verify(seq.step(1).ms, 1250);
    test.verify(seq.step(1).msOff, -1);

    //double open should close prev open:
    seq.moveToMs(2000);
    seq.openAt();
    test.verify(seq.numSteps(), 3);
    test.verify(seq.step(1).args, "saved4");
    test.verify(seq.step(1).ms, 1250);
    test.verify(seq.step(1).argsOff, "saved5");
    test.verify(seq.step(1).msOff, 2000);
    test.verify(seq.step(2).args, "saved6");
    test.verify(seq.step(2).ms, 2000);
    test.verify(seq.step(2).msOff, -1);
    
    seq.moveToMs(3000);
    seq.closePrevOpen();
    test.verify(seq.step(0).args, "saved0");
    test.verify(seq.step(0).ms, 1000);
    test.verify(seq.step(0).argsOff, "saved1");
    test.verify(seq.step(0).msOff, 1250);
    test.verify(seq.step(1).args, "saved4");
    test.verify(seq.step(1).ms, 1250);
    test.verify(seq.step(1).argsOff, "saved5");
    test.verify(seq.step(1).msOff, 2000);
    test.verify(seq.step(2).args, "saved6");
    test.verify(seq.step(2).ms, 2000);
    test.verify(seq.step(2).msOff, 3000);
    test.verify(seq.step(2).argsOff, "saved7");
    
    
    //reply recording and make sure states are enabled/disabled correctly
    seq.moveToMs(0);
    test.verify(sComp.argSeqLength(), 0);
    
    seq.moveToMs(1000);
    test.verify(sComp.argSeqLength(), 1);
    test.verify(sComp.argSeq(0), "saved0");
    
    seq.moveToMs(1250);
    test.verify(sComp.argSeqLength(), 3);
    test.verify(sComp.argSeq(1), "saved1");
    test.verify(sComp.argSeq(2), "saved4");
    
    seq.moveToMs(2000);
    test.verify(sComp.argSeqLength(), 5);
    test.verify(sComp.argSeq(3), "saved5");
    test.verify(sComp.argSeq(4), "saved6");
    
    seq.moveToMs(4000);
    test.verify(sComp.argSeqLength(), 6);
    test.verify(sComp.argSeq(5), "saved7");
}

test.addTest(test_sSequence, "sSequence load-save");
test.addTest(test_sSequenceOpenClose, "sSequence open-close");
