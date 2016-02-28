/*jslint node: true */

/*global event*/
/*global net*/
/*global log*/
"use strict";

function userData() {
    var that = event(),
        userDoc = {login: false},
        password = "",
        email = "",
        debugLoginAsAdmin = false;

    that.update = function (doc) {
        userDoc = doc;
        if (doc.email) {
            email = doc.email;
        }
        that.emit("updated", userDoc);
    };

    that.files = function () {
        if (userDoc.files) {
            return userDoc.files;
        }
        return [];
    };

    that.email = function () {
        return email;
    };

    that.storeEmail = function (value) {
        email = value;
    };

    that.loggedIn = function () {
        return userDoc.email;
    };

    that.storePassword = function (value) {
        password = value;
    };

    that.password = function () {
        return password;
    };

    that.refresh = function () {
        net.read("self", function (err, result) {
            if (err) {
                log.error("unabled to fetch self");
            } else {
                if (result.email) {
                    log.info("user is logged in");
                } else {
                    log.info("user is not logged in");
                    if (debugLoginAsAdmin) {
                        log.warn("debug login as admin:admin");
                        net.read("login", {email: "admin", password: "admin"}, function (err, result) {
                            if (err) {
                                log.error("login:" + err);
                            } else {
                                that.update(result);
                            }
                        });
                    }
                }
                that.update(result);
            }
        });
    };
    return that;
}
