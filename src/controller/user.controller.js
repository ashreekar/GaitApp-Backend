import { User } from "../models/User.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { APIerror } from "../utils/APIerror.js";
import { APIresponse } from "../utils/APIresponse.js";
import jwt from "jsonwebtoken";

// 🔐 Generate JWT token
const generateAccessToken = (user) => {
    return jwt.sign(
        {
            _id: user._id,
            email: user.email,
            fullName: user.fullName
        },
        process.env.ACCESS_TOCKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOCKEN_EXPIRY || "7d"
        }
    );
};

// 🧾 REGISTER USER
const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
        throw new APIerror(400, "All fields are required");
    }

    // check if user exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new APIerror(409, "User already exists");
    }

    // create user (password will be hashed in model pre-save hook)
    const user = await User.create({
        fullName,
        email,
        password
    });

    const token = generateAccessToken(user);

    const createdUser = await User.findById(user._id).select("-password");

    const options = {
        httpOnly: true,
        secure: false // set true in production (HTTPS)
    };

    return res
        .status(201)
        .cookie("accessToken", token, options)
        .json(
            new APIresponse(201, {
                user: createdUser,
                accessToken: token
            }, "User registered successfully")
        );
});

// 🔑 LOGIN USER
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new APIerror(400, "Email and password required");
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new APIerror(404, "User not found");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new APIerror(401, "Invalid credentials");
    }

    const token = generateAccessToken(user);

    const loggedUser = await User.findById(user._id).select("-password");

    const options = {
        httpOnly: true,
        secure: false
    };

    return res
        .status(200)
        .cookie("accessToken", token, options)
        .json(
            new APIresponse(200, {
                user: loggedUser,
                accessToken: token
            }, "Login successful")
        );
});

// 🚪 LOGOUT USER
const logoutUser = asyncHandler(async (req, res) => {
    const options = {
        httpOnly: true,
        secure: false
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .json(new APIresponse(200, {}, "Logged out successfully"));
});

export {
    registerUser,
    loginUser,
    logoutUser
};