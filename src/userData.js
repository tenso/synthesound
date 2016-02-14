"use strict";
/*global event*/

function userData() {
    var that = event(),
        userDoc = {login: false},
        password = "",
        email = "";

    that.update = function (doc) {
        userDoc = doc;
        that.emit("updated", userDoc);
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

    return that;
}
