"use strict";
/*global gui*/
/*global sConst*/
/*global gInput*/
/*global sCBase*/

function sCConst(container, args, uid) {
    var out = sConst(),
        that = sCBase(container, "sCConst", {value: out}, args, uid);

    that.addOut("value");
    that.addContent(gInput(out.getArgs().value, function (value) {
        out.setArgs({value: parseFloat(value)});
    }, "value"));
                    
    return that;
}