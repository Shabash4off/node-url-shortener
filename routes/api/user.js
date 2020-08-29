const mongoose = require('mongoose');
const passport = require('passport');
const express = require('express');

const auth = require('../../middlewares/auth');

const User = mongoose.model('User');

const router = express.Router();

// GET current user
router.get('/api/user', auth.required, (req, res, next) => {
  const { id } = req.payload;
  User.findById(id)
    .then((user) => {
      if (!user) return res.sendStatus(401);

      return res.json({ user: user.toAuthJSON() });
    })
    .catch(next);
});

// LOGIN user
router.post('/api/user/login', (req, res, next) => {
  const { username, password } = req.body.user;
  if (!username) return res.status(422).json({ message: 'username can\'t be blank' });
  if (!password) return res.status(422).json({ message: 'password can\'t be blank' });

  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);

    if (user) return res.json({ user: user.toAuthJSON() });

    return res.status(422).json(info);
  })(req, res, next);
});

// CTEATE new user
router.post('/api/user/register', (req, res, next) => {
  const { username, password } = req.body.user;
  if (!username) return res.status(422).json({ message: 'username can\'t be blank' });
  if (!password) return res.status(422).json({ message: 'password can\'t be blank' });

  const user = new User({ username, hash: User.generateHash(password) });

  user.save()
    .then(() => res.json({ user: user.toAuthJSON() }))
    .catch(next);
});

module.exports = router;
