const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const Doctor = require("../model/doctorDetailsModel"); // Corrected variable name to 'User'
require("dotenv").config();

const registerDoc = asyncHandler(async (req, res) => {
    const { firstName, lastName, speciality, address, email, phoneNumber, password } = req.body;

    // Validate all required fields
    if (!firstName || !lastName || !speciality || !address || !email || !phoneNumber || !password) {
        res.status(400);
        throw new Error("Please fill all fields");
    }

    // Check if the user already exists
    const doctorExists = await User.findOne({ email });
    if (doctorExists) {
        return res.status(400).json({ message: "Doctor already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = await Doctor.create({
        firstName,
        lastName,
        email,
        speciality,
        experince,
        phoneNumber,
        address,
    });

    res.status(201).json({ message: "Doctor registered successfully", docDetails: newUser });
});

module.exports = { registerDoc };