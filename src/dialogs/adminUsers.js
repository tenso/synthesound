/*jslint node: true */

/*global gWidget*/
/*global lang*/
/*global log*/
/*global gContainer*/
/*global gLabel*/
/*global gButton*/
/*global wOkDialog*/
/*global net*/
/*global user*/
"use strict";

function adminUsers() {
    var that = gWidget().addRemove(),
        data = gContainer(),
        status = gLabel().abs().bottom(35).left(10),
        i;

    function userOp(opName, email, okCb) {
        net[opName]("users/" + email, function (err, result) {
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
            user.refreshAll();
        });
    }


    function buildDeleteButton(email) {
        if (email === "admin") {
            return gLabel("").margin("2px 10px 2px 10px");
        }
        return gButton(lang.tr("delete"), function () {
            wOkDialog(lang.tr("delete") + ":" + email, that, function (dialog) {
                userOp("del", email);
                dialog.remove();
            });
        }).margin("2px 10px 2px 10px");
    }

    function cell(label) {
        return gLabel(label).margin("2px 10px 2px 10px");
    }

    function buildUser(user) {
        data.addTabled(cell(user.email));
        data.addTabled(cell(user.info.name));
        data.addTabled(cell(user.info.validated));
        data.addTabled(cell(user.info.admin));
        data.addTabled(cell(user.createdAt));
        data.addTabled(cell(user.willBeDeletedStartingFrom));
        data.addTabled(cell(user.settings.debug));
        data.addTabled(cell(user.files.length));
        data.addTabled(buildDeleteButton(user.email));
        data.nextRow();

        if (!data.isEven()) {
            data.row().bg("#ccc");
        }
        return data;
    }

    that.setTitle(lang.tr("serverUsers"));
    that.add(status);

    user.on("allUpdated", function (users) {
        data.clear();
        data.row().bg("#aaa");
        data.addTabled(cell(lang.tr("email")).strong());
        data.addTabled(cell(lang.tr("name")).strong());
        data.addTabled(cell(lang.tr("validated")).strong());
        data.addTabled(cell(lang.tr("admin")).strong());
        data.addTabled(cell(lang.tr("createdAt")).strong());
        data.addTabled(cell(lang.tr("willBeDeletedStartingFrom")).strong());
        data.addTabled(cell(lang.tr("debug")).strong());
        data.addTabled(cell(lang.tr("numFiles")).strong());
        data.addTabled(cell(lang.tr("delete")).strong());
        data.nextRow();
        for (i = 0; i < users.length; i += 1) {
            that.add(buildUser(users[i]));
        }
    });

    user.refreshAll();
    return that;
}
