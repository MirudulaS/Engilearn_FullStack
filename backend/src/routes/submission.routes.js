const express = require('express');
const { createSubmission, listMySubmissions } = require('../controllers/submission.controller');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.post('/', createSubmission);
router.get('/me', listMySubmissions);

module.exports = router;
