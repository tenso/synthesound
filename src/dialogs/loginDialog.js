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
    var that = gWidget().setTitle(lang.tr("user")).addRemove().w(360).h(160),
        email = gInput("", undefined, lang.tr("email")).abs().x(10).y(30).w(340),
        password = gInput("", undefined, lang.tr("password")).abs().x(10).y(80).w(340).type("password"),
        status = gLabel("").abs().left(10).bottom(10),
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
    }).abs().right(10).bottom(10);

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
    }).abs().right(10).bottom(10);

    that.add(email);
    that.add(password);
    that.add(status).add(logout).add(login);

    user.on("updated", function (doc) {
        updateFromUser();
    });
    updateFromUser();
    return that;
}
