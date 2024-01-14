const express = require('express');
const router = express.Router();

const cartController = require('../../controller/cart/');

router.get('/', cartController.getUserCart); // Gets all of the products & quantities in the user's cart

router.post('/', cartController.addToCart); // Adds a product to the user's cart

router.delete('/:id', cartController.removeFromCart); // Removes a product from the user's cart

router.post('/order', cartController.order); // Orders all of the products in the user's cart

module.exports = router;