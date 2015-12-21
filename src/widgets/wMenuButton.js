"use strict";
/*global gButton*/
/*global wMenu*/

function wMenuButton(name, group) {
    var that,
        myIndex = group.length;
    
    that = gButton(name, function () {
        that.closeAll(myIndex);
        that.menu.move(0, that.getH());
        that.menu.show(true);
    }).hoverEffect(true);
    
    that.menu = wMenu(that).removeOnLeave(false).show(false);
    
    group.push(that);
    
    that.closeAll = function (myIndex) {
        var i;
        for (i = 0; i < group.length; i += 1) {
            if (i !== myIndex) {
                group[i].menu.show(false);
            }
        }
    };

    that.add = function (name, callback) {
        var cb = function () {
            callback();
            //FIXME: does not work:
            //that.menu.show(false);
        };
        that.menu.add(name, cb);
    };
    
    that.addOverlayed = function (name, element) {
        that.menu.addOverlayed(name, element);
    };
    
    return that;
}