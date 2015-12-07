"use strict";
/*global sBase*/

function sStep(args) {
    var that = sBase(),
        wantStep = false,
        stepDone = true,
        needRefill = true;
    
    that.title = "step";
    
    that.makeAudio = function () {
        var chan = 0;

        if (needRefill) {
            if (stepDone) {
                needRefill = false;
            }
            for (chan = 0; chan < that.numChannels(); chan += 1) {
                that.data[chan].fill(wantStep ? 1.0 : 0.0);
            }
            if (!stepDone) {
                for (chan = 0; chan < that.numChannels(); chan += 1) {
                    that.data[chan][0] = 0.0;
                }
                stepDone = true;
            }
        }
    };
    
    that.getArgs = function () {
        return {"active": wantStep};
    };
    
    that.setArgs = function (args) {
        
        if (args) {
            wantStep = typeof args.active === "boolean" ? args.active : wantStep;
            stepDone = !wantStep;
            needRefill = true;
        }
    };
    that.setArgs(args);
    
    return that;
}