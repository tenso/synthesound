"use strict";
/*global sGen*/
/*global sCBase*/
/*global gButton*/

function sCGen(container, args, uid) {
    var out = sGen({freq: 110, amp: 0.25, type: "sine"}),
        that = sCBase(container, "sCGen", {gen: out}, args, uid),
        typeButtons = [];
            
    function addShape(shape) {
        var button = gButton(shape, function () {out.setArgs({type: shape}); }, true, typeButtons);
        button.setValue(out.getArgs().type === shape);
        that.addContent(button);
    }
    
    that.addIn("gen", "freq").addOut("gen");
    that.nextRow();
    addShape("sine");
    addShape("square");
    addShape("saw");
    that.nextRow();
    addShape("triangle");
    addShape("noise");

    
    return that;
}