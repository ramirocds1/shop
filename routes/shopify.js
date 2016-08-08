var express = require('express');
var router = express.Router();
var shopifyCtrl = require('../controllers/shopifyController');

router.post('/orderPlaced', shopifyCtrl.orderPlaced)

module.exports = router;