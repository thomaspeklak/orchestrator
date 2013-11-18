"use strict";

function LocationEventSynchronizer(state) {
    this.setInitalState(state);

    window.addEventListener("hashchange", function locationHashChanged() {
        state.set("location", location.href);
    }, false);
}

LocationEventSynchronizer.prototype.register = function registerLocationEventSynchronizer(apply) {
    return apply("location", function (value) {
        if (value == location.href) return;

        location.href = value;
    });
};

LocationEventSynchronizer.prototype.setInitalState = function (state) {
    if(location.href !== state.get("location")) {
        state.set("location", location.href);
    }
};

module.exports = LocationEventSynchronizer;
