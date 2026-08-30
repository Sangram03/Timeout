import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import userRouter from "./routes/userRouter.js";
import stopwatchRouter from "./routes/stopwatchRouter.js";
import countdownRouter from "./routes/countdownRouter.js";
import streakRouter from "./routes/streakRouter.js";
import leaderboardRouter from "./routes/leaderboardRouter.js";

import {
    authLimiter,
    leaderboardLimiter,
    timerSaveLimiter
} from "./middlewares/rateLimiters.js";

import { ConectDB } from "./db/db.js";
import { isLoggedIn } from "./middlewares/isLoggedIn.js";

const app = express();

// --------------------------------------------------
// __dirname for ES modules
// --------------------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --------------------------------------------------
// CORS
// --------------------------------------------------

app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "http://localhost:5174",
            "http://localhost:5176",
            ""
        ],
        credentials: true
    })
);

// --------------------------------------------------
// Middleware
// --------------------------------------------------

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// --------------------------------------------------
// Database
// --------------------------------------------------

ConectDB();

// --------------------------------------------------
// Port
// --------------------------------------------------

const port = process.env.PORT || 3000;

// --------------------------------------------------
// Basic backend test
// --------------------------------------------------

app.get("/api", (req, res) => {
    res.json({
        success: true,
        message: "API is running"
    });
});

// --------------------------------------------------
// Rate limiters
// --------------------------------------------------

app.use("/api/user/login", authLimiter);
app.use("/api/user/signup", authLimiter);

// --------------------------------------------------
// API Routes
// --------------------------------------------------

app.use("/api/user", userRouter);

app.use(
    "/api/stopwatch",
    isLoggedIn,
    timerSaveLimiter,
    stopwatchRouter
);

app.use(
    "/api/countdown",
    isLoggedIn,
    timerSaveLimiter,
    countdownRouter
);

app.use(
    "/api/streak",
    isLoggedIn,
    streakRouter
);

app.use(
    "/api/leaderboard",
    isLoggedIn,
    leaderboardLimiter,
    leaderboardRouter
);

// --------------------------------------------------
// React Frontend
// --------------------------------------------------

// IMPORTANT:
// Change this path according to your project structure.
//
// Example:
// project/
// ├── backend/
// │   └── server.js
// └── frontend/
//     └── dist/
//

const frontendPath = path.join(__dirname, "../frontend/dist");

app.use(express.static(frontendPath));

// --------------------------------------------------
// React Router fallback
// --------------------------------------------------

// This makes /login, /clock, /streak, etc.
// load index.html instead of returning "Not Found".

app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
});

// --------------------------------------------------
// Start server
// --------------------------------------------------

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});