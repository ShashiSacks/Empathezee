const express = require("express");
const router = express.Router();
const validate = require('../middleware/validate');
const {
    registerSchema,
    loginSchema,
    verifyEmailSchema,
    forgotPasswordSchema,
    resetPasswordSchema
} = require('../validations/authValidation');

const {
    register,
    verifyEmail,
    login,
    refreshToken,
    logout,
    googleLogin,
    forgotPassword,
    resetPassword
} = require("../controllers/authController");

router.post("/register", validate(registerSchema), register);
router.post("/verify-email", validate(verifyEmailSchema), verifyEmail);
router.post("/login", validate(loginSchema), login);
router.post("/refresh-token", refreshToken); // No complex body to validate
router.post("/logout", logout);
router.post("/google", googleLogin); // Simple tokenId object, no strict complex schema needed
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.put("/reset-password/:token", validate(resetPasswordSchema), resetPassword);

module.exports = router;
