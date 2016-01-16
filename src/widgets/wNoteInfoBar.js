"use strict";
/*global util*/
/*global gBase*/
/*global window*/
/*global log*/
/*global note*/
function wNoteInfoBar(minNote, maxNote) {
    var that = gBase().bg("#888"),
        canvas = gBase("canvas").addTo(that).w("100%").h("100%"),
        ctx = canvas.getContext("2d"),
        numNotes = maxNote - minNote;

    that.draw = function () {
        var i = 0,
            pixelsPerNote = canvas.height / (maxNote - minNote),
            y,
            cNote,
            fontSize = parseInt(pixelsPerNote, 10),
            textMargin = 2;

        if (fontSize > 20) {
            fontSize = 20;
            textMargin = (pixelsPerNote - fontSize) / 2;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font =  fontSize + "px sans-serif";

        for (i = 0; i < numNotes; i += 1) {
            cNote = minNote + i;
            y = canvas.height - (i + 1) * pixelsPerNote;
            ctx.fillStyle = note.isFlat(cNote) ? "#fff" : "#000";
            ctx.fillRect(0, y, canvas.width, pixelsPerNote);
            ctx.fillStyle = "#888";
            ctx.fillText(note.name(cNote), 2, y + pixelsPerNote - textMargin);
        }

        return that;
    };

    that.resizeCanvas = function () {
        canvas.width = that.offsetWidth;
        canvas.height = that.offsetHeight;
        return that.draw();
    };

    that.minNote = function () {
        return minNote;
    };

    that.maxNote = function () {
        return maxNote;
    };

    window.addEventListener("resize", that.resizeCanvas);
    that.typeIs = "wNoteInfoBar";
    that.draw();
    return that;
}
