const express = require('express');
const { getMyRecommendations } = require('../controllers/recommendation.controller');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.get('/me', getMyRecommendations);

module.exports = router;
