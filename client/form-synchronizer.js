"use strict";

var getQuerySelector = require("get-query-selector");

function isCheckboxOrRadio(el) {
    return el.type == "checkbox" || el.type == "radio";
}

function FormSynchronizer(state) {
    document.body.addEventListener("change", function (e) {
        var selector = getQuerySelector(e.target);
        state.set("form", {
            selector: selector,
            value: isCheckboxOrRadio(e.target) ? e.target.checked : e.target.value
        });
    }, true);
}

FormSynchronizer.prototype.register = function registerFormSynchronizer(apply) {
    return apply("form", function (change) {
        var node = document.querySelector(change.selector);
        if (!node) return;
        var prop = isCheckboxOrRadio(node) ? "checked" : "value";

        if (node[prop] == change.value) return;

        node[prop] = change.value;
    });
};

module.exports = FormSynchronizer;
