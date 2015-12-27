"use strict";
/*global gBase*/

function gLabel(label) {
    var that = gBase();
        
    that.setValue = function (str) {
        that.textContent = str;
        return that;
    };
    
    that.textContent = label;
    that.className = "gLabel";
    
    return that;
}