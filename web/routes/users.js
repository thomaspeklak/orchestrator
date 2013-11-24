"use strict";
var db = require("../../db");
var requireUser = require("../require-user");

function requireAdmin(req, res, next) {
    if (req.user.data && req.user.data.admin) return next();

    res.send(401);
}

function checkForExistingUser(req, res, next) {
    if (!req.body.email) return next();
    db.users.findUser(req.body.email, function (err) {
        if (!err) {
            req.flash("error", "User exists");
            return res.redirect("/admin/users");
        }
        if (err.name == "NotFoundError") return next();
        console.error(err);
        res.send(500);
    });
}

module.exports = function (app) {
    app.get("/admin/users", [requireUser, requireAdmin], function (req, res) {
        var users = [];
        var error = false;
        db.users.createUserStream()
            .on("data", function (user) {
                users.push(user);
            })
            .on("end", function () {
                if (error) return;
                res.render("users/list", {
                    users: users,
                    info: req.flash("info"),
                    error: req.flash("error")
                });
            })
            .on("error", function (err) {
                error = true;
                console.error(err);
                res.send(500);
            });

    });

    app.get("/admin/users/add", [requireUser, requireAdmin], function (req, res) {
        res.render("users/add", {
            errors: {},
            values: {}
        });
    });

    app.post("/admin/users", [requireUser, requireAdmin, checkForExistingUser], function (req, res) {
        var errors = {};
        if (!req.body.email) errors.email = "required";
        if (!req.body.password) errors.password = "required";
        if (req.body.password.length < 8) errors.password = "length";

        if (Object.keys(errors).length) {
            return res.render("users/add", {
                errors: errors,
                values: req.body
            });
        }

        var data = {};
        if (req.body.admin == "on") data.admin = 1;

        db.users.addUser(req.body.email, req.body.password, data, function (err) {
            if (err) {
                console.error(err);
                return res.send(500);
            }

            req.flash("info", "User created");
            res.redirect("/admin/users");
        });
    });

    app.del("/admin/users/:email", [requireUser, requireAdmin], function (req, res) {
        db.users.deleteUser(req.params.email, function (err) {
            if (err) {
                console.error(err);
                return res.send(500);
            }
            req.flash("info", "User deleted");
            res.redirect("/admin/users");
        });
    });
};
