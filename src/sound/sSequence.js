"use strict";
/*global test*/
/*global util*/
/*global log*/

function sSequanceData(sArgs, msTime) {
    return {ms: msTime, args: sArgs};
}

function sSequence(sComp, sId, argUpdateCb) {
    var that = {},
        seqData = [],
        atMs = -1;

    //FIXME: optimize!
    that.moveToMs = function (ms) {
        var i;

        if (ms < atMs) {
            //jump back in time, activate prev. state
            //NOTE: activate all prev steps so complete states are not needed
            atMs = -1;
        }

        for (i = 0; i < seqData.length; i += 1) {
            if (seqData[i].ms > atMs && seqData[i].ms <= ms) {
                sComp.setArgs(seqData[i].args);
                if (argUpdateCb) {
                    argUpdateCb(sId, seqData[i].args);
                }
            }
        }
        atMs = ms;
    };

    //FIXME: dont want complete states, only changes
    that.saveAt = function (ms) {
        var i,
            at = typeof ms === "number" ? ms : atMs,
            data = sSequanceData(sComp.getArgs(), at);

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
    };
    
    //FIXME: "duration" param is hardcoded to "gate".
    that.removeIndex = function (index) {
        var removeAt = index,
            removeNum = 1;
        
        if (index >= 0 && index < seqData.length) {
            if (seqData[index].args.hasOwnProperty("gate")) {
                if (seqData[index].args.gate) {
                    if (index < seqData.length - 1) {
                        if (seqData[index + 1].args.hasOwnProperty("gate")) {
                            if (!seqData[index + 1].args.gate) {
                                log.d("also remove next event");
                                removeNum = 2;
                            }
                        }
                    }
                } else {
                    if (index > 0) {
                        if (seqData[index - 1].args.hasOwnProperty("gate")) {
                            if (seqData[index - 1].args.gate) {
                                log.d("also remove prev event");
                                removeAt = index - 1;
                                removeNum = 2;
                            }
                        }
                    }
                }
            }
            seqData.splice(removeAt, removeNum);
        } else {
            log.error("sSequence.removeIndex: no such index:" + index);
        }
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

    function verify_data(seqArg, data) {
        test.verify(seqArg, data);
    }

    seq.load(loadData);
    seq.moveToMs(0);
    seq.saveAt(750);

    verify_data(sComp.argSeq(0), "loaded0");
    test.verify(sComp.argSeqLength(), 1);

    seq.moveToMs(500);
    verify_data(sComp.argSeq(0), "loaded0");
    test.verify(sComp.argSeqLength(), 1);

    seq.moveToMs(1250);
    verify_data(sComp.argSeq(0), "loaded0");
    verify_data(sComp.argSeq(1), "saved0");
    verify_data(sComp.argSeq(2), "loaded1");
    test.verify(sComp.argSeqLength(), 3);

    seq.saveAt(1500);
    verify_data(sComp.argSeq(0), "loaded0");
    verify_data(sComp.argSeq(1), "saved0");
    verify_data(sComp.argSeq(2), "loaded1");
    test.verify(sComp.argSeqLength(), 3);

    seq.moveToMs(1500);
    verify_data(sComp.argSeq(0), "loaded0");
    verify_data(sComp.argSeq(1), "saved0");
    verify_data(sComp.argSeq(2), "loaded1");
    verify_data(sComp.argSeq(3), "saved1");
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
}
test.addTest(test_sSequence, "sSequence");
