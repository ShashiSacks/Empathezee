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

// register
router.post("/register", register);

// login
router.post("/login", login);

// google oauth sign-in
router.post("/google", googleLogin);

// doctor register
router.post("/doctor/register", registerDoctor);

// doctor login
router.post("/doctor/login", loginDoctor);

// logout
router.get("/logout", logout);

module.exports = router;
