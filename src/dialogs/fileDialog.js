/*global gWidget*/
/*global gButton*/
/*global lang*/
/*global log*/
/*global net*/
/*global user*/
/*global gLabel*/
/*global wMenu*/
"use strict";

function fileDialog() {
    var that = gWidget().setTitle(lang.tr("files")).addRemove().w(600).h(400),
        fileList = wMenu(460, "#fff").abs().overflowY("scroll").removeOnLeave(0).h(320).w(480).x(10).y(40).bg("#444"),
        load,
        newFile,
        status = gLabel().abs().top(40).right(10),
        selectedFile = gLabel().abs().bottom(10).left(10),
        selected = "";

    function updateFromUser() {
        var i,
            files = user.files();

        function addFile(file) {
            fileList.addRow(file, function () {
                selected = file;
                selectedFile.setValue(selected);
            });
        }

        fileList.clear();
        for (i in files) {
            if (files.hasOwnProperty(i)) {
                addFile(files[i].name);
            }
        }
    }

    load = gButton(lang.tr("load"), function () {
        net.read("users/" + user.email() + "/files/" + selected, function (err, result) {
            if (err) {
                status.setValue(err);
                log.error("load file:" + err);
            } else {
                status.setValue("got file");
                log.d("please load:" + JSON.stringify(result));
            }
        });
    }).abs().bottom(10).right(10);

    newFile = gButton(lang.tr("new"), function () {
        net.create("users/" + user.email() + "/files/" + "newFileName", {data: {file: "my first data", dobb: 10.5}}, function (err, result) {
            if (err) {
                status.setValue(err);
                log.error("create file:" + err);
            } else {
                status.setValue("file created");
            }
        });
    }).abs().bottom(10).right(100);

    that.add(fileList);
    that.add(status);
    that.add(selectedFile).add(newFile).add(load);

    user.on("updated", function (doc) {
        updateFromUser();
    });
    updateFromUser();
    return that;
}
