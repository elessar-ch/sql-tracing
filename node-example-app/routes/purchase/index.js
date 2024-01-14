const express = require('express');
const router = express.Router();

const purchaseController = require('../../controller/purchase/');

router.get('/', purchaseController.getUserPurchases); // Gets all of the logged in user's purchases

router.get('/:id', purchaseController.getPurchase); // Get's a specific purchase by id

router.get('/:id/items', purchaseController.getPurchasedItems); // Get's the items for a specific purchase by the purchase id

module.exports = router;