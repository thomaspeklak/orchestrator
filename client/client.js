"use strict";
var synchronize = require("./synchronize");
var engine = require("engine.io-stream");
var muxDemux = require("mux-demux");
var url = require("url");

var script = Array.prototype.filter.call(document.querySelectorAll("script"), function (script) {
    return script.src.match(/orchestrator(?:\.min|-dev)?.js/);
});

if (!script.length) return;

var domain = script[0].src.replace(/orchestrator(?:\.min|-dev)?\.js/,"");
var location = url.parse(domain);

function getToken(cb) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4){
            try {
                var response = JSON.parse(xhr.responseText);
                cb(response.token);
            } catch (e) {

            }
        }
    };

    xhr.withCredentials = true;
    xhr.open("POST", domain + "token", true);
    xhr.send();
}

function connect(token) {
    var stream = engine({hostname: location.domain, port: location.port, path: "/socket"});
    var mdm = muxDemux();

    stream.pipe(mdm).pipe(stream);

    var verify = mdm.createStream("verify");
    verify.write(token);

    verify.on("data", function (data) {
        if (data != "verified") return;

        var model = mdm.createStream("model");
        synchronize(model);
    });

    stream.on("end", function (data) {
        console.log(data);
    });
}

getToken(connect);
