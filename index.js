const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

const requireDir = require('require-dir');
const flatten = require('flat');

const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const errorhandler = require('errorhandler');
const morgan = require('morgan');
const helmet = require('helmet');
const createError = require('http-errors');

require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

const app = express();

// configure express app
app.use(cors());
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());
app.use(helmet());
app.use(session({
  secret: process.env.SECRET,
  cookie: { maxAge: 1000 * 60 },
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
if (!isProduction) app.use(errorhandler());

app.use(express.static(path.resolve(__dirname, 'public')));

// mongodb connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
if (!isProduction) mongoose.set('debug', true);

requireDir(path.resolve(__dirname, 'models'));
requireDir(path.resolve(__dirname, 'config'));

// init routes
const routes = requireDir(path.resolve(__dirname, 'routes'), { recurse: true });
app.use(...Object.values(flatten(routes)));

// catch 404 error
app.use((req, res, next) => {
  next(createError(404, 'Not Found'));
});

// error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.status(err.status || 500);

  res.json({
    errors: {
      message: err.message,
      error: isProduction ? {} : err,
    },
  });
});
// start server
const server = app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${server.address().port}`);
});
