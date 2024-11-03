// routes/authRoutes.js
const express = require('express');
const { register, login, forgotPassword, resetPassword, changePassword, deleteUser } = require('../controller/authController');
const { authenticate } = require('../middleware/authRoutes');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);
router.post('/resetPassword/:token', resetPassword);
router.post('/changePassword', authenticate, changePassword);
router.delete('/deleteUser', authenticate, deleteUser);

module.exports = router;
