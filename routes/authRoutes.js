const express = require("express");
const router = express.Router();

const {
    register,
    login,
    registerDoctor,
    loginDoctor,
    logout
} = require("../controllers/authController");

// REGISTER
router.post("/register", register);

// LOGIN
router.post("/login", login);

// DOCTOR REGISTER
router.post("/doctor/register", registerDoctor);

// DOCTOR LOGIN
router.post("/doctor/login", loginDoctor);

// LOGOUT
router.get("/logout", logout);

module.exports = router;
