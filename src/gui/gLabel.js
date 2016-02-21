/*jslint node: true */

/*global gBase*/

"use strict";

function gLabel(label, type) {
    var that = gBase();

    that.setValue = function (str) {
        if (typeof str === "string") {
            if (type === "html") {
                that.innerHTML = str;
            } else {
                that.textContent = str;
            }
        }
        return that;
    };

    that.getValue = function () {
        return that.textContent;
    };

    that.typeIs = "gLabel";
    that.setValue(label);

    that.whiteSpace("nowrap").textAlign("center").fontFamily("sans-serif").fontSize(16).color("#444");
    that.cursor("default");
    return that;
}
