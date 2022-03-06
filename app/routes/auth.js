const authController = require('../controllers/authcontroller');

const router = require('express').Router();


router.post('/register', authController.registerUser)
router.post('/login', authController.loginUser)
router.post('/refresh', authController.refreshTokenReq)

module.exports = router