"use strict";
/*global gWidget*/
/*global gButton*/
/*global wMenuButton*/
/*global wMenu*/
/*global gLabel*/
/*global wNote*/
/*global app*/
/*global files*/
/*global lang*/
/*global log*/

function menuBar(contentContainer) {
    var that = gWidget().canMove(false).z(10000).border("0").radius(0).w("100%").h(app.screen.minY).padding(2),
        file,
        about,
        errorLog,
        menus = [],
        helpString = lang.tr("helpText"),
        aboutString = "SyntheSound v." + app.ver + "\n\n" + lang.tr("license"),
        loadInput,
        note;

    that.logError = function (error) {
        errorLog.bg("#f00").show(true);
        errorLog.addRow("error #" + errorLog.menu.contentCount(), function () {
            wNote(contentContainer, error).padding(40).bg("#f00").color("#000");
        });
        wNote(contentContainer, error).padding(40).bg("#f00").color("#000");
    };

    file = wMenuButton(lang.tr("file"), menus);

    loadInput = files.createLoadDataInput(function (data) {
        contentContainer.loadWorkspace(data);
    });
    file.addOverlayed(lang.tr("load"), loadInput);

    file.addRow(lang.tr("save"), function () {
        var data = contentContainer.data();
        files.saveData("synthdata.json", data);
    });
    that.addTabled(file);

    function makePopup(message) {
        return function () {
            var popup,
                mess;
            if (typeof message === "function") {
                mess = message();
            } else {
                mess = message;
            }
            popup = wNote(mess).padding(40);
            contentContainer.add(popup);
            popup.left(contentContainer.scrollLeft).top(contentContainer.scrollTop);
            return popup;
        };
    }

    about = wMenuButton("?", menus);
    about.addRow(lang.tr("help"), makePopup(helpString));
    about.addRow(lang.tr("about"), makePopup(aboutString));
    about.addRow(lang.tr("log"), makePopup(log.logText));
    that.addTabled(about);

    errorLog = wMenuButton(lang.tr("detectedErrors"), menus).show(false);
    that.addTabled(errorLog);

    that.addEventListener("mouseleave", function () {
        file.closeAll();
    });

    note = gLabel("").textAlign("left");
    that.addTabled(note);

    that.setNote = function (str) {
        note.setValue(str);
        return that;
    };

    return that;
}
