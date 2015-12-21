"use strict";
/*global gBase*/

function gLabel(label) {
    var that = gBase();
    that.textContent = label;
    that.className = "gLabel";
    
    that.set = function (str) {
        that.textContent = str;
        return that;
    };
    
    return that;
}