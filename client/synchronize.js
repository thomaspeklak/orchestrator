"use strict";
var Model = require("scuttlebutt/model");

module.ecports = function synchronize(stream) {
    var state = new Model();

    stream.pipe(state.createStream()).pipe(stream);
};
