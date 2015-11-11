"use strict";
/*global verify*/
/*global addTest*/

function mod(arg, base) {
    if (base < 0) {
        base = -base;
    }
    if (arg < 0) {
        return base - ((-arg) % base);
    }
    return arg % base;
}

function test_mod() {
    verify(mod(-1, 4), 3);
    verify(mod(-4, 12), 8);
    verify(mod(4, 12), 4);
    verify(mod(3, 2), 1);
    verify(mod(-1, 1), 1);
    verify(mod(-3, 3), 3);
    verify(mod(3, 3), 0);
    verify(mod(3, -3), 0);
    verify(mod(-1, -3), 2);
    verify(mod(-4, -3), 2);
    verify(mod(-4, 3), 2);
    verify(mod(4, -3), 1);
    verify(mod(-48000, 480000), 432000);
}
addTest(test_mod, "mod()");