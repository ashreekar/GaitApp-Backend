// models/GaitFrame.js
import mongoose from "mongoose";

const gaitFrameSchema = new mongoose.Schema(
    {
        sessionId: { type: mongoose.Schema.Types.ObjectId, ref: "Session" },

        ts: { type: Number, required: true },

        steps: Number,
        cadence: Number,
        activity: String,
        impact: Number,
        pitch: Number,
        roll: Number,
        fsrRaw: Number,

        accel: {
            x: Number,
            y: Number,
            z: Number,
        },
    },
    { timestamps: true }
);

export default mongoose.model("GaitFrame", gaitFrameSchema);