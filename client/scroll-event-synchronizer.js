"use strict";

var _ = require("lodash");

function getWindowDimensions() {
    return {
        height: document.body.clientHeight,
        width: document.body.clientWidth
    };
}

var dimensions = getWindowDimensions();

window.addEventListener("resize", function resize() {
    _.throttle(function updateDimensions() {
        dimensions = getWindowDimensions();
    });
});

function ScrollEventSynchronizer(state) {
    window.addEventListener("scroll", _.throttle(function () {
        state.set("scroll", [window.scrollX / dimensions.width, window.scrollY / dimensions.height]);
    }, 10));
}

ScrollEventSynchronizer.prototype.register = function registerScrollEventSynchronizer(apply) {
    return apply("scroll", function (values) {
        values[0] = Math.round(values[0] * dimensions.width);
        values[1] = Math.round(values[1] * dimensions.height);
        window.scrollTo.apply(window, values);
    });
};

module.exports = ScrollEventSynchronizer;
