const mongoose = require('mongoose');

const moduleProgressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    module: { type: String, ref: 'Module', required: true },
    departmentId: { type: String, required: true }, // denormalized for fast department-progress aggregation
    completed: { type: Boolean, default: true },
    completedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

moduleProgressSchema.index({ user: 1, module: 1 }, { unique: true });

module.exports = mongoose.model('ModuleProgress', moduleProgressSchema);
