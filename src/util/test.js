"use strict";

/*global log*/

var test = {
    tests: [],
    
    verifyFunctionality: function (func, message) {
        if (!func) {
            log.error("no functionality: " + message);
            return false;
        }
        return true;
    },

    verify: function (arg1, arg2) {
        if (arg1 !== arg2) {
            throw new Error(arg1 + " !== " + arg2);
        }
    },

    verifyFloat: function (arg1, arg2, digits) {
        if (parseFloat(arg1.toFixed(digits)) !== arg2) {
            throw new Error(arg1 + " !== " + arg2);
        }
    },

    verifyArray: function (arg1, arg2) {
        var i;
        if (arg1.length !== arg2.length) {
            throw new Error(arg1 + " !== " + arg2);
        }
        for (i = 0; i < arg1.length; i += 1) {
            if (arg1[i] !== arg2[i]) {
                throw new Error(arg1 + " !== " + arg2);
            }
        }
    },
    
    addTest: function (func, desc) {
        test.tests.push([desc, func]);
    },
    
    addTests: function (obj, desc) {
        var name;
        if (obj.hasOwnProperty("tests")) {
            for (name in obj.tests) {
                if (obj.tests.hasOwnProperty(name)) {
                    test.addTest(obj.tests[name], desc + ":" + name);
                }
            }
        }
    },

    runTests: function (verbose) {
        if (verbose) {
            log.info("running tests...");
        }
        var i;
        for (i = 0; i < test.tests.length; i += 1) {
            if (verbose) {
                log.info(" test:" + test.tests[i][0]);
            }
            test.tests[i][1]();
        }
    }
};