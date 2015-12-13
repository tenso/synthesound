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
        
    button = gButton("sine", function () {out.setArgs({type: "sine"}); }, true, typeButtons);
    button.setValue(out.getArgs().type === "sine");
    that.addContent(button);
    
    button = gButton("square", function () {out.setArgs({type: "square"}); }, true, typeButtons);
    button.setValue(out.getArgs().type === "square");
    that.addContent(button);
    
    return that;
}