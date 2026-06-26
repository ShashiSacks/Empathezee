const express = require("express");
const router = express.Router();

const {
    register,
    login,
    registerDoctor,
    loginDoctor,
    logout,
    googleLogin
} = require("../controllers/authController");

// REGISTER
router.post("/register", register);

// LOGIN
router.post("/login", login);

// GOOGLE OAUTH SIGN-IN
router.post("/google", googleLogin);

// DOCTOR REGISTER
router.post("/doctor/register", registerDoctor);

// DOCTOR LOGIN
router.post("/doctor/login", loginDoctor);

// LOGOUT
router.get("/logout", logout);

module.exports = router;
