"use strict";

var shoe = require("shoe");
var cookieSignature = require("cookie-signature");
var Model = require("scuttlebutt/model");
var muxDemux = require("mux-demux");

var db = require("../db");
var config = require("../config");

function logError(err) {
    if (err) console.error(err);
}

var streams = {};

function connectToStream(user, stream) {
    return function () {
        var m = streams[user];
        if (!m) {
            console.log("new user");
            m = new Model();
            streams[user] = m;
            m.on("end", function () {console.log("ended");});

            m.on("update", function () {
                db.streams.put(user, m.toJSON(), logError);
            });
        }

        console.log("new browser attached");
        var s = m.createStream();
        s.pipe(stream).pipe(s);

        stream.on("end", function() {console.log("client stream ended");});
    };
}

module.exports = function (server) {
    var sock = shoe(function (stream) {
        var user;
        var mdm = muxDemux(function (stream) {
            if (stream.meta == "model") {
                if (!user) return;
                return connectToStream(user, stream)();
            }

            if (stream.meta == "verify") {
                stream.once("data", function verify(data) {
                    var sessionCookie = cookieSignature.unsign(data.replace(/.*?:/, ""), config.secret);
                    if (!sessionCookie) {
                        stream.end(new Error("no active session"));
                    }

                    db.sessions.get(sessionCookie, function (err, data) {
                        if (err || !data.passport || !data.passport.user) {
                            return mdm.end(err.message);
                        }

                        user = data.passport.user;
                        stream.write("verified");
                    });
                });
            }
        });
        mdm.pipe(stream).pipe(mdm);
    });
    sock.install(server, "/socket");
};
