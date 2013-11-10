"use strict";

function LocationEventSynchronizer(state) {
    if(location.href !== state.get("location")) {
        state.set("location", location.href);
    }

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

module.exports = LocationEventSynchronizer;
