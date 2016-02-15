"use strict";
/*global log*/
/*global gui*/
/*global gBase*/
/*global gLabel*/
/*global gButton*/
/*global document*/
/*global util*/
/*global gContainer*/

function gWidget() {
    var that = gContainer(),
        titleElem = gBase().marginRight(20).cursor("default"); //that is close buttons width

    that.setTitle = function (title) {
        titleElem.textContent = title;
        return that;
    };

    that.addRemove = function (callback) {
        var button = gButton("x", function () {
            if (callback) {
                callback();
            }
            that.remove();
        }).abs().setClass("gWidgetCloseButton").hoverEffect(true, "#444");

        that.titleRow.add(button);
        return that;
    };

    that.canMove = function (value) {
        if (value) {
            that.onmousedown = function (e) {
                gui.captureMouse(e, that);
            };

            that.iMouseCaptured = function () {
                that.style.zIndex = gui.nextZ();
            };

            that.iMousePressAndMove = function (e, mouse) {
                util.unused(e);
                that.move(mouse.relativeX, mouse.relativeY);
                if (that.getX() < 0) {
                    that.x(0);
                }
                if (that.getY() < 0) {
                    that.y(0);
                }
            };
        } else {
            that.onmousedown = undefined;
            that.iMousePressAndMove = undefined;
        }
        return that;
    };

    that.gParent = function () {
        return that;
    };

    that.typeIs = "gWidget";
    that.typeClass = "gWidget";
    that.className = "gWidget";
    that.style.position = "absolute";
    that.style.zIndex = gui.nextZ();

    that.titleRow = gBase();
    that.titleRow.setClass("gWidgetTitle");
    that.addBeforeTable(that.titleRow);
    that.titleRow.add(titleElem);

    that.canMove(true);

    return that;
}
