const {Router} = require('express')
const authController = require('../controllers/authController')

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.put("/forgotPassword", authController.forgotPassword);

module.exports = router;