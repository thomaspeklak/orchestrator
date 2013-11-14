"use strict";
var d = require("../db");

if (process.argv.length < 4) {
    console.log("Usage: \
      node createUser.js USERNAME PASSWORD ADMIN\
\
      if admin is set the user is an admin, otherwise leave blank\
    ");

    process.end();
}

var data = {};
if (process.argv[4]) {
    data.admin = 1;
}

d.users.addUser(process.argv[2], process.argv[3], data, function (err) {
    if (err) return console.error(err);

    d.users.findUser(process.argv[2], function (err, user) {
        if (err) return console.error(err);

        console.dir(user);
    });
});
