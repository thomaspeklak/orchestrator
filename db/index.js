"use strict";

var LevelUp = require("level");
var Sublevel = require("level-sublevel");
var db = Sublevel(LevelUp(__dirname + "/orchastrator"));

module.exports = {
    sessions: db.sublevel("sessions", { valueEncoding: "json" }),
    streams: db.sublevel("streams", { valueEncoding: "json" }),
    users: db .sublevel("users", { valueEncoding: "json" })
};
