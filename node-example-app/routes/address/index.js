const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const addressController = require('../../controller/address');

router.get('/', auth, addressController.getAddressesAuth); // Gets all addresses if user's logged in

router.put('/:id', addressController.updateAddress); // Updates address by id (recommended to add restrictions ex: admin)
router.delete('/:id', addressController.removeAddress); // Deletes address by id (recommended to add restrictions ex: admin)

module.exports = router;