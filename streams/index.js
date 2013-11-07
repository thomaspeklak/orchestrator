"use strict";

var shoe = require("shoe");
var PassThrough = require("stream").PassThrough;
var cookieSignature = require("cookie-signature");

var db = require("../db");
var config = require("../config");

var streams = {};

function connectToStream(session, stream) {
    return function () {
        if (!streams[session]) {
            streams[session] = new PassThrough();
        }

        stream.write("accepted");
        stream.pipe(streams[session]).pipe(stream);
    };
}

module.exports = function (server) {

    var sock = shoe(function (stream) {
        stream.once("data", function verify(data) {
            var session = cookieSignature.unsign(data.replace(/.*?:/, ""), config.secret);
            if (!session) {
                stream.end(new Error("no active session"));
            }

            db.sessions.get(session, function (err, data) {
                if (err) {
                    return stream.end(err.message);
                }
                db.streams.put(session, {
                    lastAccessed: new Date()
                }, connectToStream(data.key, stream));
            });
        });
    });
    sock.install(server, "/socket");
};
