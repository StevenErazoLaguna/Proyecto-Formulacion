const express = require('express');
const router = express.Router();
const dashboardCtrl = require('../controllers/dashboard.controller');
const auth = require('../middleware/auth');

router.get('/stats', auth, dashboardCtrl.getStats);
router.get('/trends', auth, dashboardCtrl.getPayrollTrends);
router.get('/turnover', auth, dashboardCtrl.getTurnover);

module.exports = router;
