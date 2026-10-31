const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

const dbStateLabels = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting',
};

router.get('/', (req, res) => {
  res.json({
    success: true,
    status: 'ok',
    uptimeSeconds: Math.round(process.uptime()),
    db: dbStateLabels[mongoose.connection.readyState] ?? 'unknown',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
