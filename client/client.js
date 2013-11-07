"use strict";
var reconnect = require("reconnect/shoe");
var cookie = require("cookie");
var synchronize = require("./synchronize");

var cookies = cookie.parse(document.cookie);


if ("orchastrator" in cookies) {
    reconnect(function(stream) {
        stream.write(cookies.orchastrator);

        stream.on("data", function verify(data) {
            if (data == "accepted") {
                stream.removeListener("data", verify);

                synchronize(stream);
            }
        });

        stream.on("end", function (data) {
            console.dir(data);
        });

    }).connect("/socket");
}
