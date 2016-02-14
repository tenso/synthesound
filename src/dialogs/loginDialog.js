/*global gWidget*/
/*global gInput*/
/*global gButton*/
/*global lang*/
/*global log*/
/*global net*/
/*global user*/
/*global gLabel*/
"use strict";

function loginDialog() {
    var that = gWidget().setTitle(lang.tr("user")).addRemove(),
        email = gInput("", undefined, lang.tr("email"), 300),
        password = gInput("", undefined, lang.tr("password"), 300, "password"),
        status = gLabel(""),
        login,
        logout;

    function updateFromUser() {
        email.setValue(user.email());
        email.disabled(user.loggedIn());
        password.setValue(user.password());
        login.show(!user.loggedIn());
        logout.show(user.loggedIn());
        password.show(!user.loggedIn());
    }

    login = gButton(lang.tr("ok"), function () {
        user.storePassword(password.getValue());
        user.storeEmail(email.getValue());
        net.read("login", {email: email.getValue(), password: password.getValue()}, function (err, result) {
            if (err) {
                status.setValue(err);
                log.error("login:" + err);
            } else {
                status.setValue(lang.tr("logged in"));
                user.update(result);
            }
        });
    });

    logout = gButton(lang.tr("logout"), function () {
        net.read("logout", function (err, result) {
            if (err) {
                status.setValue(err);
                log.error("logout:" + err);
            } else {
                status.setValue(lang.tr("logged out"));
                user.update(result);
            }
        });
    });

    that.addTabled(email);
    that.nextRow();
    that.addTabled(password);
    that.nextRow();
    that.addTabled(status).addTabled(logout).addTabled(login);

    user.on("updated", function (doc) {
        updateFromUser();
    });
    updateFromUser();
    return that;
}
