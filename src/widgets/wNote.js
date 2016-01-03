"use strict";

/*global gWidget*/
/*global gLabel*/

function wNote(note) {
    var that = gWidget().addRemove().w(400).h(200),
        label = gLabel(note).w(350).h(150);

    label.overflow("auto").whiteSpace("pre-line").textAlign("left").fontFamily("Lucida Console").fontSize(16);
    that.addAt(label, 25, 25);
    that.typeIs = "wNote";
    return that;
}
