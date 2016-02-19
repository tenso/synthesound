/*jslint node: true */

/*global gui*/
/*global note*/
/*global document*/
/*global util*/
/*global gBase*/

"use strict";

function wVKey(keyDown, keyUp) {
    var that = gBase().setClass("vkey-container").h(160),
        i = 0,
        keys = 60,
        startKey = 16,
        nextX = 0,
        isDown = false,
        lastNote;

    function addKey(keyNote) {
        var key = gBase(),
            flat = note.isFlat(keyNote),
            keyX = 0;

        key.onmousedown = function (e) {
            gui.captureMouse(e);
        };
        key.onmouseover = function (e) {
            util.unused(e);
            if (isDown) {
                lastNote = keyNote;
                keyDown(keyNote);
            }
        };
        key.iMouseCaptured = function (e) {
            util.unused(e);
            isDown = true;
            lastNote = keyNote;
            keyDown(lastNote);
        };
        key.iMouseUpAfterCapture = function (e) {
            util.unused(e);
            keyUp(lastNote);
            isDown = false;
        };

        that.add(key);

        if (flat) {
            key.className = "vkey-key-flat";
            key.w(32).h(160);
        } else {
            key.className = "vkey-key-sharp";
            key.w(24).h(96);
        }
        keyX = nextX;
        key.pressEffect({background: "#999"});

        if (flat) {
            nextX += gui.getStyleInt(key, "width");
        } else {
            keyX -= gui.getStyleInt(key, "width") / 2;
        }
        key.left(keyX).top(0);
        return key;
    }

    function noteFromKey(key, shift) {
        var noteMap = {a: "C",  w: "C#", s: "D",
                       e: "D#", d: "E",  f: "F",
                       t: "F#", g: "G",  y: "G#",
                       h: "A",  u: "A#", j: "B"},
            cNote,
            octave = shift ? 2 : 3;

        cNote = noteMap[key] || -1;
        if (cNote !== -1) {
            cNote += octave;
            cNote = note.noteFromName(cNote);
        }
        return cNote;
    }

    that.iKeyDown = function (key, shift) {
        var keyNote = noteFromKey(key, shift);
        if (keyNote > 0) {
            keyDown(keyNote);
        }
    };

    that.iKeyUp = function (key, shift) {
        var keyNote = noteFromKey(key, shift);
        if (keyNote > 0) {
            keyUp(keyNote);
        }
    };

    for (i = 0; i < keys; i += 1) {
        addKey(startKey + i);
    }
    that.w(nextX);
    that.typeIs = "wVKey";
    return that;
}
