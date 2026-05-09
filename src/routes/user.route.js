import { Router } from "express";

import {
    registerUser,
    loginUser
} from "../controller/user.controller.js";

const router = Router();

// 🧾 Create account
router.route("/register").post(registerUser);

// 🔑 Login
router.route("/login").post(loginUser);

export default router;