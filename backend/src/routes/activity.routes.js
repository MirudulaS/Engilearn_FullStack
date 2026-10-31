const express = require('express');
const { getMyActivity } = require('../controllers/activity.controller');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.get('/me', getMyActivity);

module.exports = router;
