const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    id: { type: String, required: true }, // slug, e.g. "web-development"
    name: { type: String, required: true },
    description: { type: String, default: '' },
    // moduleCount / problemCount are denormalized for fast list rendering.
    // They're kept in sync by the Module/Problem controllers when content
    // changes, rather than computed on every request.
    moduleCount: { type: Number, default: 0 },
    problemCount: { type: Number, default: 0 },
  },
  { _id: false }
);

const departmentSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // slug, e.g. "it"
  code: { type: String, required: true }, // e.g. "IT"
  name: { type: String, required: true },
  shortName: { type: String, required: true },
  description: { type: String, default: '' },
  accentVar: { type: String, required: true }, // CSS variable name, e.g. "--color-dept-it"
  skillCategories: [{ type: String }],
  categories: [categorySchema],
});

departmentSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

module.exports = mongoose.model('Department', departmentSchema);
