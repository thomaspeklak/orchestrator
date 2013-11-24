"use strict";
module.exports = function requireUser(req, res, next) {
    if (!req.user) {
        return res.send(401);
    }

    next();
}
