const User = require('../models/User');
const { ApiError } = require('../middleware/errorHandler');

const EDITABLE_FIELDS = ['name', 'bio', 'skills'];

// PATCH /api/users/me  (protected)
async function updateMe(req, res, next) {
  try {
    const updates = {};
    for (const field of EDITABLE_FIELDS) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }

    if (Object.keys(updates).length === 0) {
      throw new ApiError(400, `No editable fields provided. Editable fields: ${EDITABLE_FIELDS.join(', ')}.`);
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, user: user.toPublicJSON() });
  } catch (err) {
    next(err);
  }
}

module.exports = { updateMe };
