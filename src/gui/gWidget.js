"use strict";
/*global log*/
/*global gui*/
/*global gBase*/
/*global gLabel*/
/*global gButton*/
/*global document*/
/*global util*/

function gWidget() {
    var that = gBase(),
        titleElem = gBase().marginRight(20); //that is close buttons width

    function containerInit() {
        that.typeIs = "gWidget";
        that.typeClass = "gWidget";
        that.className = "gWidget";
        that.style.position = "absolute";
        that.style.zIndex = gui.nextZ();

        that.titleRow = gBase();
        that.titleRow.setClass("gWidgetTitle");
        that.add(that.titleRow);

        //that.table = gBase("table"); //FIXME: gives borders!!
        that.table = document.createElement("table");
        that.table.className = "gWidgetTable";

        that.titleRow.add(titleElem);
        that.add(that.table);
        that.nextRow();
    }

    that.setTitle = function (title) {
        titleElem.textContent = title;
        return that;
    };

    that.nextRow = function () {
        that.content = gBase("tr").setClass("gWidgetRow");
        that.table.appendChild(that.content); //FIXME: not a gBase
        return that;
    };

    that.contentCount = function () {
        return that.content.childNodes.length;
    };

    that.remove = function () {
        that.parentNode.removeChild(that);
        return that;
    };

    that.addTabled = function (content, wholeRow) {
        var cont = gBase("td").setClass("gWidgetCell");
        cont.add(content);
        that.content.add(cont);
        if (wholeRow) {
            cont.colSpan = 1000;
        }
        return that;
    };

    that.addLabeledContent = function (content, label) {
        var cont = gBase().display("inline-block"),
            contLabel = gLabel(label);

        //if we know its gBase: content.margin("0 auto");
        content.style.margin = "auto";

        cont.add(contLabel);
        cont.add(content);
        that.addTabled(cont);
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

    that.padding = function (value) {
        that.table.style.padding = value;
        return that;
    };

    containerInit();
    that.canMove(true);

    return that;
}
