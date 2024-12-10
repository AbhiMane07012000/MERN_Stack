const express = require('express');
const { getCombinedData,getPieChartData,getBarChartData,getStatistics,intializeData,listTransactions } = require('../controller/transactionController');


const router = express.Router();

router.get("/initialize",intializeData);
router.get("/listTransactions",listTransactions)
router.get('/statistics', getStatistics);
router.get('/bar-chart', getBarChartData);
router.get('/pie-chart', getPieChartData);
router.get('/combined-data', getCombinedData);


module.exports = router;