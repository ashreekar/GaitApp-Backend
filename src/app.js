import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// Routes
import userRouter from './routes/user.route.js'
import sessionRoutes from './routes/session.route.js';

//  global error handler
import { errorHandler } from './middleware/error.middleware.js'

const app = express();

// allowing cors of 5173 and 3317
app.use(cors(
    {
        origin: [
            "http://localhost:5173",
            "http://localhost:3317",
            "http://localhost:5173",
            "http://192.168.1.28:5173",
            "capacitor://localhost",
            "http://localhost"
        ],
        credentials: true
    }
));

// express json and urlencoded middleware to parse request bodies
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

// serving a static server from public
app.use(express.static('public'));
app.use(cookieParser());

// Server health moniter route
app.get("/", (req, res) => {
    res.status(200).json({
        status: "ok",
        message: "Server is healthy",
        uptime: process.uptime(),
        timestamp: Date.now()
    });
});

// registering all routes
app.use('/api/v1/user', userRouter);
app.use("/api/v1/session", sessionRoutes);

// registering global error handling middleware
app.use(errorHandler);

export { app };