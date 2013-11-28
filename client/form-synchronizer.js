"use strict";

var getQuerySelector = require("get-query-selector");

function isCheckboxOrRadio(el) {
    return el.type == "checkbox" ||  el.type == "radio";
}

function FormSynchronizer(state) {
    this.state = state;
    document.body.addEventListener("change", function (e) {
        var selector = getQuerySelector(e.target);
        state.set("form", {
            type: "element",
            selector: selector,
            value: isCheckboxOrRadio(e.target) ? e.target.checked : e.target.value
        });
    }, true);

    document.body.addEventListener("submit", function (e) {
        var selector = getQuerySelector(e.target);
        state.set("form", {
            type: "submit",
            selector: selector
        });
    }, true);
}

var applyChange = {
    submit: function () {
        this.state.prevent("location");
    },
    "element": function (change) {
        var node = document.querySelector(change.selector);
        if (!node) return;
        var prop = isCheckboxOrRadio(node) ? "checked" : "value";

        if (node[prop] == change.value) return;

        node[prop] = change.value;
    }
};

FormSynchronizer.prototype.register = function registerFormSynchronizer(apply) {
    var self = this;
    return apply("form", function (change) {
        applyChange[change.type].bind(self)(change);
    });
};

module.exports = FormSynchronizer;
