/*jslint node: true */

/*global util*/
/*global gBase*/
/*global log*/
/*global note*/
/*global gViewportCanvas*/
"use strict";

function wNoteInfoBar(minNote, maxNote) {
    var that = gBase().bg("#888"),
        canvas = gViewportCanvas().addTo(that).w("100%").h("100%"),
        numNotes = maxNote - minNote;

    that.draw = function () {
        var i = 0,
            noteH = 1.0 / (maxNote - minNote),
            y,
            cNote,
            fontSize = 3 * canvas.getZoom().y,
            textMargin = noteH / 4;

        if (fontSize > 20) {
            fontSize = 20;
        }

        canvas.clear();
        canvas.fontSize(fontSize);

        for (i = 0; i <= numNotes; i += 1) {
            cNote = maxNote - i;
            y = i * noteH;

            canvas.fillStyle(note.isFlat(cNote) ? "#fff" : "#000");
            canvas.fillRect(0, y - noteH, 1.0, noteH);

            canvas.fillStyle("#888");
            canvas.fillText(note.name(cNote), 2 / canvas.width, y - textMargin);
        }
        return that;
    };

    that.resize = function (w, h) {
        canvas.resize(w, h);
        return that.draw();
    };

    that.minNote = function () {
        return minNote;
    };

    that.maxNote = function () {
        return maxNote;
    };

    that.scroll = function (args) {
        canvas.scroll(args);
        that.draw();
        return that;
    };

    that.zoom = function (args) {
        canvas.zoom(args);
        that.draw();
        return that;
    };

    that.getCanvas = function () {
        return canvas;
    };

    canvas.font("sans-serif");
    that.typeIs = "wNoteInfoBar";
    that.draw();
    return that;
}
