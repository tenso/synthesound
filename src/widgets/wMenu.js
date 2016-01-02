"use strict";
/*global gWidget*/
/*global gLabel*/

function wMenu(container) {
    var that = gWidget(container);
    
    function buildButton(string, callback) {
        var entry,
            originalBg;
                
        if (that.contentCount() > 0) {
            that.nextRow();
        }
        entry = gLabel(string).textAlign("left");
        if (callback) {
            entry.onmousedown = callback;
        }
        
        entry.onmouseover = function () {
            originalBg = entry.style.background;
            entry.style.background = "#aaa";
        };
        
        entry.onmouseout = function () {
            entry.style.background = originalBg;
        };
        return entry;
    }
    
    function removeListener() {
        that.remove();
    }
    
    that.add = function (string, callback) {
        that.addContent(buildButton(string, callback));
        return that;
    };
    
    that.addOverlayed = function (string, element) {
        var entry = buildButton(string);
        entry.appendChild(element);
        that.addContent(entry);
        return that;
    };
    
    that.removeOnLeave = function (value) {
        if (value) {
            that.addEventListener("mouseleave", removeListener);
        } else {
            that.removeEventListener("mouseleave", removeListener);
        }
        return that;
    };
    that.typeIs = "wMenu";
    that.canMove(false).removeOnLeave(true);
    return that;
}