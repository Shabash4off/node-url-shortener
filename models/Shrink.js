const mongoose = require('mongoose');

const { nanoid } = require('nanoid');

// Shrink - short-link
const ShrinkSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    default: nanoid(8),
    unique: true,
  },
  title: {
    type: String,
    default: 'Untitled',
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

ShrinkSchema.methods.toJSON = function toJSON() {
  return {
    url: this.url,
    slug: this.slug,
    title: this.title,
    owner: this.owner.toProfileJSON(),
  };
};

mongoose.model('Shrink', ShrinkSchema);
