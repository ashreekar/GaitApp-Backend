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
app.use(cors({
  origin: function (origin, callback) {

    // Allow requests with no origin
    // (mobile apps, Postman, Capacitor, etc.)
    if (!origin) {
      return callback(null, true);
    }

    const allowedOrigins = [
      "http://localhost:5173",
      "http://localhost:3317",
      "http://localhost",
      "https://localhost",
      "capacitor://localhost"
    ];

    // Exact matches
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Allow all 192.168.1.x IPs
    const localNetworkRegex = /^http:\/\/192\.168\.1\.\d+:5173$/;

    if (localNetworkRegex.test(origin)) {
      return callback(null, true);
    }

    callback(new Error("Not allowed by CORS"));
  },

  credentials: true
}));

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