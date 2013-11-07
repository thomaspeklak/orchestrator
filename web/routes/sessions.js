"use strict";

module.exports = function (app) {
    app.get("/", function (req, res) {
        res.render("index", {
            currentUrl: req.session.currentUrl
        });
    });

    app.post("/", function (req, res) {
        if (!req.body.key) res.send(500);
        req.session.key = req.body.key;

        res.render("sessions/start");
    });

};
