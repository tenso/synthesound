"use strict";
/*global sOp*/
/*global sCBase*/
/*global gButton*/

function sCOp(container, args, uid) {
    var out = sOp(),
        that = sCBase(container, "sCOp", {op: out}, args, uid),
        typeButtons = [];
        
    function addOp(op) {
        var button = gButton(op, function () {out.setArgs({op: op}); }, true, typeButtons).w(32);
        button.setValue(out.getArgs().op === op);
        that.addContent(button);
    }
    
    that.addIn("op").addOut("op");
    
    that.nextRow();
    addOp("*");
    addOp("+");
    that.nextRow();
    addOp("-");
    addOp("%");

    
    return that;
}