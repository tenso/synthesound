"use strict";
/*global Request*/
/*global Headers*/
/*global fetch*/
/*global log*/

var net = {
    packArgs: function (args) {
        var str = "",
            arg;
        for (arg in args) {
            if (args.hasOwnProperty(arg)) {
                if (str === "") {
                    str = "?";
                } else {
                    str += "&";
                }
                str += arg + "=" + encodeURIComponent(args[arg]);
            }
        }
        return str;
    },
    create: function (path, args, cb) {
        if (typeof args === "function") {
            cb = args;
            args = {};
        }

        var req = new Request(path, {
            method: "POST",
            credentials: "same-origin",
            body: JSON.stringify(args),
            headers: new Headers({
                "Content-Type": "application/json"
            })
        });

        fetch(req).then(function (response) {
            if (response.ok && response.status === 200) {
                response.json().then(function (json) {
                    cb(undefined, json);
                }).catch(function (err) {
                    cb("parse:" + err, {});
                });
            } else {
                cb("HTTP " + response.status, {});
            }
        }).catch(function (err) {
            cb("fetch failed", {});
        });
    },
    read: function (path, args, cb) {
        if (typeof args === "function") {
            cb = args;
            args = {};
        }


        var req = new Request(path + net.packArgs(args), {
            method: "GET",
            credentials: "same-origin"
        });
        fetch(req).then(function (response) {
            if (response.ok && response.status === 200) {
                response.json().then(function (json) {
                    cb(undefined, json);
                }).catch(function (err) {
                    cb("parse:" + err, {});
                });
            } else {
                cb("HTTP " + response.status, {});
            }
        }).catch(function (err) {
            cb("fetch failed", {});
        });
    }
};
