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

    that.typeIs = "gLabel";
    that.setValue(label);
    that.whiteSpace("nowrap").textAlign("center").fontFamily("sans-serif").fontSize(16).color("#444");
    that.cursor("default");
    return that;
}
