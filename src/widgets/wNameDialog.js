/*jslint node: true */

/*global wOkDialog*/
/*global gInput*/
/*global gButton*/
/*global lang*/
/*global log*/
/*global gLabel*/
/*global gBase*/

"use strict";

function wNameDialog(cb, parent) {
    var that = wOkDialog(lang.tr("name"), parent),
        name = gInput("", undefined, lang.tr("name")).abs().x(10).y(30).w(340);

    that.on("ok", function () {
        if (typeof cb === "function") {
            if (name.getValue() !== "") {
                cb(name.getValue());
                that.remove();
            }
        }
    });

    that.add(name);
    return that;
}
