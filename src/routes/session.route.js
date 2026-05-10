import express from "express";
import {
    startSession,
    endSession,
    addGaitFrames,
    getSessions,
    getSingleSession
} from "../controller/session.controller.js";
import { verifyJwt } from "../middleware/verifyJwt.js"

const router = express.Router();

router.post("/start", verifyJwt, startSession);
router.post("/end", verifyJwt, endSession);
router.post("/frames", verifyJwt, addGaitFrames);

router.get("/", verifyJwt, getSessions);
router.get("/:sessionId", verifyJwt, getSingleSession);

export default router;