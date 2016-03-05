/*jslint node: true */

/*global gWidget*/
/*global gLabel*/
/*global lang*/

"use strict";

function wNote(note, label) {
    var that = gWidget().addRemove(),
        textContent = gLabel(note, "html").w(550).h(250).stopPropagation(true);

    that.w = function (value) {
        textContent.w(value - 2);
        return that;
    };

    that.h = function (value) {
        textContent.h(value - 2);
        return that;
    };

    that.addResize(400, 200);


    textContent.on("leave", function () {
        textContent.userSelect("none");
    });

    textContent.on("pressed", function () {
        textContent.userSelect("text");
    });

    that.on("resizeStart", function () {
        textContent.userSelect("none");
    });

    that.on("resizeEnd", function () {
        textContent.userSelect("text");
    });


    that.setTitle(label || lang.tr("note"));
    textContent.overflow("auto").whiteSpace("pre").textAlign("left").fontFamily("sans-serif").fontSize(16);
    that.addTabled(textContent);
    that.typeIs = "wNote";
    return that;
}
