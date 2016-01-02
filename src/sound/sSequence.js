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
    
    that.saveAt = function (ms) {
        var i,
            at = ms || atMs,
            data = sSequanceData(sComp.getArgs(), at);
        
        for (i = 0; i < seqData.length; i += 1) {
            if (at === seqData[i].ms) {
                seqData[i] = data;
                return;
            } else if (at < seqData[i].ms) {
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