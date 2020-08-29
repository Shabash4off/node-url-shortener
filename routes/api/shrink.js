const mongoose = require('mongoose');
const express = require('express');

const auth = require('../../middlewares/auth');

const User = mongoose.model('User');
const Shrink = mongoose.model('Shrink');

const router = express.Router();

router.param('shrink', (req, res, next, slug) => {
  Shrink.findOne({ slug })
    .populate('owner')
    .then((shrink) => {
      if (!shrink) return res.sendStatus(404);

      req.shrink = shrink;
      next();
    })
    .catch(next);
});

// GET user shrinks
router.get('/api/shrinks', auth.required, (req, res, next) => {
  const { payload: { id }, query: { limit = 100, offset = 0 } } = req;

  Shrink.find({ owner: id })
    .limit(limit)
    .skip(offset)
    .populate('owner')
    .then((shrinks) => {
      if (!shrinks) return res.sendStatus(404);

      res.json({ shrinks: shrinks.map((shrink) => shrink.toJSON()) });
    })
    .catch(next);
});

// GET shrink by slug
router.get('/api/shrinks/:shrink', (req, res) => {
  const { shrink } = req;

  res.json({ shrink: shrink.toJSON() });
});

// CREATE new shrink for current user
router.post('/api/shrinks', auth.required, (req, res, next) => {
  const { body: { shrink: { url } }, payload: { id } } = req;

  if (!url) return res.status(422).json({ message: 'url can\'t be blank' });

  User.findById(id)
    .then((user) => {
      if (!user) return res.sendStatus(401);

      const shrink = new Shrink({ url, owner: user });

      shrink.save()
        .then(() => res.json({ shrink: shrink.toJSON() }));
    })
    .catch(next);
});

// UPDATE shrink for current user
router.put('/api/shrinks/:shrink', auth.required, (req, res, next) => {
  const { payload: { id, role }, body: { shrink: { title } }, shrink } = req;

  User.findById(id)
    .then((user) => {
      if (!user) return res.sendStatus(401);

      if (shrink.owner._id.toString() !== id.toString() && role !== 'admin') return res.sendStatus(403);

      shrink.title = title || shrink.title;

      shrink.save()
        .then(() => res.json({ shrink: shrink.toJSON() }));
    })
    .catch(next);
});

// DELETE shrink for current user
router.delete('/api/shrinks/:shrink', auth.required, (req, res, next) => {
  const { shrink, payload: { id, role } } = req;

  User.findById(id)
    .then((user) => {
      if (!user) return res.sendStatus(401);

      if (shrink.owner._id.toString() !== id.toString() && role !== 'admin') return res.sendStatus(403);

      Shrink.deleteOne({ _id: shrink._id })
        .then(() => res.sendStatus(204));
    })
    .catch(next);
});

module.exports = router;
