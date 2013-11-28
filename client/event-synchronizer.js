"use strict";

var EventSynchronizer = function (state) {
    this.state = state;
    state.preventNext = {};
    state.prevent = function (type) {
        if (!state.preventNext[type]) throw new Error("No type " + type + " registered");

        state.preventNext[type].push(true);
        console.log("prevent next " + type);
    };
};

EventSynchronizer.prototype.apply = function apply (type, cb) {
    var state = this.state;
    state.preventNext[type] = [];
    return function (change, timestamp, source) {
        if (state.preventNext[type].pop()) {
        console.log("preventing next " + type);
        return;
}
        if (source == state.id) return;
        if (change[0] !== type) return;

        cb(change[1]);
    };
};

EventSynchronizer.prototype.register = function registerStrategy(Strategy) {
    this.state.on("update", new Strategy(this.state).register(this.apply.bind(this)));
};

module.exports = EventSynchronizer;


