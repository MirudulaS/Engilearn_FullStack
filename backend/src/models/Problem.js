const mongoose = require('mongoose');

const exampleSchema = new mongoose.Schema(
  {
    input: { type: String, required: true },
    output: { type: String, required: true },
    explanation: { type: String, default: '' },
  },
  { _id: false }
);

const problemSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // slug, e.g. "reverse-a-string"
  title: { type: String, required: true },
  departmentId: { type: String, required: true, ref: 'Department' },
  categoryId: { type: String, required: true },
  moduleId: { type: String, default: null, ref: 'Module' },
  subject: { type: String, required: true },
  topic: { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
  description: { type: String, required: true },
  statement: { type: String, required: true },
  inputFormat: { type: String, default: '' },
  outputFormat: { type: String, default: '' },
  constraints: [{ type: String }],
  examples: [exampleSchema],
  hints: [{ type: String }],
  // e.g. { javascript: "function reverseString(s) {...}" }
  starterCode: { type: Map, of: String, default: {} },
  relatedProblemIds: [{ type: String, ref: 'Problem' }],
});

problemSchema.index({ departmentId: 1, categoryId: 1 });
problemSchema.index({ moduleId: 1 });
problemSchema.index({ title: 'text', topic: 'text' });

problemSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    // Map -> plain object so it serializes the way the frontend expects
    if (ret.starterCode instanceof Map) {
      ret.starterCode = Object.fromEntries(ret.starterCode);
    }
  },
});

module.exports = mongoose.model('Problem', problemSchema);
