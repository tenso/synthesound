"use strict";
/*global sOp*/
/*global sCBase*/
/*global gButton*/

function sCOp(container, args, uid) {
    var that,
        typeButtons = [],
        out = sOp();
    
    
    that = sCBase(container, "sCOp", {op: out}, args, uid).addIn("op").addOut("op");
        
    function addOp(op) {
        var button = gButton(op, function () {out.setArgs({op: op}); }, true, typeButtons).w(32);
        button.setValue(out.getArgs().op === op);
        that.addContent(button);
    }
    that.nextRow();
    addOp("*");
    addOp("/");
    addOp("+");
    that.nextRow();
    addOp("-");
    addOp("%");

    
    return that;
}