/*global gWidget*/
/*global gButton*/
/*global lang*/
/*global log*/
/*global net*/
/*global user*/
/*global gLabel*/
/*global wList*/
/*global nameDialog*/
/*global okDialog*/
"use strict";

//FIXME: contentContainer!!!
function fileDialog(contentContainer) {
    var that = gWidget().setTitle(lang.tr("files")).addRemove().w(500).h(400),
        fileList = wList(460, "#fff").abs().overflowY("scroll").h(300).w(480).x(10).y(60).bg("#444"),
        load,
        newFile,
        saveFile,
        delFileButton,
        status = gLabel().abs().top(35).right(10),
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

    //FIXME: break out and refactor as they are very similar
    function deleteFile(fileName) {
        net.del("users/" + user.email() + "/files/" + fileName, function (err, result) {
            if (err) {
                status.setValue(err);
                log.error("delete file:" + err);
            } else {
                log.d(result);
                if (result.hasOwnProperty("ok") && !result.ok) {
                    status.setValue(lang.tr(result.error.info));
                } else {
                    status.setValue("file deleted");
                }
            }
            user.refresh();
        });
    }

    function createFile(fileName, data) {
        net.create("users/" + user.email() + "/files/" + fileName, {data: data}, function (err, result) {
            if (err) {
                status.setValue(err);
                log.error("create file:" + err);
            } else {
                log.d(result);
                if (result.hasOwnProperty("ok") && !result.ok) {
                    status.setValue(lang.tr(result.error.info));
                } else {
                    status.setValue("file created");
                }
            }
            user.refresh();
        });
    }

    function loadFile(fileName) {
        net.read("users/" + user.email() + "/files/" + fileName, function (err, result) {
            if (err) {
                status.setValue(err);
                log.error("load file:" + err);
            } else {
                if (result.hasOwnProperty("ok") && !result.ok) {
                    status.setValue(lang.tr(result.error.info));
                } else {
                    status.setValue("got file");
                    contentContainer.loadWorkspace(JSON.parse(result.data));
                }
            }
        });
    }

    function updateFile(fileName, data) {
        net.update("users/" + user.email() + "/files/" + fileName, {data: data}, function (err, result) {
            if (err) {
                status.setValue(err);
                log.error("update file:" + err);
            } else {
                log.d(result);
                if (result.hasOwnProperty("ok") && !result.ok) {
                    status.setValue(lang.tr(result.error.info));
                } else {
                    status.setValue("file updated");
                }
            }
        });
    }

    load = gButton(lang.tr("load"), function () {
        if (fileList.selected()) {
            loadFile(fileList.selected());
        }
    }).abs().bottom(10).right(10);

    newFile = gButton(lang.tr("saveNew"), function () {
        nameDialog(function (name) {
            createFile(name, contentContainer.data());
        }, that);
    }).abs().bottom(10).right(160);

    saveFile = gButton(lang.tr("save"), function () {
        if (fileList.selected()) {
            okDialog(function () {
                updateFile(fileList.selected(), contentContainer.data());
            }, lang.tr("save") + ":" + fileList.selected(), that);
        }
    }).abs().bottom(10).right(100);

    delFileButton = gButton(lang.tr("delete"), function () {
        if (fileList.selected()) {
            okDialog(function () {
                var selected = fileList.selected();
                fileList.deselect();
                deleteFile(selected);
            }, lang.tr("delete") + ":" + fileList.selected(), that);
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
