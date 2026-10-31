const express = require('express');
const { run } = require('../controllers/compiler.controller');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.post('/run', run);

module.exports = router;
