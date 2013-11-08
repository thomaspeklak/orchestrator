"use strict";

var shoe = require("shoe");
var PassThrough = require("stream").PassThrough;
var cookieSignature = require("cookie-signature");
var Model = require("scuttlebutt/model");
var muxDemux = require("mux-demux");

var db = require("../db");
var config = require("../config");

var streams = {};

function connectToStream(session, stream) {
    return function () {
        var m = streams[session];
        if (!m) {
            console.log("new session");
            m = new Model();
            streams[session] = m;
            m.on("end", function () {console.log("ended");});
        }

        console.log("new browser attached");
        var s = m.createStream();
        s.pipe(stream).pipe(s);

        stream.on("end", function() {console.log("client stream ended");});
    };
}

module.exports = function (server) {
    var sock = shoe(function (stream) {
        var session;
        var mdm = muxDemux(function (stream) {
            if (stream.meta == "model") {
                if (!session) return;
                return connectToStream(session, stream)();
            }

            if (stream.meta == "verify") {
                stream.once("data", function verify(data) {
                    var sessionCookie = cookieSignature.unsign(data.replace(/.*?:/, ""), config.secret);
                    if (!sessionCookie) {
                        stream.end(new Error("no active session"));
                    }

                    db.sessions.get(sessionCookie, function (err, data) {
                        if (err) {
                            return stream.end(err.message);
                        }

                        db.streams.put(sessionCookie, {
                            lastAccessed: new Date()
                        }, function (err) {
                            if (err) return mdm.end();

                            session = sessionCookie;
                            stream.write("verified");
                        });
                    });
                });
            }
        });
        mdm.pipe(stream).pipe(mdm);
    });
    sock.install(server, "/socket");
};
