const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const errorHandler = require('./src/middlewares/erroHandler');

const indexRouter = require('./src/routes/index');
const usersRouter = require('./src/routes/users');

const app = express();

app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use(errorHandler);

module.exports = app;
