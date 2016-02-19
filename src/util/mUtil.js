/*jslint node: true */

/*global test*/

"use strict";

var mUtil = {
    mod: function (arg, base) {
        if (base < 0) {
            base = -base;
        }
        if (arg < 0) {
            return base - ((-arg) % base);
        }
        return arg % base;
    },

    log: function (x, base) {
        return Math.log(x) / Math.log(base);
    },

    sign: function (value) {
        return value >= 0 ? 1 : -1;
    },

    tests: {
        test_mod: function () {
            test.verify(mUtil.mod(-1, 4), 3);
            test.verify(mUtil.mod(-4, 12), 8);
            test.verify(mUtil.mod(4, 12), 4);
            test.verify(mUtil.mod(3, 2), 1);
            test.verify(mUtil.mod(-1, 1), 1);
            test.verify(mUtil.mod(-3, 3), 3);
            test.verify(mUtil.mod(3, 3), 0);
            test.verify(mUtil.mod(3, -3), 0);
            test.verify(mUtil.mod(-1, -3), 2);
            test.verify(mUtil.mod(-4, -3), 2);
            test.verify(mUtil.mod(-4, 3), 2);
            test.verify(mUtil.mod(4, -3), 1);
            test.verify(mUtil.mod(-48000, 480000), 432000);
        },

        test_log: function () {
            test.verify(mUtil.log(8, 2), 3);
            test.verify(mUtil.log(100, 10), 2);
        }
    }
};
test.addTests(mUtil, "mUtil");
