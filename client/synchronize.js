"use strict";
var Model = require("scuttlebutt/model");
var EventSynchronizer = require("./event-synchronizer");
var ScrollEventSynchronizer = require("./scroll-event-synchronizer");

var state = new Model();

var synchronizer = new EventSynchronizer(state);

module.exports = function synchronize(stream) {
    window.state = state;
    var s = state.createStream();
    s.pipe(stream).pipe(s);

    synchronizer.register(ScrollEventSynchronizer);
};

