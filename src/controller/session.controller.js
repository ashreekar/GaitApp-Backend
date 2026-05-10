import Session from "../models/Session.model.js";
import GaitFrame from "../models/GaitFrame.model.js";
import mongoose from "mongoose";

export const startSession = async (req, res) => {
    try {
        const userId = req.user?._id;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "userId is required",
            });
        }

        const session = await Session.create({
            userId,
            startTime: Date.now(),
            status: "active",
        });

        return res.status(201).json({
            success: true,
            session,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const endSession = async (req, res) => {
    try {
        const { sessionId } = req.body;

        if (!sessionId) {
            return res.status(400).json({
                success: false,
                message: "sessionId is required",
            });
        }

        const session = await Session.findById(sessionId);

        if (!session) {
            return res.status(404).json({
                success: false,
                message: "Session not found",
            });
        }

        if (session.status === "ended") {
            return res.status(400).json({
                success: false,
                message: "Session already ended",
            });
        }

        session.endTime = Date.now();
        session.status = "ended";

        await session.save();

        return res.json({
            success: true,
            session,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const addGaitFrames = async (req, res) => {
    try {
        const { sessionId, frames } = req.body;

        // Validation
        if (!sessionId || !frames) {
            return res.status(400).json({
                success: false,
                message: "sessionId and frames are required",
            });
        }

        if (!Array.isArray(frames)) {
            return res.status(400).json({
                success: false,
                message: "frames must be an array",
            });
        }

        // Validate session
        const session = await Session.findById(sessionId);

        if (!session) {
            return res.status(404).json({
                success: false,
                message: "Session not found",
            });
        }

        // Prevent inserts to ended session
        if (session.status === "ended") {
            return res.status(400).json({
                success: false,
                message: "Session already ended",
            });
        }

        // Batch insert
        const formattedFrames = frames.map((frame) => ({
            sessionId,
            ...frame,
        }));

        await GaitFrame.insertMany(formattedFrames);

        return res.status(201).json({
            success: true,
            inserted: formattedFrames.length,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getSessions = async (req, res) => {
    try {

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const includeFrames =
            req.query.includeFrames === "true";

        const skip = (page - 1) * limit;

        const pipeline = [
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(req.user._id),
                },
            },

            {
                $sort: {
                    createdAt: -1,
                },
            },

            {
                $skip: skip,
            },

            {
                $limit: limit,
            },
        ];

        // OPTIONAL FRAME LOOKUP
        if (includeFrames) {

            pipeline.push({
                $lookup: {
                    from: "gaitframes",
                    localField: "_id",
                    foreignField: "sessionId",
                    as: "frames",
                },
            });

            // optional preview only
            pipeline.push({
                $addFields: {
                    frameCount: {
                        $size: "$frames",
                    },

                    latestFrame: {
                        $arrayElemAt: ["$frames", -1],
                    },

                    previewFrames: {
                        $slice: ["$frames", -5],
                    },
                },
            });

            // remove full frames array
            pipeline.push({
                $project: {
                    frames: 0,
                },
            });
        }

        const sessions =
            await Session.aggregate(pipeline);

        const totalSessions =
            await Session.countDocuments({
                userId: req.user._id,
            });

        return res.status(200).json({
            success: true,

            pagination: {
                total: totalSessions,
                page,
                limit,
                totalPages: Math.ceil(
                    totalSessions / limit
                ),
            },

            sessions,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

export const getSingleSession = async (
    req,
    res
) => {
    try {

        const { sessionId } = req.params;

        const session =
            await Session.aggregate([
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(sessionId),
                        userId: new mongoose.Types.ObjectId(req.user._id),
                    },
                },

                {
                    $lookup: {
                        from: "gaitframes",
                        localField: "_id",
                        foreignField: "sessionId",
                        as: "frames",
                    },
                },

                {
                    $addFields: {
                        frameCount: {
                            $size: "$frames",
                        },
                    },
                },
            ]);

        if (!session.length) {
            return res.status(404).json({
                success: false,
                message: "Session not found",
            });
        }

        return res.status(200).json({
            success: true,
            session: session[0],
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};