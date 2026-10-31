require('dotenv').config();
const mongoose = require('mongoose');
const env = require('../config/env');
const Department = require('../models/Department');
const Module = require('../models/Module');
const Problem = require('../models/Problem');
const { departments, modules } = require('./data');
const { problems } = require('./problemsData');

async function seed() {
  await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 5000 });
  console.log(`[seed] Connected to ${env.mongoUri}`);

  await Department.deleteMany({});
  await Module.deleteMany({});
  await Problem.deleteMany({});
  console.log('[seed] Cleared existing departments, modules, and problems.');

  await Department.insertMany(departments);
  await Module.insertMany(modules);
  await Problem.insertMany(problems);
  console.log(
    `[seed] Inserted ${departments.length} departments, ${modules.length} modules, and ${problems.length} problems.`
  );

  await mongoose.disconnect();
  console.log('[seed] Done.');
}

seed().catch((err) => {
  console.error('[seed] Failed:', err);
  process.exit(1);
});
