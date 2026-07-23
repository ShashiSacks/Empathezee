const express = require("express");
const router = express.Router();
const validate = require('../middleware/validate');
const {
    registerSchema,
    loginSchema,
    verifyEmailSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    subscribeSchema
} = require('../validations/authValidation');

const {
    register,
    verifyEmail,
    login,
    refreshToken,
    logout,
    forgotPassword,
    resetPassword,
    subscribeNewsletter
} = require("../controllers/authController");

router.post("/register", validate(registerSchema), register);
router.post("/doctor/register", validate(registerSchema), register);
router.post("/verify-email", validate(verifyEmailSchema), verifyEmail);
router.post("/login", validate(loginSchema), login);
router.post("/doctor/login", validate(loginSchema), login);
router.post("/refresh-token", refreshToken); // No complex body to validate
router.post("/logout", logout);
router.get("/logout", logout);

router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.put("/reset-password/:token", validate(resetPasswordSchema), resetPassword);
router.post("/subscribe", validate(subscribeSchema), subscribeNewsletter);

module.exports = router;
