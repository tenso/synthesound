"use strict";

/*global gWidget*/
/*global gLabel*/

function wNote(container, note) {
    var that = gWidget(container).w(400).h(200),
        label = gLabel(note).w(350).h(150);

    label.overflow("auto").whiteSpace("pre-line").textAlign("left").fontFamily("Lucida Console");
    that.addAt(label, 25, 25);
    that.addRemove();
    that.move(100, 100);

    that.typeIs = "wNote";
    return that;
}
