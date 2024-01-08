const express = require('express');
const router = express.Router();

const auth = require('../../middleware/auth');

const userController = require('../../controller/user')

router.get('/', auth, userController.getUsersAuth); // Gets all users public  data if user's signed in

router.get('/admin', auth, userController.getUsersAdmin); // Gets all users private data only if admin [api/users/admin]

router.get('/whoami', auth, userController.getUserData); // Get's loggedin users data [api/users/whoami]

router.post('/register', userController.addUser); // Register user [api/users/register]

router.post('/login', userController.login); // Logs in and returns access token and users ID [api/users/login]

router.put('/update', auth, userController.updateUser); // Updates users data if user's signed in [api/users/update]
router.delete('/delete', auth, userController.removeUser) // Deletes user thats signed in

module.exports = router;