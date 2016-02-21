/*jslint node: true */

/*global wOkDialog*/
/*global gInput*/
/*global gButton*/
/*global lang*/
/*global log*/
/*global net*/
/*global user*/
/*global gLabel*/

"use strict";

function registerDialog() {
    var that = wOkDialog(lang.tr("register")).h(240),
        email = gInput("", undefined, lang.tr("email")).abs().x(10).y(30).w(340),
        password = gInput("", undefined, lang.tr("password")).abs().x(10).y(80).w(340).type("password"),
        passwordRepeat = gInput("", undefined, lang.tr("passwordRepeat")).abs().x(10).y(120).w(340).type("password"),
        status = gLabel("").abs().left(10).bottom(10).w(300).h(50).textAlign("left").whiteSpace("normal"),
        registerd = false;

    function verifyEmail(email) {
        return email.match(/[a-zA-Z_]+@[a-zA-Z_]+/);
    }

    that.on("ok", function (dialog) {
        if (registerd) {
            dialog.remove();
        }
        if (!verifyEmail(email.getValue())) {
            status.setValue(lang.tr("faultyEmail"));
            return;
        }

        if (password.getValue().length < 8) {
            status.setValue(lang.tr("passwordToShort"));
            return;
        }

        if (password.getValue() !== passwordRepeat.getValue()) {
            status.setValue(lang.tr("passwordMissmatch"));
            return;
        }

        net.read("register", {email: email.getValue(), password: password.getValue()}, function (err, result) {
            if (err) {
                status.setValue(lang.tr("error") + " " + err);
                log.error("register:" + err);
            } else {
                if (result.hasOwnProperty("ok") && !result.ok) {
                    status.setValue(lang.tr(result.error.info));
                } else {
                    status.setValue(lang.tr("registerOk"));
                    email.disabled(true);
                    password.disabled(true);
                    passwordRepeat.disabled(true);
                    registerd = true;
                }
            }
        });
    });

    that.add(email);
    that.add(password);
    that.add(passwordRepeat);
    that.add(status);

    return that;
}
