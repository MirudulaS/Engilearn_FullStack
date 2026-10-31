const express = require('express');
const { listDepartments, getDepartment } = require('../controllers/department.controller');
const { listModulesByCategory } = require('../controllers/module.controller');

const router = express.Router();

router.get('/', listDepartments);
router.get('/:id', getDepartment);
router.get('/:departmentId/categories/:categoryId/modules', listModulesByCategory);

module.exports = router;
