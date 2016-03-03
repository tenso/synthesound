/*jslint node: true */

/*global gWidget*/
/*global lang*/
/*global log*/
/*global gContainer*/
/*global gLabel*/
"use strict";

function adminUsers(users) {
    var that = gWidget().addRemove(),
        data = gContainer(),
        i;

    function cell(label) {
        return gLabel(label).margin("2px 10px 2px 10px");
    }

    function buildUser(user) {
        data.addTabled(cell(user.email));
        data.addTabled(cell(user.info.name));
        data.addTabled(cell(user.info.validated));
        data.addTabled(cell(user.info.admin));
        data.addTabled(cell(user.settings.debug));
        data.addTabled(cell(user.files.length));
        data.nextRow();

        if (!data.isEven()) {
            data.row().bg("#ccc");
        }
        return data;
    }

    data.row().bg("#aaa");
    data.addTabled(cell("email").strong());
    data.addTabled(cell("name").strong());
    data.addTabled(cell("validated").strong());
    data.addTabled(cell("admin").strong());
    data.addTabled(cell("debug").strong());
    data.addTabled(cell("num files").strong());
    data.nextRow();

    that.setTitle(lang.tr("serverUsers"));

    for (i = 0; i < users.length; i += 1) {
        that.add(buildUser(users[i]));
    }

    return that;
}
