/*jslint node: true*/

/*global gBase*/
/*global gui*/
/*global util*/

"use strict";
function gResizer(that, minW, minH) {
    var bottom = gBase().abs().bottom(0).left(0).right(0).h(4).cursor("ns-resize"),
        right = gBase().abs().top(0).bottom(0).right(0).w(4).cursor("ew-resize"),
        corner = gBase().abs().bottom(0).right(0).w(4).h(4).cursor("nwse-resize"),
        inital,
        original = {};

    function captured(e, mouse) {
        util.unused(e);
        util.unused(mouse);

        if (!inital) {
            inital = {
                w: typeof minW === "number" ?  minW : that.getW(),
                h: typeof minH === "number" ?  minH : that.getH()
            };
        }

        original.w = that.getW();
        original.h = that.getH();
        that.emit("resizeStart");
    }

    function released() {
        that.emit("resizeEnd");
    }

    bottom.on("mouseCaptured", captured);
    bottom.on("mouseUpAfterCapture", released);
    right.on("mouseCaptured", captured);
    right.on("mouseUpAfterCapture", released);
    corner.on("mouseCaptured", captured);
    corner.on("mouseUpAfterCapture", released);

    bottom.onmousedown = function (e) {
        gui.captureMouse(e, bottom);
    };

    bottom.on("mousePressAndMove", function (e, mouse) {
        util.unused(e);
        that.h(mouse.change.y + original.h - 33); //FIXME: this offset is strange! is it scrollbar?
        if (that.getH() < inital.h) {
            that.h(inital.h - 33);  //FIXME: this offset is strange! is it scrollbar?
        }
    });

    right.onmousedown = function (e) {
        gui.captureMouse(e, right);
    };

    right.on("mousePressAndMove", function (e, mouse) {
        util.unused(e);
        that.w(mouse.change.x + original.w - 6); //FIXME: this offset is strange! is it scrollbar?
        if (that.getW() < inital.w) {
            that.w(inital.w - 6);  //FIXME: this offset is strange! is it scrollbar?
        }
    });

    corner.onmousedown = function (e) {
        gui.captureMouse(e, corner);
    };

    corner.on("mousePressAndMove", function (e, mouse) {
        util.unused(e);

        that.w(mouse.change.x + original.w - 6); //FIXME: this offset is strange! is it scrollbar?
        if (that.getW() < inital.w) {
            that.w(inital.w - 6);  //FIXME: this offset is strange! is it scrollbar?
        }
        that.h(mouse.change.y + original.h - 33); //FIXME: this offset is strange! is it scrollbar?
        if (that.getH() < inital.h) {
            that.h(inital.h - 33);  //FIXME: this offset is strange! is it scrollbar?
        }
    });

    that.add(bottom);
    that.add(right);
    that.add(corner);

    return that;
}
