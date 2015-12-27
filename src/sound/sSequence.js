"use strict";
/*global test*/

function sSequanceData(sArgs, msTime) {
    return {ms: msTime, args: sArgs};
}

function sSequence(sComp) {
    var that = {},
        args = [],
        atMs = -1;
    
    that.moveToMs = function (ms) {
        var i;
        
        for (i = 0; i < args.length; i += 1) {
            if (args[i].ms > atMs && args[i].ms <= ms) {
                sComp.setArgs(args[i]);
            }
        }
        
        atMs = ms;
    };
    
    that.saveAt = function (ms) {
        var i,
            data = sSequanceData(sComp.getArgs(), ms);
        
        for (i = 0; i < args.length; i += 1) {
            if (ms <= args[i].ms) {
                args.splice(i, 0, data);
                return;
            }
        }
        args.splice(args.length, 0, data);
    };
    
    that.load = function (data) {
        args = data.slice(0);
    };
    
    that.data = function () {
        return args.slice(0);
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
        returnedArgs.push({data: "saved" + saveCount});
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
        seq = sSequence(sComp),
        saveData,
        loadData = [
            {
                ms: 0,
                args: {data: "loaded0"}
            },
            {
                ms: 1000,
                args: {data: "loaded1"}
            }
        ];

    function verify_data(seqArg, data) {
        test.verify(seqArg.args.data, data);
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
    test.verify(saveData[0].args.data, "loaded0");
    test.verify(saveData[1].ms, 750);
    test.verify(saveData[1].args.data, "saved0");
    test.verify(saveData[2].ms, 1000);
    test.verify(saveData[2].args.data, "loaded1");
    test.verify(saveData[3].ms, 1500);
    test.verify(saveData[3].args.data, "saved1");
}
test.addTest(test_sSequence, "sSequence");