const passport = require('passport');
const mongoose = require('mongoose');

const LocalStrategy = require('passport-local').Strategy;

const User = mongoose.model('User');

passport.use(new LocalStrategy({
  usernameField: 'user[username]',
  passwordField: 'user[password]',
}, (username, password, done) => {
  User.findOne({ username })
    .then((user) => {
      if (!user || !user.validPassword(password)) {
        return done(null, false, { message: 'email or password is invalid' });
      }

      return done(null, user);
    })
    .catch(done);
}));
