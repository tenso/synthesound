"use strict";
/*global gBase*/

function gLabel(label, type) {
    var that = gBase();

    that.setValue = function (str) {
        if (type === "html") {
            that.innerHTML = str;
        } else {
            that.textContent = str;
        }
        return that;
    };

    that.className = "gLabel";
    that.typeIs = "gLabel";
    that.setValue(label);
    return that;
}
