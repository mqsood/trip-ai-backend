const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController.js');

// route for user registration
router.post('/register', registerUser);

// route for user login
router.post('/login', loginUser);

module.exports = router;