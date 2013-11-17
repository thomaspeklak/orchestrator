"use strict";

var LevelUp = require("level");
var Sublevel = require("level-sublevel");
var db = Sublevel(LevelUp(__dirname + "/orchastrator"));

var userDb = db.sublevel("users", { valueEncoding: "json" });
var levelUserDb = require("level-userdb")(userDb);

module.exports = {
    sessions: db.sublevel("sessions", { valueEncoding: "json" }),
    streams: db.sublevel("streams", { valueEncoding: "json" }),
    tokens: db.sublevel("tokens", { valueEncoding: "json" }),
    users: levelUserDb
};
