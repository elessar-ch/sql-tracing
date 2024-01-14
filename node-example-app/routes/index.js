const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

router.use('/user', require('./user'));
router.use('/address', require('./address'));
// router.use('/product', require('./product'));
router.use('/cart', auth, require('./cart'));
router.use('/purchase', auth, require('./purchase'));

router.get('/', (req, res) => {
    res.send('Welcome to new API');
});

module.exports = router;