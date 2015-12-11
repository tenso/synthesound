"use strict";
/*global gBase*/

function gLabel(label) {
    var that = gBase();
    that.innerText = label;
    that.className = "component-label";
    
    that.set = function (str) {
        that.innerText = str;
        return that;
    };
    
    return that;
}