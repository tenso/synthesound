"use strict";
/*global log*/
/*global input*/
/*global gui*/

function gWidget(container, title) {
    var that = document.createElement("div");

    function titleRow(title) {
        var row = document.createElement("tr"),
            titleElem = document.createElement("td");

        titleElem.innerText = title;
        titleElem.className = "label";
        titleElem.colSpan = 10000;
        row.appendChild(titleElem);
        return row;
    }

    function containerInit(container, title) {
        if (!that) {
            log.error("gui.containerInit: that is undefined");
        } else if (!container) {
            log.error("gui.containerInit: container is undefined");
        }
        that.container = container;
        that.style.position = "absolute";
        that.title = title;
        that.contId = container.id;
        that.table = document.createElement("table");
        that.table.className = "collection-table component";

        that.onmousedown = function (e) {
            input.setMouseCapturer(e, that);
        };

        that.onmousepressandmove = function (e, relPos) {
            that.move(relPos.x, relPos.y);
        };

        that.table.appendChild(titleRow(that.title));

        that.appendChild(that.table);
        container.appendChild(that);

        that.content = document.createElement("tr");
        that.table.appendChild(that.content);
    }

    containerInit(container, title);

    that.move = function (x, y) {
        that.style.left = x + "px";
        that.style.top = y + "px";
        return that;
    };

    that.setClass = function (className) {
        that.className = className;
        return that;
    };

    that.addContent = function (content) {
        var cont = document.createElement("td");
        cont.appendChild(content);
        that.content.appendChild(cont);
        return that;
    };

    that.addLabeledContent = function (content, label) {
        var cont = document.createElement("div"),
            contLabel = gui.makeLabel(label);

        cont.appendChild(contLabel);
        cont.appendChild(content);
        that.addContent(cont);
        return that;
    };

    that.move(0, 0);
    return that;
}