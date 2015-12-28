"use strict";
/*global gWidget*/
/*global gLabel*/

function workbar(container) {
    var that = gWidget(container),
        time;
        
    that.updateTime = function (str) {
        time.setValue(str);
        return that;
    };
    
    that.z(10000).border("0").radius(0).padding(2).canMove(false).style.borderTop = "1px solid #000";
    that.w("100%").h(80);
    
    time = gLabel("--:--:--").fontFamily("monospace");
    that.addContent(time);
    
    return that;
}