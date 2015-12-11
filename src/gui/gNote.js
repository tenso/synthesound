"use strict";

/*global gWidget*/
/*global gLabel*/

function gNote(container, note) {
    var that = gWidget(container).width(400).height(200);
    
    that.addAt(gLabel(note).width(350).height(150).overflow("auto"), 25, 25);
    that.addRemove();
    that.move(100, 100);
    
    return that;
}