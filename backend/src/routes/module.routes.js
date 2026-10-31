const express = require('express');
const { getModule } = require('../controllers/module.controller');

const router = express.Router();

router.get('/:id', getModule);

module.exports = router;
