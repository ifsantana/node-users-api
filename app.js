var express = require('express');
var rateLimiter = require('express-rate-limit');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var usersRouter = require('./controllers/users');
const sequelize = require("./config/sequelize");

var globalLimiter = rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 2,
    message: 'Too Many Requests! Try again later!'
});

var app = express();

sequelize.sync().then(() => {
    console.log("Sequelize connection successfull");
});

app.use(logger('dev'));
// app.use(globalLimiter);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', usersRouter);

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: err.message });
});

// app.listen(3000, () => console.log('Server running on port 3000'));

module.exports = app;
