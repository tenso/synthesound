"use strict";
/*global sOp*/
/*global sCBase*/
/*global gButton*/
/*global gButtonGroup*/

function sCOp(container, uid) {
    var out = sOp(),
        that = sCBase(container, "sCOp", {op: out}, uid),
        buttonGroup = gButtonGroup();
        
    function addOp(op) {
        var button = gButton(op, function () {that.setAndSaveArgs("op", {op: op}); }, true, buttonGroup).w(32);
        if (out.getArgs().op === op) {
            button.set();
        }
        that.addContent(button);
    }
    
    that.addIn("op").addOut("op");
    
    that.nextRow();
    addOp("*");
    addOp("+");
    that.nextRow();
    addOp("-");
    addOp("%");

    that.setGuiControls({
        op: {
            op: buttonGroup
        }
    });
    
    return that;
}