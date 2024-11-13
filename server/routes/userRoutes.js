const express = require("express");
const router = express.Router();
const {
    registerUser,
    loginUser,
    updateUserProfile,
    getUserProfile
} = require("../controllers/userController");
const {
    generateJwtToken,
    validateJwtToken
} = require("../middleware/jwtmiddleware");

// Register route
router.post("/register", registerUser);

// Login route
router.post("/login", loginUser);

// Protected route to get user profile
router.get("/myaccount", validateJwtToken, getUserProfile);

// Protected route to update user profile
router.put("/myaccount", validateJwtToken, updateUserProfile);

module.exports = router;
