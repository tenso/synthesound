"use strict";

function verify(arg1, arg2) {
    if (arg1 !== arg2) {
        throw new Error(arg1 + " !== " + arg2);
    }
}

function verifyFloat(arg1, arg2, digits) {
    if (parseFloat(arg1.toFixed(digits)) !== arg2) {
        throw new Error(arg1 + " !== " + arg2);
    }
}

function verifyArray(arg1, arg2) {
    var i;
    if (arg1.length !== arg2.length) {
        throw new Error(arg1 + " !== " + arg2);
    }
    for (i = 0; i < arg1.length; i += 1) {
        if (arg1[i] !== arg2[i]) {
            throw new Error(arg1 + " !== " + arg2);
        }
    }
}

var tests = [];
function addTest(func, desc) {
    tests.push([desc, func]);
}

function runTests() {
    window.console.log("running tests");
    var i;
    for (i = 0; i < tests.length; i += 1) {
        window.console.log("test:" + tests[i][0]);
        tests[i][1]();
    }
}