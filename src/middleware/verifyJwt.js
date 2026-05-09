import jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/asyncHandler.js';
import { APIerror } from '../utils/APIerror.js';
import { User } from '../models/User.model.js';

// veryfying the user using jwt
export const verifyJwt = asyncHandler(async (req, res, next) => {
    try {
        // taking token from either Authorisation header or cookies
        const token = req.headers['authorization']?.replace("Bearer ", "") || req?.cookies['accessToken'];

        if (!token) {
            throw new APIerror(404, "Unauthorised acceas");
        }

        // veryfying token
        const payload = await jwt.verify(token, process.env.ACCESS_TOCKEN_SECRET);

        const user = await User.findById(payload._id);

        // user not found then unauthorised acceas
        if (!user) {
            throw new APIerror(404, "Unauthorised acceas");
        }

        req.user = user;

        next();
    } catch (error) {
        throw new APIerror(400, "Verification failed or user not exits");
    }
})