"use strict";

/*global gWidget*/
/*global gLabel*/

function wNote(note) {
    var that = gWidget().addRemove(),
        textContent = gLabel(note, "html").w(650).h(250);

    that.setTitle("Note");
    textContent.overflow("auto").whiteSpace("pre-line").textAlign("left").fontFamily("Lucida Console").fontSize(16);
    that.addTabled(textContent);
    that.typeIs = "wNote";
    return that;
}
