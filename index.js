"use strict";

var http = require("http");
var web = require("./web/app.js");
var streams = require("./streams");

var server = http.createServer(web);
server.listen(parseInt(process.argv[2], 10) || parseInt(process.env.PORT, 10) || 3000);

streams(server);

