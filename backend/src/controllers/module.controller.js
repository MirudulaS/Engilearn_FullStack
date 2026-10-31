const Module = require('../models/Module');
const Department = require('../models/Department');
const { ApiError } = require('../middleware/errorHandler');

// GET /api/departments/:departmentId/categories/:categoryId/modules
async function listModulesByCategory(req, res, next) {
  try {
    const { departmentId, categoryId } = req.params;

    const department = await Department.findById(departmentId);
    if (!department) {
      throw new ApiError(404, `No department found with id "${departmentId}".`);
    }
    const category = department.categories.find((c) => c.id === categoryId);
    if (!category) {
      throw new ApiError(404, `No category "${categoryId}" in department "${departmentId}".`);
    }

    const modules = await Module.find({ departmentId, categoryId }).sort({ order: 1 });
    res.json({ success: true, category, modules });
  } catch (err) {
    next(err);
  }
}

// GET /api/modules/:id
async function getModule(req, res, next) {
  try {
    const module = await Module.findById(req.params.id);
    if (!module) {
      throw new ApiError(404, `No module found with id "${req.params.id}".`);
    }
    res.json({ success: true, module });
  } catch (err) {
    next(err);
  }
}

module.exports = { listModulesByCategory, getModule };
