"use strict";
/*global gButton*/
/*global gMenu*/

function gMenuButton(name, group) {
    var that;
            
    that = gButton(name, function () {
        that.closeAll();
        that.menu.move(0, that.getH());
        that.menu.show(true);
        /*if (that.menu.getW() < that.getW()) {
            that.menu.width(that.getW());
        }*/
    }).hoverEffect(true);
    
    that.menu = gMenu(that).removeOnLeave(false).show(false);
    
    that.add = function (name, callback) {
        that.menu.add(name, callback);
    };
            
    group.push(that);
    
    that.closeAll = function () {
        var i;
        for (i = 0; i < group.length; i += 1) {
            group[i].menu.show(false);
        }
    };
    
    return that;
}