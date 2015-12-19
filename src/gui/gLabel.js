"use strict";
/*global gBase*/

function gLabel(label) {
    var that = gBase();
    that.innerText = label;
    that.className = "gLabel";
    
    that.set = function (str) {
        that.innerText = str;
        return that;
    };
    
    return that;
}