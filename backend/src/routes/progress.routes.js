const express = require('express');
const {
  toggleModuleComplete,
  getMyProgress,
  getProblemStatuses,
  getCompletedModules,
  getSubjectProgress,
} = require('../controllers/progress.controller');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.post('/modules/:moduleId/complete', toggleModuleComplete);
router.get('/modules', getCompletedModules);
router.get('/me', getMyProgress);
router.get('/problems', getProblemStatuses);
router.get('/subjects', getSubjectProgress);

module.exports = router;
