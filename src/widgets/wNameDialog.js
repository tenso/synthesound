/*jslint node: true */

/*global gWidget*/
/*global gInput*/
/*global gButton*/
/*global lang*/
/*global log*/
/*global gLabel*/
/*global gBase*/

"use strict";

function wNameDialog(cb, parent) {
    var that = gWidget().setTitle(lang.tr("name")).w(360).h(100),
        name = gInput("", undefined, lang.tr("name")).abs().x(10).y(30).w(340),
        status = gLabel("").abs().left(10).bottom(10),
        ok,
        hider;

    ok = gButton(lang.tr("ok"), function () {
        if (typeof cb === "function") {
            if (name.getValue() !== "") {
                cb(name.getValue());
            }
        }
        that.remove();
    }).abs().right(10).bottom(10);

    that.add(name).add(ok);
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

    that.y("calc(50% - 50px)").x("calc(50% - 180px)");
    return that.canMove(false);
}
