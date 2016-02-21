/*jslint node: true */

/*global gContainer*/
/*global gButton*/
/*global wMenuButton*/
/*global wMenu*/
/*global gLabel*/
/*global wNote*/
/*global app*/
/*global appScreen*/
/*global files*/
/*global lang*/
/*global log*/
/*global window*/
/*global document*/
/*global loginDialog*/
/*global user*/
/*global fileDialog*/
/*global registerDialog*/

"use strict";
//FIXME: contentContainer used as workspace!!
function menubar(contentContainer) {
    var that = gContainer().abs().z(100000).w("100%").h(appScreen.minY).bg("#fff"),
        online,
        file,
        about,
        audio,
        errorLog,
        menus = [],
        helpString = lang.tr("helpText"),
        aboutString = "SyntheSound v." + app.ver + "\n" +
            "<a href='https://github.com/tenso'>Source Link</a>\n\n" +
            lang.tr("license"),
        loadInput,
        note;

    that.logError = function (error) {
        errorLog.bg("#f44").show(true);
        errorLog.addRow("error #" + errorLog.menu.contentCount(), function () {
            wNote(contentContainer, error).bg("#f44").color("#000");
        });
        wNote(contentContainer, error).bg("#f44").color("#000");
    };

    online = wMenuButton(lang.tr("online"), menus);
    online.addRow(lang.tr("login"), function () {
        contentContainer.add(loginDialog());
    });
    online.addRow(lang.tr("files"), function () {
        contentContainer.add(fileDialog(contentContainer));
    });
    online.addRow(lang.tr("register"), function () {
        contentContainer.add(registerDialog());
    });
    that.addTabled(online);

    user.on("updated", function (doc) {
        if (user.loggedIn()) {
            online.color("#8f8");
        } else {
            online.color("#f88");
        }
    });

    file = wMenuButton(lang.tr("export"), menus);

    loadInput = files.createLoadDataInput(function (data) {
        //FIXME: make event: contentContainer used badly
        contentContainer.loadWorkspace(data);
    });
    file.addOverlayed(lang.tr("load"), loadInput);

    file.addRow(lang.tr("save"), function () {
        //FIXME: make event: contentContainer used badly
        var data = contentContainer.data();
        files.saveData("synthdata.json", data);
    });
    file.addRow(lang.tr("quit"), function () {
        window.close();
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
            popup = wNote(mess);
            contentContainer.add(popup);
            popup.left(contentContainer.scrollLeft).top(contentContainer.scrollTop);
            return popup;
        };
    }

    audio = wMenuButton(lang.tr("process"), menus);
    audio.addRow(lang.tr("processOn"), function () {
        that.emit("processOn");
    });
    audio.addRow(lang.tr("processOff"), function () {
        that.emit("processOff");
    });
    that.addTabled(audio);

    about = wMenuButton(lang.tr("info"), menus);
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
