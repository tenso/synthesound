"use strict";
/*global Log*/

var Test = {
    verifyFunctionality: function (func, message) {
        if (!func) {
            Log.error("no " + message + ", please use modern browser");
        }
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

    tests: [],
        
    addTest: function (func, desc) {
        Test.tests.push([desc, func]);
    },
    
    addTests: function (obj, desc) {
        var name;
        if (obj.hasOwnProperty("tests")) {
            for (name in obj.tests) {
                if (obj.tests.hasOwnProperty(name)) {
                    Test.addTest(obj.tests[name], desc + ":" + name);
                }
            }
        }
    },

    runTests: function () {
        Log.info("running tests...");
        var i;
        for (i = 0; i < Test.tests.length; i += 1) {
            Log.info(" test:" + Test.tests[i][0]);
            Test.tests[i][1]();
        }
    }
};