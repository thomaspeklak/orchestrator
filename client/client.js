"use strict";
var cookie = require("cookie");
var synchronize = require("./synchronize");
var shoe = require("shoe");
var muxDemux = require("mux-demux");

var cookies = cookie.parse(document.cookie);

if ("orchastrator" in cookies) {
    var stream = shoe("/socket");

    var mdm = muxDemux();

    stream.pipe(mdm).pipe(stream);

    var verify = mdm.createStream("verify");
    verify.write(cookies.orchastrator);

    verify.on("data", function (data) {
        if (data != "verified") return;

        var model = mdm.createStream("model");
        synchronize(model);
    });

    stream.on("end", function (data) {
        console.log(data);
    });
}
