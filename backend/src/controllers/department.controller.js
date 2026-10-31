const Department = require('../models/Department');
const { ApiError } = require('../middleware/errorHandler');

// GET /api/departments
async function listDepartments(req, res, next) {
  try {
    const departments = await Department.find().sort({ code: 1 });
    res.json({ success: true, departments });
  } catch (err) {
    next(err);
  }
}

// GET /api/departments/:id
async function getDepartment(req, res, next) {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      throw new ApiError(404, `No department found with id "${req.params.id}".`);
    }
    res.json({ success: true, department });
  } catch (err) {
    next(err);
  }
}

module.exports = { listDepartments, getDepartment };
