"use strict";
/*global gWidget*/
/*global gLabel*/
/*global gButton*/
/*global lang*/
/*global app*/

function workbar(container, workspace) {
    var that = gWidget(container),
        time;

    that.updateTime = function (str) {
        time.setValue(str);
        return that;
    };

    that.z(10000).border("0").h(app.screen.maxBottom).radius(0).padding(0).canMove(false).bottom(0);
    that.w("100%");

    that.addContent(gButton(lang.tr("stop"), function () {
        workspace.stop();
    }).bg("#f00"));

    that.addContent(gButton(">", function () {
        workspace.play();
    }));

    time = gLabel("--:--:--").fontFamily("monospace");
    that.addContent(time);

    workspace.timeUpdated = function (time) {
        that.updateTime(time);
    };
    return that;
}
