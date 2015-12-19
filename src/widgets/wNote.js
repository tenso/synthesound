"use strict";

/*global gWidget*/
/*global gLabel*/

function wNote(container, note) {
    var that = gWidget(container).w(400).h(200);
    
    that.addAt(gLabel(note).w(350).h(150).overflow("auto"), 25, 25);
    that.addRemove();
    that.move(100, 100);
    
    return that;
}