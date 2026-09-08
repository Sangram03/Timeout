import express from "express";

const leaderboardRoute = express.Router();

import countdownModel from "../model/countdown.js";
import stopwatchModel from "../model/stopwatch.js";
import userModel from "../model/user.js";
import leaderboardModel from "../model/leaderboard.js";

import { localDateKey } from "../utils/localDate.js";
import { syncLeaderboardForUser } from "../utils/leaderboardSync.js";

/*
|--------------------------------------------------------------------------
| Helper: Get date range for leaderboard period
|--------------------------------------------------------------------------
|
| today  -> today only
| weekly -> Monday -> today
| monthly -> 1st day of current month -> today
|
*/
const getDateRange = (period) => {
    const now = new Date();

    const today = localDateKey(now);

    if (period === "weekly") {
        const currentDay = now.getDay(); // Sunday = 0, Monday = 1

        // Convert Sunday to 6, Monday to 0, Tuesday to 1, etc.
        const daysFromMonday = currentDay === 0 ? 6 : currentDay - 1;

        const monday = new Date(now);
        monday.setDate(now.getDate() - daysFromMonday);

        return {
            startDate: localDateKey(monday),
            endDate: today,
        };
    }

    if (period === "monthly") {
        const firstDayOfMonth = new Date(
            now.getFullYear(),
            now.getMonth(),
            1
        );

        return {
            startDate: localDateKey(firstDayOfMonth),
            endDate: today,
        };
    }

    // Default = today
    return {
        startDate: today,
        endDate: today,
    };
};

/*
|--------------------------------------------------------------------------
| Helper: Calculate leaderboard from stopwatch + countdown records
|--------------------------------------------------------------------------
*/
const calculateLeaderboard = async (period) => {
    const { startDate, endDate } = getDateRange(period);

    const dateQuery = {
        date: {
            $gte: startDate,
            $lte: endDate,
        },
    };

    /*
    |--------------------------------------------------------------------------
    | Get stopwatch and countdown time in parallel
    |--------------------------------------------------------------------------
    */
    const [stopwatchTotals, countdownTotals] = await Promise.all([
        stopwatchModel.aggregate([
            {
                $match: dateQuery,
            },
            {
                $group: {
                    _id: "$userId",
                    totalTime: {
                        $sum: "$totalTime",
                    },
                },
            },
        ]),

        countdownModel.aggregate([
            {
                $match: dateQuery,
            },
            {
                $group: {
                    _id: "$userId",
                    totalTime: {
                        $sum: "$totalTime",
                    },
                },
            },
        ]),
    ]);

    /*
    |--------------------------------------------------------------------------
    | Merge stopwatch + countdown time
    |--------------------------------------------------------------------------
    */
    const timeMap = new Map();

    for (const record of stopwatchTotals) {
        const userId = String(record._id);

        timeMap.set(
            userId,
            (timeMap.get(userId) || 0) + (record.totalTime || 0)
        );
    }

    for (const record of countdownTotals) {
        const userId = String(record._id);

        timeMap.set(
            userId,
            (timeMap.get(userId) || 0) + (record.totalTime || 0)
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Remove users with zero time
    |--------------------------------------------------------------------------
    */
    const userIds = [...timeMap.entries()]
        .filter(([, totalTime]) => totalTime > 0)
        .map(([userId]) => userId);

    if (userIds.length === 0) {
        return [];
    }

    /*
    |--------------------------------------------------------------------------
    | Fetch user information + streaks
    |--------------------------------------------------------------------------
    */
    const [users, streakRecords] = await Promise.all([
        userModel
            .find({
                _id: {
                    $in: userIds,
                },
            })
            .select("name picture badges")
            .lean(),

        leaderboardModel
            .find({
                userId: {
                    $in: userIds,
                },
            })
            .select("userId streak")
            .lean(),
    ]);

    /*
    |--------------------------------------------------------------------------
    | Create streak map
    |--------------------------------------------------------------------------
    */
    const streakMap = new Map();

    for (const record of streakRecords) {
        if (record.userId) {
            streakMap.set(
                String(record.userId),
                record.streak || 0
            );
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Create leaderboard
    |--------------------------------------------------------------------------
    */
    const leaderboard = users
        .map((user) => {
            const userId = String(user._id);

            return {
                userId: user._id,
                name: user.name,
                picture: user.picture,
                badges: user.badges || [],
                time: timeMap.get(userId) || 0,
                todayTime: period === "today"
                    ? timeMap.get(userId) || 0
                    : undefined,
                weeklyTime: period === "weekly"
                    ? timeMap.get(userId) || 0
                    : undefined,
                monthlyTime: period === "monthly"
                    ? timeMap.get(userId) || 0
                    : undefined,
                streak: streakMap.get(userId) || 0,
            };
        })
        .sort((a, b) => {
            // Highest focus time first
            if (b.time !== a.time) {
                return b.time - a.time;
            }

            // Higher streak wins ties
            if (b.streak !== a.streak) {
                return b.streak - a.streak;
            }

            // Stable fallback
            return String(a.userId).localeCompare(String(b.userId));
        })
        .slice(0, 100)
        .map((user, index) => ({
            rank: index + 1,
            ...user,
        }));

    return leaderboard;
};

/*
|--------------------------------------------------------------------------
| GET /api/leaderboard?period=today|weekly|monthly
|--------------------------------------------------------------------------
*/
leaderboardRoute.get("/", async (req, res) => {
    try {
        const requestedPeriod = String(
            req.query.period || "today"
        ).toLowerCase();

        /*
        |--------------------------------------------------------------------------
        | Only allow supported periods
        |--------------------------------------------------------------------------
        */
        const allowedPeriods = [
            "today",
            "weekly",
            "monthly",
        ];

        const period = allowedPeriods.includes(requestedPeriod)
            ? requestedPeriod
            : "today";

        /*
        |--------------------------------------------------------------------------
        | Calculate leaderboard
        |--------------------------------------------------------------------------
        */
        const leaderboard = await calculateLeaderboard(period);

        const { startDate, endDate } = getDateRange(period);

        return res.status(200).json({
            success: true,
            period,
            startDate,
            endDate,
            leaderboard,
        });

    } catch (err) {
        console.error(
            "Error calculating leaderboard data:",
            err
        );

        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
});

/*
|--------------------------------------------------------------------------
| GET /api/leaderboard/me
|--------------------------------------------------------------------------
|
| Returns the logged-in user's rank and statistics for the
| currently selected period.
|
| Frontend can call:
|
| /api/leaderboard/me?period=today
| /api/leaderboard/me?period=weekly
| /api/leaderboard/me?period=monthly
|
*/
leaderboardRoute.get("/me", async (req, res) => {
    try {
        /*
        |--------------------------------------------------------------------------
        | Authentication
        |--------------------------------------------------------------------------
        */
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const requestedPeriod = String(
            req.query.period || "today"
        ).toLowerCase();

        const allowedPeriods = [
            "today",
            "weekly",
            "monthly",
        ];

        const period = allowedPeriods.includes(requestedPeriod)
            ? requestedPeriod
            : "today";

        const userId = req.user.id;

        /*
        |--------------------------------------------------------------------------
        | Get date range
        |--------------------------------------------------------------------------
        */
        const { startDate, endDate } = getDateRange(period);

        const dateQuery = {
            userId,
            date: {
                $gte: startDate,
                $lte: endDate,
            },
        };

        /*
        |--------------------------------------------------------------------------
        | Fetch user + focus records + leaderboard information
        |--------------------------------------------------------------------------
        */
        const [
            usersNumber,
            dbUser,
            stopwatchTotal,
            countdownTotal,
            leaderboardUser,
        ] = await Promise.all([
            userModel.countDocuments(),

            userModel
                .findById(userId)
                .select("name picture")
                .lean(),

            stopwatchModel.aggregate([
                {
                    $match: dateQuery,
                },
                {
                    $group: {
                        _id: null,
                        totalTime: {
                            $sum: "$totalTime",
                        },
                    },
                },
            ]),

            countdownModel.aggregate([
                {
                    $match: dateQuery,
                },
                {
                    $group: {
                        _id: null,
                        totalTime: {
                            $sum: "$totalTime",
                        },
                    },
                },
            ]),

            /*
            |--------------------------------------------------------------------------
            | Get current streak
            |--------------------------------------------------------------------------
            */
            leaderboardModel
                .findOne({
                    userId,
                })
                .select("streak")
                .lean(),
        ]);

        /*
        |--------------------------------------------------------------------------
        | User not found
        |--------------------------------------------------------------------------
        */
        if (!dbUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        /*
        |--------------------------------------------------------------------------
        | Calculate selected period time
        |--------------------------------------------------------------------------
        */
        const stopwatchTime =
            stopwatchTotal[0]?.totalTime || 0;

        const countdownTime =
            countdownTotal[0]?.totalTime || 0;

        const totalTime =
            stopwatchTime + countdownTime;

        const streak =
            leaderboardUser?.streak || 0;

        /*
        |--------------------------------------------------------------------------
        | Calculate rank
        |--------------------------------------------------------------------------
        |
        | We calculate all users' totals for the selected period,
        | then find the logged-in user's position.
        |
        */
        const leaderboard = await calculateLeaderboard(period);

        const currentUserIndex = leaderboard.findIndex(
            (user) =>
                String(user.userId) === String(userId)
        );

        /*
        |--------------------------------------------------------------------------
        | Important:
        |
        | If the user has focus time but is outside the top 100,
        | calculate their real rank from all users.
        |--------------------------------------------------------------------------
        */
        let rank = 0;

        if (totalTime > 0) {
            const [allStopwatch, allCountdown] =
                await Promise.all([
                    stopwatchModel.aggregate([
                        {
                            $match: {
                                date: {
                                    $gte: startDate,
                                    $lte: endDate,
                                },
                            },
                        },
                        {
                            $group: {
                                _id: "$userId",
                                totalTime: {
                                    $sum: "$totalTime",
                                },
                            },
                        },
                    ]),

                    countdownModel.aggregate([
                        {
                            $match: {
                                date: {
                                    $gte: startDate,
                                    $lte: endDate,
                                },
                            },
                        },
                        {
                            $group: {
                                _id: "$userId",
                                totalTime: {
                                    $sum: "$totalTime",
                                },
                            },
                        },
                    ]),
                ]);

            /*
            |--------------------------------------------------------------------------
            | Merge all users' times
            |--------------------------------------------------------------------------
            */
            const allTimeMap = new Map();

            for (const record of allStopwatch) {
                const id = String(record._id);

                allTimeMap.set(
                    id,
                    (allTimeMap.get(id) || 0) +
                        (record.totalTime || 0)
                );
            }

            for (const record of allCountdown) {
                const id = String(record._id);

                allTimeMap.set(
                    id,
                    (allTimeMap.get(id) || 0) +
                        (record.totalTime || 0)
                );
            }

            /*
            |--------------------------------------------------------------------------
            | Get streaks for ranking
            |--------------------------------------------------------------------------
            */
            const allUserIds = [
                ...allTimeMap.keys(),
            ];

            const allStreaks =
                await leaderboardModel
                    .find({
                        userId: {
                            $in: allUserIds,
                        },
                    })
                    .select("userId streak")
                    .lean();

            const allStreakMap = new Map();

            for (const record of allStreaks) {
                allStreakMap.set(
                    String(record.userId),
                    record.streak || 0
                );
            }

            /*
            |--------------------------------------------------------------------------
            | Sort all users
            |--------------------------------------------------------------------------
            */
            const sortedUsers = [
                ...allTimeMap.entries(),
            ]
                .map(([id, time]) => ({
                    userId: id,
                    time,
                    streak:
                        allStreakMap.get(id) || 0,
                }))
                .filter(
                    (user) => user.time > 0
                )
                .sort((a, b) => {
                    if (b.time !== a.time) {
                        return b.time - a.time;
                    }

                    if (b.streak !== a.streak) {
                        return b.streak - a.streak;
                    }

                    return a.userId.localeCompare(
                        b.userId
                    );
                });

            rank =
                sortedUsers.findIndex(
                    (user) =>
                        user.userId === String(userId)
                ) + 1;
        }

        /*
        |--------------------------------------------------------------------------
        | User has no focus time
        |--------------------------------------------------------------------------
        */
        if (totalTime <= 0) {
            rank = 0;
        }

        /*
        |--------------------------------------------------------------------------
        | Percentage / percentile
        |--------------------------------------------------------------------------
        */
        let focusedMoreThan = 0;
        let percentile = 0;

        if (rank > 0 && usersNumber > 0) {
            focusedMoreThan = Math.max(
                0,
                Math.round(
                    ((usersNumber - rank) /
                        usersNumber) *
                        100
                )
            );

            percentile = Math.max(
                1,
                100 - focusedMoreThan
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Response
        |--------------------------------------------------------------------------
        */
        return res.status(200).json({
            success: true,

            period,

            startDate,
            endDate,

            usersNumber,

            userId,

            name: dbUser.name,

            picture:
                dbUser.picture ||
                req.user.picture,

            rank,

            focusedMoreThan,

            percentile,

            time: totalTime,

            todayTime:
                period === "today"
                    ? totalTime
                    : 0,

            weeklyTime:
                period === "weekly"
                    ? totalTime
                    : 0,

            monthlyTime:
                period === "monthly"
                    ? totalTime
                    : 0,

            streak,
        });

    } catch (err) {
        console.error(
            "Error fetching user leaderboard status:",
            err
        );

        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
});

export default leaderboardRoute;
