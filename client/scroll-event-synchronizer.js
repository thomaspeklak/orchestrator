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
        var current = state.get("scroll");
        var timestamp = new Date().getTime();

        if (current.initiator != state.id && timestamp < current.timestamp + 100) return;

        state.set("scroll", {
            x: window.scrollX / dimensions.width,
            y: window.scrollY / dimensions.height,
            initiator: state.id,
            timestamp: timestamp
        });
    }, 10));
}

ScrollEventSynchronizer.prototype.register = function registerScrollEventSynchronizer(apply) {
    return apply("scroll", function (values) {
        values.x = Math.round(values.x * dimensions.width);
        values.y = Math.round(values.y * dimensions.height);
        window.scrollTo(values.x, values.y);
    });
};

module.exports = ScrollEventSynchronizer;
