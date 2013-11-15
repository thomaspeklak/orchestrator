"use strict";

var getQuerySelector = require("get-query-selector");
require("../lib/custom-event")(window);

function handleInteractionWrapper(state) {
    return function handleInteraction(e) {
        if (e.detail.synchronizationEvent) return;
        var selector = getQuerySelector(e.target);
        state.set("interaction", {
            type: e.type,
            selector: selector
        });
    };
}

function InteractionEventSynchronizer(state) {
    ["click", "mouseover", "mouseout", "mousedown", "mouseup", "mouseenter", "mouseleave"].forEach(function (event) {
        document.body.addEventListener(event, handleInteractionWrapper(state), true);
    });
}

InteractionEventSynchronizer.prototype.register = function registerInteractionEventSynchronizer(apply) {
    return apply("interaction", function (event) {
        var customEvent = new CustomEvent(event.type, {
            detail: {
                synchronizationEvent: true
            }
        });
        var node = document.querySelector(event.selector);

        if (node.dispatchEvent) {
            node.dispatchEvent(customEvent);
        } else if (node.fireEvent) { // IE < 9
            node.fireEvent("on" + customEvent.eventType, customEvent);
        } else if (node[event.type]) {
            node[event.type]();
        } else if (node["on" + event.type]) {
            node["on" + event.type]();
        }
    });
};

module.exports = InteractionEventSynchronizer;
