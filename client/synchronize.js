"use strict";
var Model = require("scuttlebutt/model");
var _ = require("lodash");

var state = new Model();

var Strategies = function () {
    this.strategies = {};
};

Strategies.prototype.add = function addStrategy(type, fn) {
    this.strategies[type] = fn;
};

Strategies.prototype.apply = function (change) {
    if (!this.strategies[change[0]]) throw new Error("no strategy " + type + " defined.");

    this.strategies[change[0]](change[1]);
};

var strategies = new Strategies();


function getWindowDimensions() {
    return {
        height: document.body.clientHeight,
        width: document.body.clientWidth
    }
}

var dimensions = getWindowDimensions()
strategies.add("scroll", function scrollStratefy(values) {
    values[0] = Math.round(values[0] * dimensions.width);
    values[1] = Math.round(values[1] * dimensions.height);
    window.scrollTo.apply(window, values);
});
window.addEventListener("scroll", _.throttle(function () {
    state.set("scroll", [window.scrollX / dimensions.width, window.scrollY / dimensions.height]);
}, 10));

module.exports = function synchronize(stream) {
    window.state = state;
    var s = state.createStream();
    s.pipe(stream).pipe(s);

    state.on("update", function (change, timestamp, source) {
        if (source == state.id) return;

        strategies.apply(change);

    });
};

