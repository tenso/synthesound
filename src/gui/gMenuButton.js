"use strict";
/*global gButton*/
/*global gMenu*/

function gMenuButton(name, group) {
    var that;
            
    that = gButton(name, function () {
        that.closeAll();
        that.fileMenu.move(0, that.getH());
        that.fileMenu.show(true);
    }).hoverEffect(true);
    
    that.fileMenu = gMenu(that).removeOnLeave(false).show(false);
    
    that.add = function (name, callback) {
        that.fileMenu.add(name, callback);
    };
            
    group.push(that);
    
    that.closeAll = function () {
        var i;
        for (i = 0; i < group.length; i += 1) {
            group[i].fileMenu.show(false);
        }
    };
    
    return that;
}