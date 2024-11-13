const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/userModel"); // Corrected variable name to 'User'
require("dotenv").config();
const {
    generateJwtToken,
    validateJwtToken
} = require("../middleware/jwtmiddleware");

const registerUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, age, gender, bloodGroup, email, phoneNumber, password } = req.body;

    // Validate all required fields
    if (!firstName || !lastName || !age || !gender || !bloodGroup || !email || !phoneNumber || !password) {
        res.status(400);
        throw new Error("Please fill all fields");
    }

    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = await User.create({
        firstName,
        lastName,
        age,
        gender,
        bloodGroup,
        email,
        phoneNumber,
        password: hashedPassword,
    });

    // Generate JWT token after registration
    const token = generateJwtToken(newUser._id);

    res.status(201).json({
        message: "User registered successfully",
        token,
        user: {
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
        },
    });
});

// Login User
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Check if the email and password are provided
    if (!email || !password) {
        res.status(400);
        throw new Error("Please provide both email and password");
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
        res.status(400);
        throw new Error("Invalid credentials");
    }

    // Compare entered password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        res.status(400);
        throw new Error("Invalid credentials");
    }

    // Generate JWT token after login
    const token = generateJwtToken(user._id);

    res.status(200).json({
        message: "Login successful",
        token,
        user: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        },
    });
});

// Get User Profile
const getUserProfile = asyncHandler(async (req, res) => {
    const userId = req.user.id;  // Use req.user.id from the JWT middleware
    const user = await User.findById(userId);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    res.json({
        user
    });
});

const updateUserProfile = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, phoneNumber, password } = req.body;
    const userId = req.user.id;  // Use req.user.id from the JWT middleware

    const user = await User.findById(userId);
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    // Update user details if provided
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (password) {
        // Hash the new password before saving
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    res.status(200).json({
        message: "User profile updated successfully",
        user
    });
});

module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile };
