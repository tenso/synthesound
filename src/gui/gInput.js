"use strict";
/*global gBase*/
/*global gWidget*/
/*global gLabel*/

function gInput(value, callback, label) {
    var that = gBase(),
        input = gBase("input").w(60).setClass("gInput").textAlign("right");
    
    input.value = value;
    input.onchange = function () {
        callback(input.value);
    };
    
    that.appendChild(gLabel(label));
    that.appendChild(input);
    
    return that;
}