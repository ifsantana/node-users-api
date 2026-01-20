const rateLimiter = require("express-rate-limit");

var usersLimiter = rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: 'Too Many Requests! Try again later!'
});

exports.usersLimiter = usersLimiter;