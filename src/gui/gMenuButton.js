"use strict";
/*global gButton*/
/*global gMenu*/

function gMenuButton(name, group) {
    var that;
            
    that = gButton(name, function () {
        that.closeAll();
        that.menu.move(0, that.getH());
        that.menu.show(true);
    }).hoverEffect(true);
    
    that.menu = gMenu(that).removeOnLeave(false).show(false);
    
    group.push(that);
    
    that.closeAll = function () {
        var i;
        for (i = 0; i < group.length; i += 1) {
            group[i].menu.show(false);
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
    
    return that;
}