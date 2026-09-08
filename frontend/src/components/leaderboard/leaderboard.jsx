
import React, { useEffect, useState } from "react";
import { FaFire } from "react-icons/fa6";
import Sidecard from "./sidecard";
import axios from "axios";

import {
    Zap,
    Target,
    Leaf,
    Crown,
    Trophy,
    ShieldAlert,
    HeartCrack,
    LifeBuoy,
    Ghost,
} from "lucide-react";


/* =========================================================
   SKELETON ROW
========================================================= */

const LeaderboardRowSkeleton = ({ index }) => (
    <div className="bg-white/2 border-b-2 border-white/10 px-4 md:px-10 py-1 w-full min-h-16 items-center grid grid-cols-[80px_1fr_195px_135px_120px]">

        {/* Rank */}
        <div className="size-8 rounded-full bg-neutral-800 animate-pulse" />

        {/* User */}
        <div className="flex items-center gap-2 min-w-0">

            <div className="size-8 rounded-full bg-neutral-800 animate-pulse" />

            <div className="flex flex-col gap-2">

                <div
                    className={`h-3 rounded-sm bg-neutral-800 animate-pulse ${index % 3 === 0
                            ? "w-32"
                            : index % 3 === 1
                                ? "w-44"
                                : "w-28"
                        }`}
                />

                <div className="h-2 w-20 rounded-sm bg-neutral-800/70 animate-pulse" />

            </div>
        </div>

        {/* Time */}
        <div className="h-3 w-24 rounded-sm bg-neutral-800 animate-pulse" />

        {/* Streak */}
        <div className="flex justify-center">
            <div className="h-3 w-14 rounded-sm bg-neutral-800 animate-pulse" />
        </div>

        {/* Badges */}
        <div className="flex justify-center">
            <div className="h-5 w-14 rounded bg-neutral-800/50 animate-pulse" />
        </div>

    </div>
);


/* =========================================================
   BADGE CONFIG
========================================================= */

const BADGES = {
    newbie: {
        name: "Touched the Timer",
        Icon: Zap,
        style: "bg-lime-400 border-lime-400 text-black",
        glow: "shadow-emerald-500/10 hover:shadow-emerald-500/30",
    },

    locked_in: {
        name: "Locked In",
        Icon: Target,
        style: "bg-orange-400 border-orange-400 text-black",
        glow: "shadow-orange-500/10 hover:shadow-orange-500/30",
    },

    unstoppable: {
        name: "Touch Grass Pls",
        Icon: Leaf,
        style: "bg-emerald-400 border-emerald-400 text-black",
        glow: "shadow-blue-500/10 hover:shadow-blue-500/30",
    },

    elite: {
        name: "Has No Life",
        Icon: Crown,
        style: "bg-purple-400 border-purple-400 text-black",
        glow: "shadow-purple-500/10 hover:shadow-purple-500/30",
    },

    day_conqueror: {
        name: "No Grass Toucher",
        Icon: Trophy,
        style: "bg-yellow-400 border-yellow-400 text-black",
        glow: "shadow-yellow-500/10 hover:shadow-yellow-500/30",
    },

    okay_at_home: {
        name: "Everything Okay At Home?",
        Icon: ShieldAlert,
        style: "bg-red-400 border-red-400 text-black",
        glow: "shadow-red-500/10 hover:shadow-red-500/30",
    },

    who_hurt_you: {
        name: "Who Hurt You?",
        Icon: HeartCrack,
        style: "bg-rose-400 border-rose-400 text-black",
        glow: "shadow-rose-500/10 hover:shadow-rose-500/30",
    },

    seek_help: {
        name: "Seek Professional Help",
        Icon: LifeBuoy,
        style: "bg-teal-400 border-teal-400 text-black",
        glow: "shadow-teal-500/10 hover:shadow-teal-500/30",
    },

    sunlight_allergic: {
        name: "Allergic to Sunlight",
        Icon: Ghost,
        style: "bg-amber-400 border-amber-400 text-black",
        glow: "shadow-amber-500/10 hover:shadow-amber-500/30",
    },
};


/* =========================================================
   MAIN COMPONENT
========================================================= */

function Leaderboard() {

    /* ---------------------------------------------------------
       HERO TEXT
    --------------------------------------------------------- */

    const heroTexts = [
        "is grinding like hell… and you're still waiting for her reply.",
        "already locked in for today. Your bed is winning the battle.",
        "is building their future. You're building a 37-tab browser collection.",
        "is cooking something big. You're cooking excuses.",
        "focused for hours today. Meanwhile, your screen time report is nervous.",
        "chose discipline. You chose 'just one more reel'.",
        "is farming focus points while you're farming dopamine.",
        "woke up and decided to dominate. You woke up and checked Instagram.",
        "is carrying the leaderboard on their back. You are carrying backlogs.",
        "is proof that procrastination is optional.",
        "is in beast mode. You're in battery saver mode.",
        "focused more today than most people focus all week.",
        "is chasing dreams. You're chasing the perfect playlist.",
        "is locked in. Your attention span left the chat.",
        "is making history. You're making excuses.",
    ];


    const getHeroText = () => {
        return heroTexts[
            Math.floor(Math.random() * heroTexts.length)
        ];
    };


    /* ---------------------------------------------------------
       STATE
    --------------------------------------------------------- */

    const [leaderboard, setLeaderboard] = useState([]);
    const [me, setMe] = useState(null);

    const [heroText, setHeroText] = useState("");

    const [loading, setLoading] = useState(true);

    const [fetchError, setFetchError] = useState("");

    /*
       today | weekly | monthly
    */
    const [period, setPeriod] = useState("today");


    /* ---------------------------------------------------------
       PERIOD DATA
    --------------------------------------------------------- */

    const periodConfig = {
        today: {
            label: "Today",
            timeLabel: "Today's time",
            emptyMessage: "No focus time has been logged today yet.",
            status: "Today's leaderboard",
        },

        weekly: {
            label: "Weekly",
            timeLabel: "This week's time",
            emptyMessage: "No focus time has been logged this week yet.",
            status: "Weekly leaderboard",
        },

        monthly: {
            label: "Monthly",
            timeLabel: "This month's time",
            emptyMessage: "No focus time has been logged this month yet.",
            status: "Monthly leaderboard",
        },
    };


    /* ---------------------------------------------------------
       FORMAT TIME
    --------------------------------------------------------- */

    const formatTime = (seconds = 0) => {

        const safeSeconds = Math.max(
            0,
            Number(seconds) || 0
        );

        const hours = Math.floor(
            safeSeconds / 3600
        );

        const minutes = Math.floor(
            (safeSeconds % 3600) / 60
        );

        const secs = Math.floor(
            safeSeconds % 60
        );


        if (hours > 0) {
            return `${hours} h ${minutes} m ${secs} s`;
        }


        if (minutes > 0) {
            return `${minutes} m ${secs} s`;
        }


        return `${secs} s`;
    };


    /* ---------------------------------------------------------
       AVATAR COLOR
    --------------------------------------------------------- */

    const getAvatarColor = (name) => {

        if (!name) {
            return "hsla(0, 0%, 50%, 0.25)";
        }


        let hash = 0;


        for (let i = 0; i < name.length; i++) {

            hash =
                name.charCodeAt(i) +
                ((hash << 5) - hash);

        }


        const hue = Math.abs(hash) % 360;


        return `hsla(${hue}, 70%, 60%, 0.25)`;
    };


    /* ---------------------------------------------------------
       RANK STYLE
    --------------------------------------------------------- */

    const getRankStyle = (rank) => {

        if (rank === 1) {

            return {
                className:
                    "border-2 border-yellow-500 bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-transparent font-bold shadow-[0_0_10px_0px] shadow-yellow-400",

                style: {
                    animation:
                        "glow 3s ease-in-out infinite",
                },
            };
        }


        if (rank === 2) {

            return {
                className:
                    "border-2 bg-zinc-400/10 border-zinc-300/40 shadow-[0_0_10px_0px_rgba(212,212,216,0.08)]",

                style: {
                    animation:
                        "silverGlow 3s ease-in-out infinite",
                },
            };
        }


        if (rank === 3) {

            return {
                className:
                    "border-2 bg-orange-500/10 border-orange-400/40 shadow-[0_0_10px_0px_rgba(251,146,60,0.08)]",

                style: {
                    animation:
                        "bronzeGlow 3s ease-in-out infinite",
                },
            };
        }


        return {
            className:
                "bg-white/5 border-white/20 text-white",

            style: {},
        };
    };


    /* ---------------------------------------------------------
       FETCH LEADERBOARD
    --------------------------------------------------------- */

    useEffect(() => {

        let cancelled = false;


        const fetchLeaderboard = async () => {

            try {

                setLoading(true);

                setFetchError("");


                /*
                   IMPORTANT:

                   The backend receives:

                   ?period=today
                   ?period=weekly
                   ?period=monthly
                */

                const [meData, leaderboardData] =
                    await Promise.all([
                        axios.get(
                            "/api/leaderboard/me"
                        ),

                        axios.get(
                            `/api/leaderboard?period=${period}`
                        ),
                    ]);


                if (cancelled) return;


                setMe(meData.data);


                setLeaderboard(
                    leaderboardData?.data?.leaderboard ||
                    []
                );


                setHeroText(
                    getHeroText()
                );


            } catch (err) {

                if (cancelled) return;


                console.log(
                    "Error while leaderboard data fetching:",
                    err
                );


                if (
                    err?.response?.status === 429
                ) {

                    setFetchError(
                        "Too many refreshes. Leaderboard will be available again in about a minute."
                    );

                } else {

                    setFetchError(
                        "Leaderboard could not be loaded right now."
                    );
                }


                setLeaderboard([]);


            } finally {

                if (!cancelled) {
                    setLoading(false);
                }

            }

        };


        fetchLeaderboard();


        // Refresh the currently selected leaderboard every 5 minutes.
        // This applies independently to Today, Weekly, and Monthly.
        const REFRESH_INTERVAL = 5 * 60 * 1000;

        const interval = setInterval(
            fetchLeaderboard,
            REFRESH_INTERVAL
        );


        return () => {

            cancelled = true;

            clearInterval(interval);

        };

    }, [period]);


    /* ---------------------------------------------------------
       HANDLE PERIOD CHANGE
    --------------------------------------------------------- */

    const handlePeriodChange = (newPeriod) => {

        if (newPeriod === period) return;


        setPeriod(newPeriod);

        setHeroText("");

    };


    /* ---------------------------------------------------------
       CURRENT PERIOD INFO
    --------------------------------------------------------- */

    const currentPeriod =
        periodConfig[period] ||
        periodConfig.today;


    /* ---------------------------------------------------------
       CURRENT USER RANK

       If the current user is inside the top 100,
       calculate their visible rank from the selected
       leaderboard.
    --------------------------------------------------------- */

    const currentUserRank =
        leaderboard.findIndex(
            (user) =>
                user.userId === me?.userId
        ) + 1;


    /* =========================================================
       RENDER
    ========================================================= */

    return (

        <div
            className="
                h-screen
                w-screen
                bg-neutral-900
                justify-center
                flex
                px-4
                py-6
                font-poppins
                overflow-y-auto
                sm:px-6
                lg:px-10
            "
            style={{
                scrollbarWidth: "thin",
                scrollbarColor:
                    "gray transparent",
            }}
        >

            <div
                className="
                    mx-auto
                    flex
                    w-full
                    max-w-7xl
                    min-w-0
                    h-full
                    gap-4
                "
            >

                {/* =================================================
                    MAIN CONTENT
                ================================================= */}

                <div
                    className="
                        w-full
                        min-w-0
                        h-full
                        flex
                        gap-3
                        flex-col
                    "
                >

                    {/* =================================================
                        HEADER
                    ================================================= */}

                    <div
                        className="
                            flex
                            w-full
                            min-w-0
                            flex-col
                            gap-2
                            border-b
                            border-white/10
                            pb-5
                        "
                    >

                        <div
                            className="
                                flex
                                flex-col
                                justify-between
                                gap-3
                                sm:flex-row
                                sm:items-end
                            "
                        >

                            <div>

                                <h1
                                    className="
                                        font-poppins
                                        text-2xl
                                        font-semibold
                                        tracking-normal
                                        text-white
                                        sm:text-4xl
                                    "
                                >
                                    Leaderboard
                                </h1>


                                <p
                                    className="
                                        mt-1
                                        text-xs
                                        text-neutral-500
                                    "
                                >
                                    Compete. Focus. Dominate.
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        TODAY / WEEKLY / MONTHLY SECTION
                    ================================================= */}

                    <div
                        className="
                            w-full
                            flex
                            flex-col
                            justify-between
                            gap-3
                            sm:flex-row
                            sm:items-center
                        "
                    >

                        {/* PERIOD TABS */}

                        <div
                            className="
                                border-2
                                border-white/10
                                rounded-lg
                                min-h-11
                                w-full
                                bg-neutral-900
                                flex
                                items-center
                                p-1
                                gap-1
                                sm:w-auto
                            "
                        >

                            {[
                                {
                                    id: "today",
                                    label: "Today",
                                },

                                {
                                    id: "weekly",
                                    label: "Weekly",
                                },

                                {
                                    id: "monthly",
                                    label: "Monthly",
                                },
                            ].map((item) => (

                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() =>
                                        handlePeriodChange(
                                            item.id
                                        )
                                    }
                                    disabled={loading}
                                    className={`
                                        relative
                                        min-w-20
                                        px-4
                                        py-1.5
                                        rounded-md
                                        text-sm
                                        font-poppins
                                        font-semibold
                                        tracking-tight
                                        transition-all
                                        duration-200
                                        active:scale-95
                                        disabled:cursor-wait
                                        ${period ===
                                            item.id
                                            ? `
                                                    bg-white/10
                                                    text-white
                                                    shadow-sm
                                                    border
                                                    border-white/10
                                                `
                                            : `
                                                    text-neutral-500
                                                    hover:text-white
                                                    hover:bg-white/5
                                                    border
                                                    border-transparent
                                                `
                                        }
                                    `}
                                >

                                    {item.label}

                                    {period === item.id && (
                                        <span
                                            className="
                                                absolute
                                                bottom-0.5
                                                left-1/2
                                                -translate-x-1/2
                                                h-0.5
                                                w-5
                                                rounded-full
                                                bg-yellow-400
                                            "
                                        />
                                    )}

                                </button>

                            ))}

                        </div>


                        {/* STATUS */}

                        <div
                            className="
        text-sm
        text-neutral-500
        border-2
        font-poppins
        bg-white/2
        border-white/10
        rounded-sm
        px-3
        tracking-tight
        font-semibold
        py-1.5
        flex
        gap-2
        items-center
        justify-center
        text-center
        sm:text-left
        transition-all
        duration-300
        hover:border-white/20
        hover:bg-white/5
        hover:-translate-y-0.5
    "
                        >
                            <div
                                className={`
            ${fetchError
                                        ? "bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.8)]"
                                        : "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]"
                                    }
            shrink-0
            rounded-full
            size-2
            animate-pulse
            transition-all
            duration-300
        `}
                            />

                            <p className="min-w-0 transition-all duration-300">
                                {fetchError || "Updates every 5 minutes"}
                            </p>
                        </div>
                    </div>


                    {/* =================================================
                        HERO CARD
                    ================================================= */}

                    <div
                        className="
                            rounded-md
                            w-full
                            min-h-50
                            border-2
                            border-white/5
                            pl-5
                            mt-2
                            font-poppins
                            flex
                            overflow-hidden
                            sm:pl-7
                        "
                    >

                        {/* LEFT LINE */}

                        <div
                            className="
                                h-full
                                bg-yellow-300
                                w-0.5
                                -ml-7
                                [mask-image:linear-gradient(to_bottom,transparent,black_30%,black_60%,transparent)]
                            "
                        />


                        <div
                            className="
                                flex
                                min-w-0
                                flex-1
                                flex-col
                                gap-3
                                h-full
                                justify-center
                                py-5
                                pl-5
                                sm:pl-7
                            "
                        >

                            {/* HERO MESSAGE */}

                            <div
                                className="
                                    text-xl
                                    font-semibold
                                    tracking-tight
                                    w-full
                                    max-w-100
                                    rounded-sm
                                    sm:text-2xl
                                "
                            >

                                {loading ? (

                                    <div
                                        className="
                                            h-20
                                            w-full
                                            max-w-100
                                            rounded-sm
                                            bg-neutral-800
                                            animate-pulse
                                        "
                                    />

                                ) : leaderboard.length > 0 ? (

                                    <>
                                        <span
                                            className="
                                                mr-2
                                                text-amber-300
                                            "
                                        >
                                            {leaderboard[0]?.name}
                                        </span>

                                        {heroText}

                                    </>

                                ) : (

                                    <span
                                        className="
                                            text-neutral-400
                                        "
                                    >
                                        {currentPeriod.emptyMessage}
                                    </span>

                                )}

                            </div>


                            {/* TOP 100 */}

                            {loading ? (

                                <div
                                    className="
                                        w-35
                                        h-5
                                        rounded-sm
                                        bg-neutral-800
                                        animate-pulse
                                    "
                                />

                            ) : (

                                <p
                                    className="
                                        text-neutral-500
                                        text-xs
                                        tracking-tight
                                    "
                                >
                                    Showing top 100 users for{" "}
                                    <span className="text-neutral-300">
                                        {currentPeriod.label.toLowerCase()}
                                    </span>
                                    .
                                </p>

                            )}


                            {/* USER STATS */}

                            {loading ? (

                                <div
                                    className="
                                        w-50
                                        h-5
                                        rounded-sm
                                        bg-neutral-800
                                        animate-pulse
                                    "
                                />

                            ) : (

                                <div
                                    className="
                                        flex
                                        flex-col
                                        gap-1
                                        -mt-2.5
                                        sm:flex-row
                                        sm:gap-2
                                    "
                                >

                                    <p
                                        className="
                                            text-neutral-500
                                            text-xs
                                            tracking-tight
                                        "
                                    >
                                        Total users :{" "}
                                        {me?.usersNumber ?? "-"}
                                    </p>


                                    <p
                                        className="
                                            text-neutral-500
                                            text-xs
                                            tracking-tight
                                        "
                                    >

                                        Your rank :{" "}

                                        {currentUserRank > 0
                                            ? `# ${currentUserRank}`
                                            : "Not in top 100"}

                                    </p>

                                </div>

                            )}

                        </div>


                        {/* HERO IMAGE */}

                        <div
                            className="
                                hidden
                                overflow-hidden
                                sm:w-[calc(100%-45%)]
                                rounded-sm
                                h-full
                                md:block
                            "
                        >

                            <img
                                src="/hero.webp"
                                alt="hero ui"
                                className="
                                    rounded-sm
                                    xl:-mt-14
                                "
                                style={{
                                    WebkitMaskImage:
                                        "linear-gradient(to left, rgba(0,0,0,1) 50%, rgba(0,0,0,0))",

                                    maskImage:
                                        "linear-gradient(to left, rgba(0,0,0,1) 50%, rgba(0,0,0,0))",
                                }}
                            />

                        </div>

                    </div>


                    {/* =================================================
                        LEADERBOARD TABLE
                    ================================================= */}

                    <div
                        className="
                            w-full
                            h-full
                            bg-neutral-900
                            min-w-0
                        "
                    >

                        <div
                            className="
                                rounded-md
                                border-2
                                border-white/10
                                w-full
                                h-auto
                                mt-2
                                overflow-hidden
                                md:overflow-visible
                            "
                        >

                            {/* TABLE HEADER */}

                            <div
                                className="
                                    hidden
                                    border-b-2
                                    border-white/10
                                    font-poppins
                                    text-sm
                                    text-neutral-500
                                    bg-white/6
                                    rounded-t-sm
                                    px-4
                                    md:px-10
                                    py-2
                                    items-center
                                    h-10
                                    w-full
                                    md:grid
                                    md:grid-cols-[80px_1fr_140px_135px_120px]
                                "
                            >

                                <p>Rank</p>

                                <p>Name</p>

                                <p>
                                    {currentPeriod.timeLabel}
                                </p>

                                <p className="text-center">
                                    Streak
                                </p>

                                <p className="text-center">
                                    Badges
                                </p>

                            </div>


                            {/* TABLE BODY */}

                            <div
                                className="
                                    w-full
                                    h-auto
                                    flex
                                    flex-col
                                    pb-1
                                    overflow-x-auto
                                    md:overflow-visible
                                "
                            >

                                {/* LOADING */}

                                {loading ? (

                                    <div
                                        className="
                                            min-w-[720px]
                                            md:min-w-0
                                        "
                                    >

                                        {Array.from({
                                            length: 8,
                                        }).map((_, i) => (

                                            <LeaderboardRowSkeleton
                                                key={i}
                                                index={i}
                                            />

                                        ))}

                                    </div>

                                ) : leaderboard.length === 0 ? (

                                    /* EMPTY */

                                    <div
                                        className="
                                            px-10
                                            w-full
                                            h-32
                                            font-poppins
                                            text-neutral-500
                                            text-sm
                                            flex
                                            items-center
                                            justify-center
                                            text-center
                                        "
                                    >

                                        <p>
                                            {fetchError ||
                                                currentPeriod.emptyMessage}
                                        </p>

                                    </div>

                                ) : (

                                    /* DATA */

                                    <div
                                        className="
                                            min-w-[720px]
                                            md:min-w-0
                                        "
                                    >

                                        {leaderboard.map(
                                            (user, i) => {

                                                const rank =
                                                    i + 1;

                                                const rankStyle =
                                                    getRankStyle(
                                                        rank
                                                    );

                                                const isMe =
                                                    user.userId ===
                                                    me?.userId;


                                                const userBadges =
                                                    user.badges ||
                                                    [];


                                                return (

                                                    <div
                                                        key={
                                                            user._id ||
                                                            user.userId ||
                                                            i
                                                        }
                                                        className={`
                                                            bg-white/2
                                                            border-b-2
                                                            border-white/10
                                                            px-4
                                                            md:px-10
                                                            py-1
                                                            w-full
                                                            min-h-16
                                                            items-center
                                                            grid
                                                            grid-cols-[80px_1fr_125px_135px_120px]
                                                            relative
                                                            transition-all
                                                            duration-150
                                                            hover:bg-neutral-800/20
                                                            hover:z-30

                                                            ${isMe
                                                                ? "bg-white/5"
                                                                : ""
                                                            }
                                                        `}
                                                    >

                                                        {/* =================================================
                                                            RANK
                                                        ================================================= */}

                                                        <div
                                                            className={`
                                                                rounded-full
                                                                text-xs
                                                                size-8
                                                                flex
                                                                items-center
                                                                justify-center
                                                                font-bold
                                                                ${rankStyle.className}
                                                            `}
                                                            style={
                                                                rankStyle.style
                                                            }
                                                        >

                                                            <span>
                                                                {rank}
                                                            </span>

                                                        </div>


                                                        {/* =================================================
                                                            USER
                                                        ================================================= */}

                                                        <div
                                                            className="
                                                                flex
                                                                items-center
                                                                gap-2
                                                                min-w-0
                                                            "
                                                        >

                                                            {user?.picture ? (

                                                                <img
                                                                    src={
                                                                        user.picture
                                                                    }
                                                                    alt={
                                                                        user.name ||
                                                                        "User"
                                                                    }
                                                                    className="
                                                                        rounded-full
                                                                        size-8
                                                                        object-cover
                                                                        border
                                                                        border-white/10
                                                                    "
                                                                    referrerPolicy="no-referrer"
                                                                />

                                                            ) : (

                                                                <div
                                                                    className="
                                                                        rounded-full
                                                                        size-8
                                                                        flex
                                                                        items-center
                                                                        justify-center
                                                                        text-xl
                                                                        shrink-0
                                                                    "
                                                                    style={{
                                                                        backgroundColor:
                                                                            getAvatarColor(
                                                                                user?.name
                                                                            ),
                                                                    }}
                                                                >

                                                                    <p>
                                                                        {user?.name
                                                                            ? user.name[0].toUpperCase()
                                                                            : "?"}
                                                                    </p>

                                                                </div>

                                                            )}


                                                            <div
                                                                className="
                                                                    flex
                                                                    flex-col
                                                                    min-w-0
                                                                "
                                                            >

                                                                <div
                                                                    className="
                                                                        flex
                                                                        items-center
                                                                        gap-2
                                                                        min-w-0
                                                                    "
                                                                >

                                                                    <p
                                                                        className="
                                                                            truncate
                                                                        "
                                                                    >
                                                                        {user?.name ||
                                                                            "Anonymous"}
                                                                    </p>


                                                                    {isMe && (

                                                                        <span
                                                                            className="
                                                                                text-[10px]
                                                                                px-2
                                                                                py-0.5
                                                                                rounded-full
                                                                                bg-yellow-500/15
                                                                                text-yellow-300
                                                                                border
                                                                                border-yellow-500/20
                                                                                font-semibold
                                                                            "
                                                                        >
                                                                            YOU
                                                                        </span>

                                                                    )}

                                                                </div>

                                                            </div>

                                                        </div>


                                                        {/* =================================================
                                                            TIME
                                                        ================================================= */}

                                                        <div>

                                                            <p>
                                                                {formatTime(
                                                                    user?.todayTime ??
                                                                    user?.totalTime ??
                                                                    user?.time ??
                                                                    0
                                                                )}
                                                            </p>

                                                        </div>


                                                        {/* =================================================
                                                            STREAK
                                                        ================================================= */}

                                                        <div
                                                            className="
                                                                flex
                                                                items-center
                                                                gap-1
                                                                justify-center
                                                            "
                                                        >

                                                            <FaFire
                                                                className="
                                                                    text-amber-600
                                                                "
                                                            />

                                                            <span>
                                                                {user?.streak ??
                                                                    0}
                                                            </span>

                                                        </div>


                                                        {/* =================================================
                                                            BADGES
                                                        ================================================= */}

                                                        <div
                                                            className="
                                                                flex
                                                                justify-center
                                                                items-center
                                                            "
                                                        >

                                                            {userBadges.length ===
                                                                0 ? (

                                                                <span
                                                                    className="
                                                                        text-neutral-600
                                                                        text-xs
                                                                        font-semibold
                                                                        font-poppins
                                                                    "
                                                                >
                                                                    -
                                                                </span>

                                                            ) : (

                                                                <div
                                                                    className="
                                                                        relative
                                                                        group/tooltip
                                                                        flex
                                                                        items-center
                                                                        select-none
                                                                        font-poppins
                                                                    "
                                                                >

                                                                    {/* BADGE ICONS */}

                                                                    <div
                                                                        className="
                                                                            flex
                                                                            gap-1.5
                                                                            items-center
                                                                            cursor-pointer
                                                                        "
                                                                    >

                                                                        {userBadges
                                                                            .slice(
                                                                                0,
                                                                                2
                                                                            )
                                                                            .map(
                                                                                (
                                                                                    badgeId
                                                                                ) => {

                                                                                    const badge =
                                                                                        BADGES[
                                                                                        badgeId
                                                                                        ];

                                                                                    if (
                                                                                        !badge
                                                                                    ) {
                                                                                        return null;
                                                                                    }

                                                                                    const Icon =
                                                                                        badge.Icon;


                                                                                    return (

                                                                                        <div
                                                                                            key={
                                                                                                badgeId
                                                                                            }
                                                                                            className={`
                                                                                                w-6.5
                                                                                                h-6.5
                                                                                                rounded-md
                                                                                                border
                                                                                                flex
                                                                                                items-center
                                                                                                justify-center
                                                                                                shadow-md
                                                                                                hover:scale-115
                                                                                                hover:-translate-y-0.5
                                                                                                active:scale-95
                                                                                                transition-all
                                                                                                duration-200
                                                                                                ${badge.style}
                                                                                                ${badge.glow}
                                                                                            `}
                                                                                        >

                                                                                            <Icon className="size-3.5" />

                                                                                        </div>

                                                                                    );

                                                                                }
                                                                            )}


                                                                        {/* MORE BADGES */}

                                                                        {userBadges.length >
                                                                            2 && (

                                                                                <div
                                                                                    className="
                                                                                    text-[10px]
                                                                                    text-neutral-300
                                                                                    font-bold
                                                                                    bg-neutral-850
                                                                                    hover:bg-neutral-800
                                                                                    px-1.5
                                                                                    py-0.5
                                                                                    rounded
                                                                                    border
                                                                                    border-white/10
                                                                                    shadow-sm
                                                                                    transition-colors
                                                                                    duration-150
                                                                                "
                                                                                >
                                                                                    {userBadges.length -
                                                                                        2}
                                                                                    +
                                                                                </div>

                                                                            )}

                                                                    </div>


                                                                    {/* =================================================
                                                                        BADGE TOOLTIP
                                                                    ================================================= */}

                                                                    <div
                                                                        className="
                                                                            absolute
                                                                            bottom-[135%]
                                                                            left-1/2
                                                                            -translate-x-1/2
                                                                            hidden
                                                                            group-hover/tooltip:flex
                                                                            flex-col
                                                                            gap-2.5
                                                                            bg-neutral-950/98
                                                                            backdrop-blur-md
                                                                            border
                                                                            border-white/10
                                                                            p-3.5
                                                                            rounded-xl
                                                                            shadow-[0_12px_40px_rgba(0,0,0,0.8)]
                                                                            z-50
                                                                            pointer-events-none
                                                                            w-80
                                                                            animate-in
                                                                            fade-in
                                                                            slide-in-from-bottom-2
                                                                            duration-150
                                                                            font-poppins
                                                                        "
                                                                    >

                                                                        <div
                                                                            className="
                                                                                text-[10px]
                                                                                font-black
                                                                                text-neutral-400
                                                                                uppercase
                                                                                tracking-widest
                                                                                border-b
                                                                                border-white/5
                                                                                pb-2
                                                                                text-center
                                                                            "
                                                                        >
                                                                            Earned Badges
                                                                        </div>


                                                                        <div
                                                                            className="
                                                                                grid
                                                                                grid-cols-3
                                                                                gap-2
                                                                            "
                                                                        >

                                                                            {userBadges.map(
                                                                                (
                                                                                    badgeId
                                                                                ) => {

                                                                                    const badge =
                                                                                        BADGES[
                                                                                        badgeId
                                                                                        ];

                                                                                    if (
                                                                                        !badge
                                                                                    ) {
                                                                                        return null;
                                                                                    }


                                                                                    const Icon =
                                                                                        badge.Icon;


                                                                                    return (

                                                                                        <div
                                                                                            key={
                                                                                                badgeId
                                                                                            }
                                                                                            className={`
                                                                                                flex
                                                                                                flex-col
                                                                                                items-center
                                                                                                justify-center
                                                                                                text-center
                                                                                                p-2
                                                                                                rounded-lg
                                                                                                border
                                                                                                text-[9px]
                                                                                                font-bold
                                                                                                font-poppins
                                                                                                gap-1.5
                                                                                                transition-all
                                                                                                duration-150
                                                                                                ${badge.style}
                                                                                            `}
                                                                                        >

                                                                                            <Icon className="size-5 shrink-0" />

                                                                                            <span
                                                                                                className="
                                                                                                    leading-tight
                                                                                                    select-none
                                                                                                    text-[8px]
                                                                                                    font-medium
                                                                                                    tracking-tight
                                                                                                    break-words
                                                                                                    max-w-[76px]
                                                                                                "
                                                                                            >
                                                                                                {
                                                                                                    badge.name
                                                                                                }
                                                                                            </span>

                                                                                        </div>

                                                                                    );

                                                                                }
                                                                            )}

                                                                        </div>


                                                                        {/* TOOLTIP ARROW */}

                                                                        <div
                                                                            className="
                                                                                absolute
                                                                                top-full
                                                                                left-1/2
                                                                                -translate-x-1/2
                                                                                border-[6px]
                                                                                border-transparent
                                                                                border-t-neutral-950/98
                                                                            "
                                                                        />

                                                                    </div>

                                                                </div>

                                                            )}

                                                        </div>

                                                    </div>

                                                );

                                            }
                                        )}

                                    </div>

                                )}


                                {/* =================================================
                                    FOOTER
                                ================================================= */}

                                <div
                                    className="
                                        px-10
                                        w-full
                                        h-20
                                        font-poppins
                                        text-neutral-500
                                        text-sm
                                        flex
                                        items-center
                                        justify-center
                                        gap-1
                                        flex-col
                                    "
                                >

                                    <p>
                                        Showing top 100 users.
                                    </p>


                                    <p
                                        className="
                                            text-neutral-600
                                        "
                                    >
                                        Procrastinators were filtered out.
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    SIDECARD
                ================================================= */}

                <div
                    className="
                        hidden
                        justify-center
                        items-start
                        lg:flex
                    "
                >

                    <Sidecard
                        me={me}
                        leaderboard={leaderboard}
                        period={period}
                        currentUserRank={currentUserRank}
                        loading={loading}
                    />

                </div>

            </div>

        </div>
    );
}


export default Leaderboard;