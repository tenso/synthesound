/*global gWidget*/
/*global gButton*/
/*global lang*/
/*global log*/
/*global net*/
/*global user*/
/*global gLabel*/
/*global wList*/
/*global nameDialog*/
"use strict";

//FIXME: contentContainer!!!
function fileDialog(contentContainer) {
    var that = gWidget().setTitle(lang.tr("files")).addRemove().w(500).h(400),
        fileList = wList(460, "#fff").abs().overflowY("scroll").h(300).w(480).x(10).y(60).bg("#444"),
        load,
        newFile,
        deleteFile,
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

    function createFile(fileName, data) {
        net.create("users/" + user.email() + "/files/" + fileName, {data: contentContainer.data()}, function (err, result) {
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

    load = gButton(lang.tr("load"), function () {
        net.read("users/" + user.email() + "/files/" + fileList.selected(), function (err, result) {
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
    }).abs().bottom(10).right(10);

    newFile = gButton(lang.tr("saveNew"), function () {
        if (dialog) {
            dialog.remove();
        }
        dialog = nameDialog(function (name) {
            dialog.remove();
            if (name !== "") {
                createFile(name, {a: "b"});
            } else {
                status.setValue(lang.tr("emptyFileName"));
            }
        }).canMove(false);
        that.add(dialog);
    }).abs().bottom(10).right(100);

    deleteFile = gButton(lang.tr("delete"), function () {
        if (!fileList.selected()) {
            return;
        }
        var selected = fileList.selected();
        fileList.deselect();
        net.del("users/" + user.email() + "/files/" + selected, function (err, result) {
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
    }).abs().bottom(10).left(10);

    that.add(fileList);
    that.add(status).add(deleteFile);
    that.add(newFile).add(load);

    user.on("updated", function (doc) {
        updateFromUser();
    });
    updateFromUser();
    return that;
}
