const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    problem: { type: String, ref: 'Problem', required: true },
    language: { type: String, required: true },
    code: { type: String, required: true },
    verdict: {
      type: String,
      enum: ['Accepted', 'Wrong Answer', 'Compilation Error', 'Runtime Error', 'Time Limit Exceeded'],
      required: true,
    },
    testsPassed: { type: Number, required: true },
    totalTests: { type: Number, required: true },
    executionTimeMs: { type: Number, default: 0 },
    memoryKb: { type: Number, default: 0 },
  },
  { timestamps: true } // createdAt doubles as the submission timestamp
);

submissionSchema.index({ user: 1, problem: 1, createdAt: -1 });

submissionSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

module.exports = mongoose.model('Submission', submissionSchema);
