import React from "react";
import { MdArrowOutward } from "react-icons/md";
import { FaFire } from "react-icons/fa6";

function Sidecard({
    me,
    avatarColor,
    loading,
    period = "today",
    leaderboard = [],
}) {
    /* =========================================================
       PERIOD CONFIG
    ========================================================= */

    const periodConfig = {
        today: {
            label: "Today's",
            shortLabel: "Today",
            rankLabel: "Today",
            timeLabel: "Today's time",
        },

        weekly: {
            label: "This week's",
            shortLabel: "Weekly",
            rankLabel: "This week",
            timeLabel: "This week's time",
        },

        monthly: {
            label: "This month's",
            shortLabel: "Monthly",
            rankLabel: "This month",
            timeLabel: "This month's time",
        },
    };

    const currentPeriod =
        periodConfig[period] || periodConfig.today;


    /* =========================================================
       FORMAT TIME
    ========================================================= */

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


    /* =========================================================
       AVATAR COLOR
    ========================================================= */

    const getAvatarColor = (name = "") => {
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


    /* =========================================================
       CURRENT USER FROM SELECTED LEADERBOARD
    ========================================================= */

    const currentUserFromLeaderboard =
        leaderboard.find(
            (user) =>
                user?.userId === me?.userId
        );


    /*
     * For Today / Weekly / Monthly the leaderboard response
     * contains the time for that selected period.
     *
     * Fallbacks keep this compatible with the existing API.
     */

    const selectedUser =
        currentUserFromLeaderboard || me;


    const selectedTime =
        selectedUser?.todayTime ??
        selectedUser?.totalTime ??
        selectedUser?.time ??
        0;


    /* =========================================================
       CURRENT RANK
    ========================================================= */

    const currentUserRank =
        leaderboard.findIndex(
            (user) =>
                user?.userId === me?.userId
        ) + 1;


    /*
     * If the user is not inside the visible leaderboard,
     * fall back to the rank supplied by /me.
     */

    const displayedRank =
        currentUserRank > 0
            ? currentUserRank
            : me?.rank ?? "-";


    /* =========================================================
       FOCUSED MORE THAN
    ========================================================= */

    const focusedMoreThan =
        selectedUser?.focusedMoreThan ??
        me?.focusedMoreThan ??
        0;


    /* =========================================================
       RENDER
    ========================================================= */

    return (
        <div
            className="
                h-auto
                font-poppins
                rounded-md
                w-85
                -mr-20
                min-w-0
                mt-19.5
                px-3
                py-3
                border-2
                border-white/10
                bg-white/2
                flex
                flex-col
                gap-3
            "
        >

            {/* =================================================
                PROFILE CARD
            ================================================= */}

            <div
                className="
                    rounded-md
                    w-full
                    h-41
                    p-3
                    flex
                    flex-col
                    items-center
                    justify-center
                    gap-2
                    bg-neutral-900
                    border-2
                    border-white/5
                    overflow-hidden
                    truncate
                "
            >

                {loading ? (
                    <>
                        <div
                            className="
                                size-15
                                rounded-full
                                bg-neutral-800
                                animate-pulse
                            "
                        />

                        <div
                            className="
                                flex
                                flex-col
                                gap-2
                                items-center
                            "
                        >
                            <div
                                className="
                                    h-5
                                    w-36
                                    rounded-sm
                                    bg-neutral-800
                                    animate-pulse
                                "
                            />

                            <div
                                className="
                                    h-7
                                    w-52
                                    rounded-full
                                    bg-neutral-800
                                    animate-pulse
                                "
                            />
                        </div>
                    </>
                ) : (
                    <>
                        {/* AVATAR */}

                        <div>
                            {me?.picture ? (
                                <img
                                    src={me.picture}
                                    alt={me?.name || "User"}
                                    className="
                                        size-15
                                        rounded-full
                                        object-cover
                                        border
                                        border-white/10
                                    "
                                    referrerPolicy="no-referrer"
                                />
                            ) : (
                                <div
                                    className="
                                        size-15
                                        rounded-full
                                        flex
                                        justify-center
                                        items-center
                                        font-semibold
                                        text-4xl
                                    "
                                    style={{
                                        backgroundColor:
                                            getAvatarColor(
                                                me?.name
                                            ),
                                    }}
                                >
                                    <p>
                                        {me?.name
                                            ? me.name[0].toUpperCase()
                                            : "?"}
                                    </p>
                                </div>
                            )}
                        </div>


                        {/* NAME + PERCENTILE */}

                        <div
                            className="
                                flex
                                flex-col
                                gap-2
                                items-center
                            "
                        >
                            <p
                                className="
                                    text-xl
                                    font-semibold
                                    text-white
                                    truncate
                                    w-70
                                    text-center
                                "
                            >
                                {me?.name || "Anonymous"}
                            </p>

                            <p
                                className="
                                    text-xs
                                    text-neutral-500
                                    tracking-tight
                                    rounded-full
                                    bg-white/7
                                    pr-3
                                    pl-2
                                    py-1
                                    flex
                                    gap-1
                                    items-center
                                    border
                                    border-white/10
                                "
                            >
                                <MdArrowOutward className="size-4" />

                                Top {focusedMoreThan}%
                                in Timeout users
                            </p>
                        </div>
                    </>
                )}

            </div>


            {/* =================================================
                PERIOD SUMMARY
            ================================================= */}

            <div
                className="
                    rounded-md
                    w-full
                    min-h-55
                    px-3
                    py-3
                    flex
                    flex-col
                    gap-1
                    justify-center
                    bg-neutral-900
                    border-2
                    border-white/5
                "
            >

                {/* TITLE */}

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        gap-2
                    "
                >
                    <p className="tracking-tight text-neutral-400">
                        {currentPeriod.label} summary
                    </p>

                    {!loading && (
                        <span
                            className="
                                text-[10px]
                                font-semibold
                                text-neutral-600
                                uppercase
                                tracking-widest
                            "
                        >
                            {currentPeriod.shortLabel}
                        </span>
                    )}
                </div>


                {/* STATS */}

                <div
                    className="
                        w-full
                        min-h-45
                        grid
                        grid-cols-2
                        gap-2
                        justify-center
                        items-center
                        mt-2
                    "
                >

                    {loading ? (
                        Array.from({ length: 4 }).map(
                            (_, i) => (
                                <div
                                    key={i}
                                    className="
                                        rounded-sm
                                        h-full
                                        w-full
                                        px-3
                                        flex
                                        justify-center
                                        flex-col
                                        gap-2
                                        bg-white/5
                                    "
                                >
                                    <div
                                        className="
                                            h-3
                                            w-16
                                            rounded-sm
                                            bg-neutral-800
                                            animate-pulse
                                        "
                                    />

                                    <div
                                        className="
                                            h-5
                                            w-20
                                            rounded-sm
                                            bg-neutral-800
                                            animate-pulse
                                        "
                                    />

                                    <div
                                        className="
                                            h-2
                                            w-12
                                            rounded-sm
                                            bg-neutral-800/70
                                            animate-pulse
                                        "
                                    />
                                </div>
                            )
                        )
                    ) : (
                        <>

                            {/* RANK */}

                            <div
                                className="
                                    rounded-sm
                                    h-full
                                    w-full
                                    px-3
                                    flex
                                    justify-center
                                    flex-col
                                    bg-yellow-400/5
                                "
                            >
                                <p className="text-white mb-0.5">
                                    Rank
                                </p>

                                <p
                                    className="
                                        text-yellow-400
                                        text-xl
                                        font-semibold
                                    "
                                >
                                    # {displayedRank}
                                </p>

                                <p className="text-neutral-500 text-xs">
                                    {currentPeriod.rankLabel}
                                </p>
                            </div>


                            {/* STREAK */}

                            <div
                                className="
                                    rounded-sm
                                    h-full
                                    w-full
                                    px-3
                                    flex
                                    justify-center
                                    flex-col
                                    bg-orange-400/5
                                "
                            >
                                <p className="text-white mb-0.5">
                                    Streak
                                </p>

                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-1
                                    "
                                >
                                    <FaFire className="text-amber-600" />

                                    <p
                                        className="
                                            text-orange-400
                                            text-xl
                                            font-semibold
                                        "
                                    >
                                        {selectedUser?.streak ?? 0}
                                    </p>
                                </div>

                                <p className="text-neutral-500 text-xs">
                                    Current
                                </p>
                            </div>


                            {/* FOCUS TIME */}

                            <div
                                className="
                                    rounded-sm
                                    h-full
                                    w-full
                                    px-3
                                    flex
                                    justify-center
                                    flex-col
                                    bg-blue-400/7
                                "
                            >
                                <p className="text-white mb-0.5">
                                    Focus Time
                                </p>

                                <p
                                    className="
                                        text-blue-400
                                        text-md
                                        font-semibold
                                        truncate
                                    "
                                >
                                    {formatTime(selectedTime)}
                                </p>

                                <p className="text-neutral-500 text-xs">
                                    {currentPeriod.shortLabel}
                                </p>
                            </div>


                            {/* PERCENTILE */}

                            <div
                                className="
                                    rounded-sm
                                    h-full
                                    w-full
                                    px-3
                                    flex
                                    justify-center
                                    flex-col
                                    bg-green-500/5
                                "
                            >
                                <p className="text-white mb-0.5">
                                    Percentile
                                </p>

                                <p
                                    className="
                                        text-green-500
                                        text-xl
                                        font-semibold
                                    "
                                >
                                    {focusedMoreThan} %
                                </p>

                                <p className="text-neutral-500 text-xs">
                                    {currentPeriod.shortLabel}
                                </p>
                            </div>

                        </>
                    )}

                </div>

            </div>


            {/* =================================================
                YOU VS THE WORLD
            ================================================= */}

            <div
                className="
                    relative
                    h-40
                    overflow-hidden
                    rounded-md
                    border
                    border-white/10
                    bg-neutral-900
                    p-5
                "
            >

                <div
                    className="
                        absolute
                        inset-0
                        bg-gradient-to-r
                        from-transparent
                        via-white/[0.01]
                        to-transparent
                    "
                />


                {/* EARTH */}

                <div
                    className="
                        absolute
                        right-[-15px]
                        bottom-[-14px]
                    "
                >
                    <img
                        src="/earth.webp"
                        alt=""
                        className="
                            w-43
                            opacity-50
                            mask-l-from-40%
                            mask-b-from-50%
                            grayscale
                        "
                    />
                </div>


                {/* CONTENT */}

                <div className="relative z-10">

                    <p className="text-sm text-neutral-500">
                        You vs The World
                    </p>


                    {loading ? (
                        <>
                            <div
                                className="
                                    mt-4
                                    h-12
                                    w-24
                                    rounded-sm
                                    bg-neutral-800
                                    animate-pulse
                                "
                            />

                            <div
                                className="
                                    mt-4
                                    flex
                                    flex-col
                                    gap-2
                                "
                            >
                                <div
                                    className="
                                        h-3
                                        w-[170px]
                                        rounded-sm
                                        bg-neutral-800
                                        animate-pulse
                                    "
                                />

                                <div
                                    className="
                                        h-3
                                        w-32
                                        rounded-sm
                                        bg-neutral-800
                                        animate-pulse
                                    "
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <div
                                className="
                                    mt-3
                                    flex
                                    items-end
                                    gap-1
                                "
                            >
                                <span
                                    className="
                                        text-5xl
                                        font-bold
                                        text-white
                                    "
                                >
                                    {focusedMoreThan}
                                </span>

                                <span
                                    className="
                                        mb-1
                                        text-2xl
                                        font-semibold
                                        text-neutral-500
                                    "
                                >
                                    %
                                </span>
                            </div>


                            <p
                                className="
                                    mt-2
                                    w-[170px]
                                    text-sm
                                    text-neutral-400
                                "
                            >
                                Focused more than{" "}
                                {focusedMoreThan}% of users{" "}
                                {period === "today"
                                    ? "today"
                                    : period === "weekly"
                                        ? "this week"
                                        : "this month"}.
                            </p>
                        </>
                    )}

                </div>

            </div>

        </div>
    );
}

export default Sidecard;