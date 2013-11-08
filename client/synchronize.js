"use strict";
var Model = require("scuttlebutt/model");
var _ = require("lodash");

var state = new Model();
module.exports = function synchronize(stream) {

window.state = state;
    var s = state.createStream();
    s.pipe(stream).pipe(s);

    state.on("update", function (values, timestamp, source) {
        console.dir(source);
        if (source == state.id) return;
        console.dir("updating");
        window.scrollTo.apply(window, state.get("scroll"));
    });
};

window.addEventListener("scroll", _.throttle(function () {
    state.set("scroll", [window.scrollX, window.scrollY]);
}, 16));
