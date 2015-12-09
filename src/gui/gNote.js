"use strict";

/*global gWidget*/
/*global gLabel*/

function gNote(container, note) {
    var that = gWidget(container);
    
    that.addContent(gLabel(note));
    that.addRemove();
    that.move(100, 100);
    
    return that;
}