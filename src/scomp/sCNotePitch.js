"use strict";
/*global gui*/
/*global sNotePitch*/
/*global gInput*/
/*global gLabel*/
/*global sCBase*/

function sCNotePitch(container, args, uid) {
    var that,
        out = sNotePitch(),
        labelIn,
        labelOut;
            
    that = sCBase(container, "sCNotePitch", {hz: out}, args, uid);
    
    labelIn = gLabel("--").w(60).fontSize(10);
    that.addContent(labelIn);
    that.addIn("hz");
    
    labelOut = gLabel("--").w(60).fontSize(10);
    that.addContent(labelOut);
    that.addOut("hz");
    
    
    function addControl(type) {
        var args;
        that.addContent(gInput(out.getArgs()[type], function (value) {
            args = {};
            args[type] = parseInt(value, 10);
            out.setArgs(args);
        }, type));
    }

    that.nextRow();
    addControl("octaves");
    addControl("notes");
    addControl("cents");
        
    out.setNoteUpdatedCallback(function (inNote, outNote) {
        labelIn.set(inNote);
        labelOut.set(outNote);
    });
    
    return that;
}