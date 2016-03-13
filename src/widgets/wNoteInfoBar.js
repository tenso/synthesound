/*jslint node: true */

/*global util*/
/*global gBase*/
/*global log*/
/*global note*/

"use strict";

function wNoteInfoBar(minNote, maxNote) {
    var that = gBase().bg("#888"),
        canvas = gBase("canvas").addTo(that).w("100%").h("100%"),
        ctx = canvas.getContext("2d"),
        numNotes = maxNote - minNote,
        scroll = {
            x: 0,
            y: 0
        },
        zoom = {
            x: 1,
            y: 1
        };

    that.draw = function () {
        var i = 0,
            pixelsPerNote = zoom.y * canvas.height / (maxNote - minNote),
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

        for (i = 0; i <= numNotes; i += 1) {
            cNote = maxNote - i;
            y = i * pixelsPerNote - (zoom.y * scroll.y * canvas.height) - 1;
            if (y > 0) {
                ctx.fillStyle = note.isFlat(cNote) ? "#fff" : "#000";
                ctx.fillRect(0, y - pixelsPerNote, canvas.width, pixelsPerNote);
                ctx.fillStyle = "#888";
                ctx.fillText(note.name(cNote), 2, y - textMargin);
            }
        }

        return that;
    };

    /*
    that.resizeCanvas = function () {
        canvas.width = that.offsetWidth;
        canvas.height = that.offsetHeight;
        return that.draw();
    };*/

    that.minNote = function () {
        return minNote;
    };

    that.maxNote = function () {
        return maxNote;
    };

    that.setScroll = function (args) {
        util.setArgs(scroll, args);
        that.draw();
        return that;
    };

    that.setZoom = function (args) {
        util.setArgs(zoom, args);
        that.draw();
        return that;
    };

    that.getCanvas = function () {
        return canvas;
    };

    that.typeIs = "wNoteInfoBar";
    that.draw();
    return that;
}
