"use strict";
/*global gBase*/

function gLabel(label) {
    var that = gBase();
    that.innerText = label;
    that.className = "component-label";
    
    that.alignLeft = function () {
        that.style.textAlign = "left";
        return that;
    };
    that.set = function (str) {
        that.innerText = str;
        return that;
    };
    
    return that;
}