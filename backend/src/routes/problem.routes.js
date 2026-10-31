const express = require('express');
const { listProblems, getProblem } = require('../controllers/problem.controller');

const router = express.Router();

router.get('/', listProblems);
router.get('/:id', getProblem);

module.exports = router;
