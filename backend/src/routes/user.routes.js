const express = require('express');
const { updateMe } = require('../controllers/user.controller');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.patch('/me', updateMe);

module.exports = router;
