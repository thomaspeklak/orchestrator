"use strict";

var shoe = require("shoe");
var cookieSignature = require("cookie-signature");
var Model = require("scuttlebutt/model");
var muxDemux = require("mux-demux");
var _ = require("lodash");

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

            m.on("update", _.throttle(function () {
                db.streams.put(user, m.toJSON(), logError);
            }, 2000));

            m.on("update", function (change) {
                if (change[0] == "location") {
                    m.set("scroll", [0,0]);
                    m.set("interaction", false);
                }
            });
        } else {
            m.set("interaction", false);
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
                    var token = cookieSignature.unsign(data.replace(/.*?:/, ""), config.secret);
                    if (!token) {
                        console.log("no active session");
                        stream.end(new Error("no active session"));
                    }

                    db.tokens.get(token, function (err, data) {
                        if (err || !data.user) {
                            console.log("token not found");
                            return mdm.end();
                        }

                        db.tokens.del(token);

                        var currentTime = new Date().getTime();
                        if (data.expires < currentTime) {
                            console.log("token expired");
                            return mdm.end();
                        }

                        user = data.user;
                        stream.write("verified");
                    });
                });
            }
        });
        mdm.pipe(stream).pipe(mdm);
    });
    sock.install(server, "/socket");
};
