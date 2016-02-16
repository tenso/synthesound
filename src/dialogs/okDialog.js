/*global gWidget*/
/*global gInput*/
/*global gButton*/
/*global lang*/
/*global log*/
/*global gLabel*/
/*global gBase*/
"use strict";

//FIXME: merge with nameDialog!
function okDialog(cb, title, parent) {
    var that = gWidget().setTitle(title).w(360).h(60),
        ok,
        hider;

    ok = gButton(lang.tr("ok"), function () {
        if (typeof cb === "function") {
            cb();
        }
        that.remove();
    }).abs().right(10).bottom(10);

    that.add(ok);

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

    that.y("calc(50% - 30px)").x("calc(50% - 180px)");
    return that.canMove(false);
}
