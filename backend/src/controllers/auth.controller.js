const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { ApiError } = require('../middleware/errorHandler');
const { generateToken } = require('../utils/token');

const SALT_ROUNDS = 10;

// POST /api/auth/register
async function register(req, res, next) {
  try {
    const { name, email, password, department } = req.body;

    if (!name || !email || !password || !department) {
      throw new ApiError(400, 'name, email, password, and department are all required.');
    }
    if (password.length < 8) {
      throw new ApiError(400, 'Password must be at least 8 characters.');
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      throw new ApiError(409, 'An account with that email already exists.');
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({ name, email, passwordHash, department });

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: user.toPublicJSON(),
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/login
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ApiError(400, 'email and password are required.');
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');
    if (!user || !(await user.matchPassword(password))) {
      // Same message for "no such user" and "wrong password" so we don't
      // reveal which emails are registered.
      throw new ApiError(401, 'Invalid email or password.');
    }

    res.json({
      success: true,
      token: generateToken(user._id),
      user: user.toPublicJSON(),
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/auth/me  (requires the `protect` middleware)
async function getMe(req, res) {
  res.json({ success: true, user: req.user.toPublicJSON() });
}

module.exports = { register, login, getMe };
