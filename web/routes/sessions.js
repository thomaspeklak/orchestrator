"use strict";

var db = require("../../db");
var users = require("level-userdb")(db.users);
var config = require("../../config");

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
            error: req.flash("error")
        });
    });

    app.post("/", app.passport.authenticate("local", {
        successRedirect: "/current-session",
        failureRedirect: "/",
        failureFlash: "Incorrect username or password."
    }));

    app.get("/current-session", requireUser, function (req, res) {
        res.render("sessions/start");
    });

    app.get("/make-admin", function (req, res) {
        var userExists = false;
        db.users.createReadStream({
            limit: 1
        })
            .on("data", function () {
                userExists = true;
                res.send(400, "There is already an admin user.");
            }).on("end", function () {
                if (userExists) return;

                users.addUser(
                    config.defaultUser.username,
                    config.defaultUser.password, {}, function (err) {
                        if (err) {
                            console.error(err);
                            return res.send(500);
                        }

                        req.flash("info", "Default user created");
                        return res.redirect("/");
                    });

            });

    });
};
