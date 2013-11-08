"use strict";
var Model = require("scuttlebutt/model");

var state = new Model();
module.exports = function synchronize(stream) {

window.state = state;
    var s = state.createStream();
    s.pipe(stream).pipe(s);
    s.resume();

    state.on("update", function () {
        console.log("update");
    });
};
