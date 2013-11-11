"use strict";

module.exports = function (window) {
    if (typeof window.CustomEvent !== "undefined") return;

    function CustomEvent(event, params) {
        params = params || {
            bubbles: false,
            cancelable: false,
            detail: undefined
        };
        var evt = document.createEvent("CustomEvent");
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
    }

    CustomEvent.prototype = window.CustomEvent.prototype;

    window.CustomEvent = CustomEvent;
};
