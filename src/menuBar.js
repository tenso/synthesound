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

function menuBar(container, contentContainer) {
    var that = gWidget(container).canMove(false).z(10000).border("0").radius(0).w("100%").padding(2),
        file,
        about,
        log,
        menus = [],
        helpString = lang.tr("helpText"),
        aboutString = "SyntheSound v." + app.ver + "\n(C) 2015 Anton Olofsson, GPL 3",
        loadInput;
    
    that.logError = function (error) {
        log.bg("#f00").show(true);
        log.add("error #" + log.menu.contentCount(), function () {
            wNote(contentContainer, error).padding(40).bg("#f00").color("#000");
        });
        wNote(contentContainer, error).padding(40).bg("#f00").color("#000");
    };
    
    file = wMenuButton(lang.tr("file"), menus);

    loadInput = files.createLoadDataInput(function (data) {
        contentContainer.loadWorkspace(data);
    });
    file.addOverlayed(lang.tr("load"), loadInput);
    
    file.add(lang.tr("save"), function () {
        var data = contentContainer.data();
        files.saveData("synthdata.json", data);
    });
    that.addContent(file);
    
    about = wMenuButton("?", menus);
    about.add(lang.tr("help"), function () {wNote(contentContainer, helpString).padding(40); });
    about.add(lang.tr("about"), function () {wNote(contentContainer, aboutString).padding(40); });
    that.addContent(about);
    
    log = wMenuButton(lang.tr("detectedErrors"), menus).show(false);
    that.addContent(log);
    
    that.addEventListener("mouseleave", function () {
        file.closeAll();
    });
    
    return that;
}