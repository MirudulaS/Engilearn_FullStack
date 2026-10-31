const mongoose = require('mongoose');

const theorySectionSchema = new mongoose.Schema(
  { heading: { type: String, required: true }, body: { type: String, required: true } },
  { _id: false }
);

const exampleSchema = new mongoose.Schema(
  { title: { type: String, required: true }, code: { type: String, required: true } },
  { _id: false }
);

const moduleSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // slug, e.g. "html-structure"
  departmentId: { type: String, required: true, ref: 'Department' },
  categoryId: { type: String, required: true },
  subject: { type: String, required: true },
  title: { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
  description: { type: String, required: true },
  theory: [theorySectionSchema],
  examples: [exampleSchema],
  // Names an interactive component on the frontend (e.g. "logic-gate"),
  // not stored logic itself — keeps simulation code out of the database.
  simulation: { type: String, default: null },
  order: { type: Number, default: 0 }, // controls prev/next sequencing within a category
});

moduleSchema.index({ departmentId: 1, categoryId: 1, order: 1 });

moduleSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

module.exports = mongoose.model('Module', moduleSchema);
