const express = require('express');
const router = express.Router();

router.use('/user', require('./user'));
router.use('/address', require('./address'));

router.get('/', (req, res) => {
    res.send('Welcome to new API');
});

module.exports = router;