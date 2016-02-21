/*jslint node: true */

/*global gui*/
/*global gBase*/
/*global gLabel*/
/*global document*/

"use strict";

function gContainer() {
    var that = gBase();

    function makeLabeledCont(content, label) {
        var cont = gBase().display("inline-block"),
            contLabel = gLabel(label);

        //if we know its gBase: content.margin("0 auto");
        content.style.margin = "auto";

        cont.add(contLabel);
        cont.add(content);
        return cont;
    }

    function initTable() {
        that.table = gBase("table").setClass("gContainerTable");
        that.add(that.table);
        that.nextRow();
    }

    that.nextRow = function () {
        that.content = gBase("tr").setClass("gContainerRow");
        that.table.add(that.content);
        return that;
    };

    that.contentCount = function () {
        return that.content.childNodes.length;
    };

    that.addBeforeTable = function (node) {
        that.insertBefore(node, that.table);
        return that;
    };

    that.addTabled = function (content, label, wholeRow) {
        var cont = gBase("td").setClass("gContainerCell"),
            contentToAdd = content;

        if (typeof label === "string" && label !== "") {
            contentToAdd = makeLabeledCont(content, label);
        }

        cont.add(contentToAdd);
        that.content.add(cont);
        if (wholeRow) {
            cont.colSpan = 1000;
        }
        return that;
    };

    that.clear = function () {
        that.removeChild(that.table);
        initTable();
    };

    that.typeIs = "gContainer";
    that.typeClass = "gContainer";
    that.setClass("gContainer");
    initTable();
    return that;
}
