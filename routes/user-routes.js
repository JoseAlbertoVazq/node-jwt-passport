const express = require('express');
const router = express.Router();
const passport = require('passport');
const userController = require('../controllers/user-controller');

router.get('/all', passport.authenticate('jwt', { session: false }), userController.getUsers);

router.post('/register', userController.register);
router.post('/login', userController.login);
module.exports = router;