"use strict";

var db = require("../../db");

function requireUser(req, res, next) {
    if (!req.user) {
        return res.send(401);
    }

    next();
}

module.exports = function (app) {
    app.get("/", function (req, res) {
        if (req.user) {
            return res.redirect("/current-session");
        }

        res.render("index", {
            error: req.flash("error"),
            info: req.flash("info")
        });
    });

    app.post("/", app.passport.authenticate("local", {
        successRedirect: "/current-session",
        failureRedirect: "/",
        failureFlash: "Incorrect username or password."
    }));

    app.get("/current-session", requireUser, function (req, res) {
        db.streams.get(req.user.email, function (err, stream) {
            res.render("sessions/start", stream);
        });
    });

};
