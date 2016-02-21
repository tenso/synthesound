/*jslint node: true */
/*jslint es5: true*/

/*global Request*/
/*global Headers*/
/*global fetch*/
/*global log*/

"use strict";

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
    makeRequest: function (req, cb) {
        fetch(req).then(function (response) {
            if (response.ok && response.status === 200) {
                response.json().then(function (json) {
                    cb(undefined, json);
                }).catch(function (err) {
                    cb("json parse:" + err, {});
                });
            } else {
                cb("HTTP " + response.status, {});
            }
        }).catch(function (err) {
            cb("fetch failed", {});
        });
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
        net.makeRequest(req, cb);
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
        net.makeRequest(req, cb);
    },

    update: function (path, args, cb) {
        var req = new Request(path, {
            method: "PATCH",
            credentials: "same-origin",
            body: JSON.stringify(args),
            headers: new Headers({
                "Content-Type": "application/json"
            })
        });
        net.makeRequest(req, cb);
    },

    del: function (path, args, cb) {
        if (typeof args === "function") {
            cb = args;
            args = {};
        }
        var req = new Request(path, {
            method: "DELETE",
            credentials: "same-origin"
        });
        net.makeRequest(req, cb);
    }
};
