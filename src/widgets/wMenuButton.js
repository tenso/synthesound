/*jslint node: true */

/*global gButton*/
/*global wMenu*/

"use strict";

function wMenuButton(name, group) {
    var that,
        myIndex = group.length;

    that = gButton(name, function () {
        that.closeAll(myIndex);
        that.menu.moveTo(0, that.getH());
        that.menu.show(true);
    }).hoverEffect({color: "#888"}).rel();

    that.closeAll = function (myIndex) {
        var i;
        for (i = 0; i < group.length; i += 1) {
            if (i !== myIndex) {
                group[i].menu.show(false);
            }
        }
    };

    that.addRow = function (name, callback) {
        var cb = function () {
            callback();
            //FIXME: does not work:
            //that.menu.show(false);
        };
        that.menu.addRow(name, cb);
    };

    that.addOverlayed = function (name, element) {
        that.menu.addOverlayed(name, element);
    };

    that.typeIs = "wMenuButton";
    that.menu = wMenu().removeOnLeave(false).show(false);
    that.add(that.menu);
    group.push(that);

    return that;
}
