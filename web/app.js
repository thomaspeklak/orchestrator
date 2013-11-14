"use strict";

var path = require("path");
var express = require("express");
var flash = require("connect-flash");
var config = require("../config");
var LeveldbStore = require("connect-leveldb")(express);
var db = require("../db");

var helpers = require("level-userdb-passport")(db.users);
var LocalStrategy = require("passport-local").Strategy;
var passport = require("passport");
passport.use(new LocalStrategy({}, helpers.localStrategyVerify));
passport.deserializeUser(helpers.deserializeUser);
passport.serializeUser(helpers.serializeUser);

var app = express();

app.passport = passport;

// Express settings
app.disable("x-powered-by");

// Configuration
app.configure("development", function () {
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
});

app.configure("production", function () {
    app.use(express.errorHandler());
});

app.configure(function () {
    app.set("views", __dirname + "/views");
    app.set("view engine", "jade");
    app.set("view options", {
        layout: false
    });

    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.methodOverride());
    app.use(flash());

    app.use(express.cookieParser(config.secret));

    var levelDbStore = new LeveldbStore({
            ttl: 60 * 60 * 24,
            db: db.sessions,
            prefix: false
        });
    levelDbStore.prefix = "";
    app.use(express.session({
        store: levelDbStore,
        secret: config.secret,
        cookie: {httpOnly: false},
        key: "orchastrator"
    }));

    app.use(passport.initialize());
    app.use(passport.session());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, "..", "public")));
});

require("./helpers")(app);
require("./routes")(app);

module.exports = app;
