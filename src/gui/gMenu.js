"use strict";
/*global gWidget*/
/*global gLabel*/

function gMenu(container) {
    var that = gWidget(container);
    
    that.add = function (string, callback) {
        var entry,
            originalBg;
                
        if (that.contentCount() > 0) {
            that.nextRow();
        }
        entry = gLabel(string).alignLeft();
        entry.onmousedown = callback;
        
        entry.onmouseover = function () {
            originalBg = entry.style.background;
            entry.style.background = "#aaa";
        };
        
        entry.onmouseout = function () {
            entry.style.background = originalBg;
        };
        
        that.addContent(entry);
        return that;
    };
    
    that.onmouseleave = function () {
        that.remove();
    };
    
    return that;
}