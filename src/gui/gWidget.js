"use strict";
/*global log*/
/*global input*/
/*global gui*/
/*global gLabel*/

function gWidget(container, title) {
    var that = document.createElement("div");

    that.nextRow = function () {
        that.content = document.createElement("tr");
        that.table.appendChild(that.content);
        return that;
    };
    
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

        that.onmousepressandmove = function (e, mouse) {
            that.move(mouse.relativeX, mouse.relativeY);
            gIO.drawConnections();
        };

        that.table.appendChild(titleRow(that.title));

        that.appendChild(that.table);
        container.appendChild(that);

        that.nextRow();
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
            contLabel = gLabel(label);

        cont.appendChild(contLabel);
        cont.appendChild(content);
        that.addContent(cont);
        return that;
    };

    that.move(0, 0);
    return that;
}