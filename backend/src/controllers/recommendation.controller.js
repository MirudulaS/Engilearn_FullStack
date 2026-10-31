const ModuleProgress = require('../models/ModuleProgress');
const Module = require('../models/Module');

// GET /api/recommendations/me  (protected)
//
// Design decisions made here (documented since neither has one "correct"
// answer):
// - "Continue learning" = the next module (by `order`) in the same
//   department+category as the user's most recently completed module. If
//   they haven't completed anything yet, it falls back to the first
//   incomplete module in their own registered department.
// - "Recommended" = up to 3 incomplete modules, one per category, preferring
//   the user's own department first, then other departments — giving a mix
//   of "keep going where you are" and "here's something else to explore".
async function getMyRecommendations(req, res, next) {
  try {
    const userId = req.user._id;

    const [completedProgress, allModules] = await Promise.all([
      ModuleProgress.find({ user: userId, completed: true }).sort({ completedAt: -1 }),
      Module.find().sort({ departmentId: 1, categoryId: 1, order: 1 }),
    ]);

    const completedIds = new Set(completedProgress.map((p) => p.module));
    const moduleById = new Map(allModules.map((m) => [m._id, m]));

    let continueLearning = null;

    if (completedProgress.length > 0) {
      const lastCompleted = moduleById.get(completedProgress[0].module);
      if (lastCompleted) {
        const next = allModules.find(
          (m) =>
            m.departmentId === lastCompleted.departmentId &&
            m.categoryId === lastCompleted.categoryId &&
            m.order > lastCompleted.order &&
            !completedIds.has(m._id)
        );
        if (next) {
          continueLearning = {
            departmentId: next.departmentId,
            categoryId: next.categoryId,
            moduleId: next._id,
            moduleTitle: next.title,
            progressPercent: 0,
          };
        }
      }
    }

    if (!continueLearning) {
      const fallback = allModules.find((m) => m.departmentId === req.user.department && !completedIds.has(m._id));
      if (fallback) {
        continueLearning = {
          departmentId: fallback.departmentId,
          categoryId: fallback.categoryId,
          moduleId: fallback._id,
          moduleTitle: fallback.title,
          progressPercent: 0,
        };
      }
    }

    const seenCategories = new Set(
      continueLearning ? [`${continueLearning.departmentId}::${continueLearning.categoryId}`] : []
    );
    const recommended = [];
    const priorityOrder = [
      ...allModules.filter((m) => m.departmentId === req.user.department),
      ...allModules.filter((m) => m.departmentId !== req.user.department),
    ];

    for (const m of priorityOrder) {
      if (completedIds.has(m._id)) continue;
      if (continueLearning && m._id === continueLearning.moduleId) continue;
      const key = `${m.departmentId}::${m.categoryId}`;
      if (seenCategories.has(key)) continue;
      seenCategories.add(key);
      recommended.push({
        id: m._id,
        departmentId: m.departmentId,
        categoryId: m.categoryId,
        title: m.title,
        reason: m.departmentId === req.user.department ? 'Next up in your department' : 'Explore another department',
      });
      if (recommended.length >= 3) break;
    }

    res.json({ success: true, continueLearning, recommended });
  } catch (err) {
    next(err);
  }
}

module.exports = { getMyRecommendations };
