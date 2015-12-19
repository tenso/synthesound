"use strict";
/*global gWidget*/
/*global gLabel*/

function wMenu(container) {
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
    
    function removeListener() {
        that.remove();
    }
    
    that.removeOnLeave = function (value) {
        if (value) {
            that.addEventListener("mouseleave", removeListener);
        } else {
            that.removeEventListener("mouseleave", removeListener);
        }
        return that;
    };
    
    that.canMove(false).removeOnLeave(true);
    return that;
}