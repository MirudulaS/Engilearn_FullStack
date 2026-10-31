const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: 80,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Enter a valid email address'],
    },
    passwordHash: {
      type: String,
      required: true,
      select: false, // never returned by default queries
    },
    department: {
      type: String,
      enum: ['it', 'ece', 'eee'],
      required: [true, 'Department is required'],
    },
    bio: { type: String, default: '', maxlength: 500 },
    skills: [{ type: String, trim: true }],
    streakDays: { type: Number, default: 0 },
    lastActiveAt: { type: Date, default: null },
  },
  { timestamps: true }
);

userSchema.methods.matchPassword = function matchPassword(candidate) {
  return bcrypt.compare(candidate, this.passwordHash);
};

userSchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    department: this.department,
    bio: this.bio,
    skills: this.skills,
    streakDays: this.streakDays,
    joinedAt: this.createdAt,
  };
};

module.exports = mongoose.model('User', userSchema);
