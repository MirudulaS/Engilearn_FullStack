const express = require('express');
const { listMyAchievements } = require('../controllers/achievement.controller');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.get('/me', listMyAchievements);

module.exports = router;
