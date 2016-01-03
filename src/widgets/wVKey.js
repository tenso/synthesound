"use strict";
/*global gui*/
/*global note*/
/*global document*/
/*global util*/
/*global gBase*/

function wVKey(keyDown, keyUp) {
    var that = gBase().setClass("vkey-container").h(160),
        i = 0,
        keys = 60,
        startKey = 16,
        nextX = 0,
        isDown = false;

    function addKey(note) {
        var key = gBase(),
            flat = true,
            keyX = 0;

        key.onmousedown = function (e) {
            gui.captureMouse(e);
        };
        key.onmouseover = function (e) {
            util.unused(e);
            if (isDown) {
                keyDown(note);
            }
        };
        key.iMouseCaptured = function (e) {
            util.unused(e);
            isDown = true;
            keyDown(note);
        };
        key.iMouseUpAfterCapture = function (e) {
            util.unused(e);
            keyUp();
            isDown = false;
        };

        that.add(key);

        if (note % 12 === 2 || note % 12 === 5 || note % 12 === 7
                || note % 12 === 10 || note % 12 === 0) {
            flat = false;
        }

        if (flat) {
            key.className = "vkey-key-flat";
            key.w(32).h(160);
        } else {
            key.className = "vkey-key-sharp";
            key.w(24).h(96);
        }
        keyX = nextX;

        if (flat) {
            nextX += gui.getStyleInt(key, "width");
        } else {
            keyX -= gui.getStyleInt(key, "width") / 2;
        }
        key.left(keyX).top(0);
        return key;
    }

    that.iKeyDown = function (key, shift) {
        var noteMap = {a: "C",  w: "C#", s: "D",
                       e: "D#", d: "E",  f: "F",
                       t: "F#", g: "G",  y: "G#",
                       h: "A",  u: "A#", j: "B"},
            cNote,
            octave = shift ? 2 : 3;

        cNote = noteMap[key] || 1;
        cNote += octave;
        cNote = note.noteFromName(cNote);
        if (cNote === -1) {
            return;
        }
        keyDown(cNote);
    };

    that.iKeyUp = function (key, shift) {
        util.unused(key);
        util.unused(shift);

        keyUp();
    };

    for (i = 0; i < keys; i += 1) {
        addKey(startKey + i);
    }
    that.w(nextX);
    that.typeIs = "wVKey";
    return that;
}
