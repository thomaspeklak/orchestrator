"use strict";

var path = require("path");
var express = require("express");
var config = require("../config");
var LeveldbStore = require("connect-leveldb")(express);
var db = require("../db");

var app = express();

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

    //app.use(express.logger());
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.methodOverride());

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

    app.use(app.router);
    app.use(express.static(path.join(__dirname, "..", "public")));
});

require("./helpers")(app);
require("./routes")(app);

module.exports = app;
