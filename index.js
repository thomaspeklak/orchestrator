"use strict";

var shoe = require("shoe");
var http = require("http");
var fs  = require("fs");
var PassThrough = require("stream").PassThrough;
var streams = {};

function send(res, status) {
    res.writeHead(status);
    res.end();
}

var server = http.createServer(function (req, res) {
    if (req.url == "/") {
        if (req.method == "POST") {
            var data = "";
            req.on("data", function(chunk) {
                data += chunk.toString();
            });
            req.on("end", function () {
                var key = data.split("=")[1];
                if (!key) return send(res, 500);

                streams[key] = new PassThrough();

                send(res, 200);
            });
        } else {
            res.writeHead(200);
            return fs.createReadStream(__dirname + "/public/index.html").pipe(res);
        }
    }

    if (req.url == "/application.js") {
        res.writeHead(200);
        return fs.createReadStream(__dirname + "/public/application.js").pipe(res);
    }

    res.writeHead(404);
});
server.listen(parseInt(process.argv[2], 10) || 3000);

var sock = shoe(function (stream) {
});

sock.install(server, "/socket");
