"use strict";

function LocationEventSynchronizer(state) {
    if(location.href !== state.get("location")) {
        state.set("location", location.href);
    }
}

LocationEventSynchronizer.prototype.register = function registerLocationEventSynchronizer(apply) {


};
