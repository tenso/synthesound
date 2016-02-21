/*jslint node: true */

/*global gWidget*/
/*global gLabel*/
/*global gBase*/

"use strict";

function wModalDialog(title, parent) {
    var that = gWidget().setTitle(title),
        status = gLabel("").abs().left(10).bottom(10),
        hider;

    that.setStatus = function (text) {
        status.setValue(text);
        return that;
    };

    that.add(status);

    if (parent) {
        if (parent.theDialog) {
            parent.theDialog.remove();
        }
        parent.theDialog = that;
        hider = gBase().bg("rgba(0, 0, 0, 0.5)").w("100%").h("100%").x(0).y(0).abs();
        parent.add(hider);
        parent.add(that);
    }

    that.addRemove();
    that.on("removed", function () {
        parent.theDialog = undefined;
        if (parent) {
            parent.undoAdd(hider);
        }
    });

    that.on("wChanged", function (w) {
        that.x("calc(50% - " + parseInt(w / 2, 10) + "px)");
    });

    that.on("hChanged", function (h) {
        that.y("calc(50% - " + parseInt(h / 2, 10) + "px)");
    });

    that.w(360).h(100);

    return that.canMove(false);
}
