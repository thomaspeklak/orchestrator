"use strict";

var EventSynchronizer = function (state) {
    this.state = state;
};

EventSynchronizer.prototype.apply = function apply (type, cb) {
    var state = this.state;
    return function (change, timestamp, source) {
        if (source == state.id) return;
        if (change[0] !== type) return;

        cb(change[1]);
    };
};

EventSynchronizer.prototype.register = function registerStrategy(Strategy) {
    this.state.on("update", new Strategy(this.state).register(this.apply.bind(this)));
};

module.exports = EventSynchronizer;


