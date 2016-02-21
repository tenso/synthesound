/*jslint node: true */

/*global gWidget*/
/*global gButton*/
/*global lang*/
/*global log*/
/*global net*/
/*global user*/
/*global gLabel*/
/*global wList*/
/*global wNameDialog*/
/*global wOkDialog*/

"use strict";

//FIXME: contentContainer!!!
function fileDialog(contentContainer) {
    var that = gWidget().setTitle(lang.tr("files")).addRemove().w(500).h(400),
        fileList = wList(460, "#fff").abs().overflowY("scroll").overflowX("auto").h(300).w(480).x(10).y(40).bg("#444"),
        load,
        newFile,
        saveFile,
        delFileButton,
        status = gLabel().abs().bottom(35).left(10),
        dialog;

    function updateFromUser() {
        var i,
            files = user.files();

        function addFile(file) {
            fileList.addRow(file);
        }

        fileList.clear();
        for (i in files) {
            if (files.hasOwnProperty(i)) {
                addFile(files[i].name);
            }
        }
    }

    function fileOp(opName, fileName, data, okCb) {
        net[opName]("users/" + user.email() + "/files/" + fileName, data, function (err, result) {
            if (err) {
                status.setValue(lang.tr("error") + " " + err);
                log.error(opName + ": " + err);
            } else {
                log.d(result);
                if (result.hasOwnProperty("ok") && !result.ok) {
                    status.setValue(lang.tr(result.error.info));
                } else {
                    status.setValue(lang.tr("ok"));
                    if (typeof okCb === "function") {
                        okCb(result);
                    }
                }
            }
            user.refresh();
        });
    }

    load = gButton(lang.tr("load"), function () {
        if (fileList.selected()) {
            fileOp("read", fileList.selected(), {}, function (result) {
                contentContainer.loadWorkspace(JSON.parse(result.data));
            });
        }
    }).abs().bottom(10).right(10);

    newFile = gButton(lang.tr("saveNew"), function () {
        wNameDialog(function (name) {
            fileOp("create", name, {data: contentContainer.data()});
        }, that);
    }).abs().bottom(10).right(160);

    saveFile = gButton(lang.tr("save"), function () {
        if (fileList.selected()) {
            wOkDialog(lang.tr("save") + ":" + fileList.selected(), that, function (dialog) {
                fileOp("update", fileList.selected(), {data: contentContainer.data()});
                dialog.remove();
            });
        } else {
            status.setValue(lang.tr("selectFile"));
        }
    }).abs().bottom(10).right(100);

    delFileButton = gButton(lang.tr("delete"), function () {
        if (fileList.selected()) {
            wOkDialog(lang.tr("delete") + ":" + fileList.selected(), that, function (dialog) {
                var selected = fileList.selected();
                fileList.deselect();
                fileOp("del", selected);
                dialog.remove();
            });
        } else {
            status.setValue(lang.tr("selectFile"));
        }
    }).abs().bottom(10).left(10);

    that.add(fileList);
    that.add(status).add(delFileButton);
    that.add(newFile).add(load).add(saveFile);

    user.on("updated", function (doc) {
        updateFromUser();
    });
    updateFromUser();
    return that;
}
