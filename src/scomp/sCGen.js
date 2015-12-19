"use strict";
/*global sGen*/
/*global sCBase*/
/*global gButton*/

function sCGen(container, args) {
    var that,
        typeButtons = [],
        out = sGen({freq: 110, amp: 0.25, type: "sine"}),
        button;
    
    that = sCBase(container, "sCGen", {gen: out}, args).addIn("gen", "freq").addOut("gen");
        
    function addShape(shape) {
        button = gButton(shape, function () {out.setArgs({type: shape}); }, true, typeButtons);
        button.setValue(out.getArgs().type === shape);
        that.addContent(button);
    }
    that.nextRow();
    addShape("sine");
    addShape("square");
    addShape("saw");
    that.nextRow();
    addShape("triangle");
    addShape("noise");

    
    return that;
}