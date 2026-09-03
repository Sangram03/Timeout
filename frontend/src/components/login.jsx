
import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

import {
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
    ResponsiveContainer,
    Tooltip,
    Cell,
} from "recharts";

function Login() {
    const navigate = useNavigate();

    const [mousePos, setMousePos] = useState({
        x: 0,
        y: 0,
    });

    const [isHovered, setIsHovered] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // =========================================================
    // CHART DATA
    // =========================================================

    const chartData = [
        {
            month: "January",
            shortMonth: "Jan",
            value: 65,
            color: "#6366F1",
        },
        {
            month: "February",
            shortMonth: "Feb",
            value: 59,
            color: "#8B5CF6",
        },
        {
            month: "March",
            shortMonth: "Mar",
            value: 80,
            color: "#EC4899",
        },
        {
            month: "April",
            shortMonth: "Apr",
            value: 81,
            color: "#F43F5E",
        },
        {
            month: "May",
            shortMonth: "May",
            value: 56,
            color: "#F97316",
        },
        {
            month: "June",
            shortMonth: "Jun",
            value: 55,
            color: "#14B8A6",
        },
        {
            month: "July",
            shortMonth: "Jul",
            value: 40,
            color: "#06B6D4",
        },
    ];

    // =========================================================
    // MOUSE SPOTLIGHT
    // =========================================================

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();

        setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    // =========================================================
    // GOOGLE LOGIN
    // =========================================================

    const handleGoogleSuccess = async (credentialResponse) => {
        if (isLoading) return;

        try {
            setIsLoading(true);

            const credential = credentialResponse?.credential;

            if (!credential) {
                toast.error("Google credential was not received.");
                return;
            }

            const response = await axios.post(
                "/api/user/google-login",
                {
                    credential,
                },
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = response?.data;

            if (!data?.success) {
                toast.error(
                    data?.msg ||
                        data?.message ||
                        "Google login failed."
                );

                return;
            }

            if (data?.token) {
                localStorage.setItem("token", data.token);
            }

            if (data?.user) {
                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );
            }

            toast.success(
                data?.msg ||
                    data?.message ||
                    "Successfully logged in!"
            );

            navigate("/clock", {
                replace: true,
            });
        } catch (error) {
            console.error(
                "Google OAuth backend error:",
                error
            );

            const errorMessage =
                error?.response?.data?.msg ||
                error?.response?.data?.message ||
                error?.message ||
                "Google authentication failed.";

            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // =========================================================
    // GOOGLE LOGIN ERROR
    // =========================================================

    const handleGoogleError = () => {
        toast.error(
            "Google authentication failed. Please try again."
        );
    };

    // =========================================================
    // GOOGLE CLIENT ID
    // =========================================================

    const googleClientId =
        import.meta.env.VITE_GOOGLE_CLIENT_ID;

    // =========================================================
    // CUSTOM TOOLTIP
    // =========================================================

    const CustomTooltip = ({
        active,
        payload,
        label,
    }) => {
        if (!active || !payload || !payload.length) {
            return null;
        }

        const item = payload[0];

        return (
            <div className="animate-tooltip rounded-xl border border-white/10 bg-[#111111]/95 px-4 py-3 shadow-2xl backdrop-blur-xl">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                    {label}
                </p>

                <div className="flex items-center gap-2">
                    <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{
                            backgroundColor:
                                item.payload.color,
                        }}
                    />

                    <p className="text-sm font-bold text-white">
                        {item.value} sessions
                    </p>
                </div>
            </div>
        );
    };

    // =========================================================
    // STATS
    // =========================================================

    const totalSessions = chartData.reduce(
        (total, item) => total + item.value,
        0
    );

    const bestMonth = chartData.reduce(
        (best, item) =>
            item.value > best.value ? item : best,
        chartData[0]
    );

    // =========================================================
    // JSX
    // =========================================================

    return (
        <>
            {/* =====================================================
                ANIMATIONS
            ====================================================== */}

            <style>
                {`
                    @keyframes floatSlow {
                        0%, 100% {
                            transform: translate3d(0, 0, 0);
                        }

                        50% {
                            transform: translate3d(0, -20px, 0);
                        }
                    }

                    @keyframes floatReverse {
                        0%, 100% {
                            transform: translate3d(0, 0, 0);
                        }

                        50% {
                            transform: translate3d(20px, 15px, 0);
                        }
                    }

                    @keyframes pulseGlow {
                        0%, 100% {
                            opacity: 0.15;
                            transform: scale(1);
                        }

                        50% {
                            opacity: 0.45;
                            transform: scale(1.1);
                        }
                    }

                    @keyframes slideUp {
                        from {
                            opacity: 0;
                            transform: translateY(30px);
                        }

                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }

                    @keyframes slideRight {
                        from {
                            opacity: 0;
                            transform: translateX(30px);
                        }

                        to {
                            opacity: 1;
                            transform: translateX(0);
                        }
                    }

                    @keyframes shimmer {
                        0% {
                            transform: translateX(-120%);
                        }

                        100% {
                            transform: translateX(120%);
                        }
                    }

                    @keyframes borderPulse {
                        0%, 100% {
                            box-shadow:
                                0 0 0 0 rgba(99, 102, 241, 0);
                        }

                        50% {
                            box-shadow:
                                0 0 45px 0 rgba(99, 102, 241, 0.15);
                        }
                    }

                    @keyframes tooltipIn {
                        from {
                            opacity: 0;
                            transform: translateY(5px) scale(0.97);
                        }

                        to {
                            opacity: 1;
                            transform: translateY(0) scale(1);
                        }
                    }

                    .login-slide {
                        animation: slideRight 0.8s ease-out both;
                    }

                    .chart-slide {
                        animation: slideUp 0.8s ease-out both;
                    }

                    .chart-card {
                        animation: borderPulse 4s ease-in-out infinite;
                    }

                    .float-slow {
                        animation: floatSlow 7s ease-in-out infinite;
                    }

                    .float-reverse {
                        animation: floatReverse 9s ease-in-out infinite;
                    }

                    .pulse-glow {
                        animation: pulseGlow 5s ease-in-out infinite;
                    }

                    .animate-tooltip {
                        animation: tooltipIn 0.18s ease-out;
                    }

                    .google-wrapper iframe {
                        max-width: 100% !important;
                    }

                    @media (prefers-reduced-motion: reduce) {
                        *,
                        *::before,
                        *::after {
                            animation-duration: 0.01ms !important;
                            animation-iteration-count: 1 !important;
                            transition-duration: 0.01ms !important;
                        }
                    }

                    /* =================================================
                       DESKTOP
                    ================================================= */

                    @media (min-width: 1024px) {
                        .login-layout-card {
                            height: 720px;
                        }
                    }

                    /* =================================================
                       TABLET
                    ================================================= */

                    @media (min-width: 640px) and (max-width: 1023px) {
                        .login-layout-card {
                            min-height: 650px;
                        }
                    }

                    /* =================================================
                       MOBILE
                    ================================================= */

                    @media (max-width: 639px) {
                        .login-layout-card {
                            min-height: auto;
                        }
                    }
                `}
            </style>

            {/* =====================================================
                MAIN BLACK PAGE
            ====================================================== */}

            <main className="relative min-h-screen w-full overflow-x-hidden bg-black font-sans text-white">

                {/* =================================================
                    GLOBAL BACKGROUND
                ================================================== */}

                <div className="pointer-events-none fixed inset-0 overflow-hidden">

                    {/* Purple / Pink glow */}

                    <div
                        className="float-slow absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full opacity-20 blur-[120px]"
                        style={{
                            background:
                                "linear-gradient(135deg, #6366F1, #EC4899)",
                        }}
                    />

                    {/* Cyan / Violet glow */}

                    <div
                        className="float-reverse absolute -bottom-48 -right-40 h-[550px] w-[550px] rounded-full opacity-15 blur-[130px]"
                        style={{
                            background:
                                "linear-gradient(135deg, #06B6D4, #8B5CF6)",
                        }}
                    />

                    {/* Center glow */}

                    <div
                        className="pulse-glow absolute left-1/2 top-1/2 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]"
                        style={{
                            background:
                                "radial-gradient(circle, rgba(99,102,241,0.18), transparent 70%)",
                        }}
                    />

                    {/* Background grid */}

                    <div className="absolute inset-0 opacity-[0.025]">
                        <div
                            className="h-full w-full"
                            style={{
                                backgroundImage:
                                    "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
                                backgroundSize:
                                    "50px 50px",
                            }}
                        />
                    </div>
                </div>

                {/* =================================================
                    CENTER EVERYTHING
                ================================================== */}

                <div className="relative ml-30 z-10 flex min-h-screen w-full items-center justify-center px-4 py-8 sm:px-6 lg:px-8">

                    {/* =================================================
                        EXACT SAME SIZE CONTAINER
                    ================================================== */}

                    <div className="grid w-full max-w-[1400px] grid-cols-1 items-stretch justify-center gap-7 lg:grid-cols-2 lg:gap-8">

                        {/* =================================================
                            LEFT ANALYTICS CARD
                        ================================================== */}

                        <section
                            onMouseMove={handleMouseMove}
                            onMouseEnter={() =>
                                setIsHovered(true)
                            }
                            onMouseLeave={() =>
                                setIsHovered(false)
                            }
                            className="login-layout-card relative flex w-full items-center justify-center overflow-hidden rounded-[32px] border border-white/10 bg-[#090909]/95 p-5 shadow-[0_30px_100px_rgba(0,0,0,0.65)] backdrop-blur-2xl sm:p-7 lg:p-8"
                        >

                            {/* Background effects */}

                            <div className="pointer-events-none absolute inset-0 overflow-hidden">

                                <div
                                    className="float-slow absolute -left-32 -top-32 h-80 w-80 rounded-full opacity-15 blur-3xl"
                                    style={{
                                        background:
                                            "linear-gradient(135deg, #6366F1, #EC4899)",
                                    }}
                                />

                                <div
                                    className="float-reverse absolute -bottom-40 -right-20 h-96 w-96 rounded-full opacity-10 blur-3xl"
                                    style={{
                                        background:
                                            "linear-gradient(135deg, #14B8A6, #06B6D4)",
                                    }}
                                />

                                <div className="absolute inset-0 opacity-[0.025]">
                                    <div
                                        className="h-full w-full"
                                        style={{
                                            backgroundImage:
                                                "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
                                            backgroundSize:
                                                "42px 42px",
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Mouse spotlight */}

                            <div
                                className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-500"
                                style={{
                                    opacity: isHovered ? 1 : 0,
                                    background: `radial-gradient(
                                        420px circle at ${mousePos.x}px ${mousePos.y}px,
                                        rgba(99,102,241,0.10),
                                        transparent 70%
                                    )`,
                                }}
                            />

                            {/* Analytics content */}

                            <div className="relative z-20  w-full flex-col justify-center">

                                {/* Header */}

                                <div className="chart-slide ml-35 mb-7">

                                   

                                    <h2 className="text-[2.3rem] font-black leading-[0.95] tracking-[-0.045em] text-white sm:text-5xl xl:text-6xl">

                                        Stay focused.

                                        <br />

                                     
                                    </h2>

                                    <p className="mt-5 max-w-xl text-sm  leading-6 text-neutral-500 sm:text-base">
                                        
                                        
                                        Timmo.
                                    </p>
                                </div>

                                {/* Chart */}

                                <div className="chart-card chart-slide relative overflow-hidden rounded-3xl border border-white/10 bg-[#101010]/90 p-4 shadow-[0_25px_80px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:p-6">

                                    {/* Top shine */}

                                    <div className="pointer-events-none absolute left-0 right-0 top-0 h-px overflow-hidden bg-gradient-to-r from-transparent via-indigo-400/70 to-transparent">

                                        <div
                                            className="h-full w-1/3 bg-white/70"
                                            style={{
                                                animation:
                                                    "shimmer 4s linear infinite",
                                            }}
                                        />
                                    </div>

                                    {/* Chart header */}

                                    <div className="relative mb-5 flex items-start justify-between gap-3">

                                        <div>

                                            <h3 className="text-base font-bold tracking-tight text-white sm:text-lg">
                                                Focus Sessions
                                            </h3>

                                            <p className="mt-1 text-xs text-neutral-600 sm:text-sm">
                                                Monthly productivity
                                                overview
                                            </p>
                                        </div>

                                        <div className="flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">

                                            <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-500" />

                                            <span className="text-[10px] font-semibold text-neutral-500 sm:text-xs">
                                                Live data
                                            </span>
                                        </div>
                                    </div>

                                    {/* Bar chart */}

                                    <div className="h-[230px] w-full sm:h-[280px] lg:h-[270px] xl:h-[290px]">

                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >
                                            <BarChart
                                                data={chartData}
                                                margin={{
                                                    top: 15,
                                                    right: 5,
                                                    left: -22,
                                                    bottom: 5,
                                                }}
                                                barCategoryGap="25%"
                                            >

                                                <CartesianGrid
                                                    vertical={false}
                                                    stroke="#262626"
                                                    strokeDasharray="3 5"
                                                />

                                                <XAxis
                                                    dataKey="shortMonth"
                                                    tick={{
                                                        fill: "#737373",
                                                        fontSize: 11,
                                                        fontWeight: 500,
                                                    }}
                                                    axisLine={false}
                                                    tickLine={false}
                                                    dy={8}
                                                />

                                                <YAxis
                                                    domain={[0, 90]}
                                                    ticks={[
                                                        0,
                                                        10,
                                                        20,
                                                        30,
                                                        40,
                                                        50,
                                                        60,
                                                        70,
                                                        80,
                                                        90,
                                                    ]}
                                                    tick={{
                                                        fill: "#525252",
                                                        fontSize: 10,
                                                    }}
                                                    axisLine={false}
                                                    tickLine={false}
                                                />

                                                <Tooltip
                                                    cursor={{
                                                        fill: "rgba(99,102,241,0.04)",
                                                    }}
                                                    content={
                                                        <CustomTooltip />
                                                    }
                                                />

                                                <Bar
                                                    dataKey="value"
                                                    radius={[
                                                        7,
                                                        7,
                                                        2,
                                                        2,
                                                    ]}
                                                    maxBarSize={48}
                                                    animationBegin={250}
                                                    animationDuration={1500}
                                                    animationEasing="ease-out"
                                                >
                                                    {chartData.map(
                                                        (
                                                            entry,
                                                            index
                                                        ) => (
                                                            <Cell
                                                                key={`cell-${index}`}
                                                                fill={
                                                                    entry.color
                                                                }
                                                                fillOpacity={
                                                                    0.25
                                                                }
                                                                stroke={
                                                                    entry.color
                                                                }
                                                                strokeWidth={
                                                                    1.5
                                                                }
                                                            />
                                                        )
                                                    )}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>

                                    {/* Stats */}

                                    <div className="mt-4 grid grid-cols-2 gap-3 border-t border-white/10 pt-4">

                                        <div className="rounded-2xl border border-white/5 bg-white/[0.025] p-3 sm:p-4">

                                            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-neutral-600 sm:text-[10px]">
                                                Total sessions
                                            </p>

                                            <p className="mt-1 text-xl font-black tracking-tight text-white sm:text-2xl">
                                                {totalSessions}
                                            </p>
                                        </div>

                                        <div className="rounded-2xl border border-white/5 bg-white/[0.025] p-3 sm:p-4">

                                            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-neutral-600 sm:text-[10px]">
                                                Best month
                                            </p>

                                            <div className="mt-1 flex items-center gap-2">

                                                <span
                                                    className="h-2.5 w-2.5 rounded-full"
                                                    style={{
                                                        backgroundColor:
                                                            bestMonth.color,
                                                    }}
                                                />

                                                <p className="text-sm font-black tracking-tight text-white sm:text-base">
                                                    {
                                                        bestMonth.shortMonth
                                                    }{" "}
                                                    ·{" "}
                                                    {
                                                        bestMonth.value
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Quote */}

                                <div className="chart-slide mt-5 flex items-center justify-center gap-3">

                                    <div className="h-px w-8 bg-white/10" />

                                    <p className="text-center text-[10px] font-medium italic text-neutral-600 sm:text-xs">
                                        "Focus is the art of choosing
                                        what to ignore."
                                    </p>

                                    <div className="h-px w-8 bg-white/10" />
                                </div>
                            </div>
                        </section>

                        {/* =================================================
                            RIGHT LOGIN CARD
                        ================================================== */}

                        <section className="login-layout-card relative flex w-full items-center justify-center overflow-hidden rounded-[32px] border border-white/10 bg-[#090909]/95 p-5 text-white shadow-[0_30px_100px_rgba(0,0,0,0.7)] backdrop-blur-2xl sm:p-8 lg:p-10">

                            {/* Login background */}

                            <div className="pointer-events-none absolute inset-0 overflow-hidden">

                                {/* Grid */}

                                <div className="absolute inset-0 opacity-[0.025]">

                                    <div
                                        className="h-full w-full"
                                        style={{
                                            backgroundImage:
                                                "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
                                            backgroundSize:
                                                "48px 48px",
                                        }}
                                    />
                                </div>

                                {/* Glow 1 */}

                                <div
                                    className="float-slow absolute -right-32 -top-32 h-96 w-96 rounded-full opacity-20 blur-3xl"
                                    style={{
                                        background:
                                            "linear-gradient(135deg, #6366F1, #8B5CF6)",
                                    }}
                                />

                                {/* Glow 2 */}

                                <div
                                    className="float-reverse absolute -bottom-40 -left-32 h-96 w-96 rounded-full opacity-15 blur-3xl"
                                    style={{
                                        background:
                                            "linear-gradient(135deg, #EC4899, #F43F5E)",
                                    }}
                                />

                                {/* Center glow */}

                                <div
                                    className="pulse-glow absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-10 blur-3xl"
                                    style={{
                                        background:
                                            "radial-gradient(circle, #6366F1, transparent 70%)",
                                    }}
                                />
                            </div>

                            {/* Back button */}

                            <div className="absolute left-5 top-5 z-30 sm:left-7 sm:top-7">

                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate("/")
                                    }
                                    className="group flex items-center gap-2 rounded-full px-3 py-2 text-xs font-medium text-neutral-600 transition-all duration-300 hover:bg-neutral-900 hover:text-white"
                                >
                                    <span className="text-base transition-transform duration-300 group-hover:-translate-x-1">
                                        ←
                                    </span>

                                    <span>
                                        Back
                                    </span>
                                </button>
                            </div>

                            {/* Login content */}

                            <div className="relative z-20 flex w-full flex-col items-center justify-center">

                                <div className="login-slide flex w-full max-w-[390px] flex-col items-center">

                                    {/* Logo */}

                                    <div className="mb-6 flex flex-col items-center">

                                        <div className="group relative mb-5">

                                            <div className="absolute -inset-3 rounded-2xl bg-indigo-500/10 opacity-0 blur-xl transition duration-500 group-hover:opacity-100" />

                                            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900 shadow-[0_15px_40px_rgba(0,0,0,0.5)] transition duration-500 group-hover:-translate-y-1 group-hover:border-indigo-500/30">

                                                <span className="bg-gradient-to-br from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-xl font-black text-transparent">
                                                    T
                                                </span>
                                            </div>
                                        </div>

                                        <h1 className="text-3xl font-black uppercase tracking-[0.32em] text-white sm:text-4xl">
                                            Timmo
                                        </h1>

                                        <p className="mt-2 text-[9px] font-bold uppercase tracking-[0.38em] text-neutral-600">
                                            Workspace
                                        </p>
                                    </div>

                                    {/* Divider */}

                                    <div className="relative mb-7 h-px w-16 overflow-hidden bg-neutral-800">

                                        <div
                                            className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"
                                            style={{
                                                animation:
                                                    "shimmer 3s linear infinite",
                                            }}
                                        />
                                    </div>

                                    {/* Tagline */}

                                    <div className="mb-8 text-center">

                                        <p className="text-sm font-medium text-neutral-300 sm:text-base">
                                            Quiet and productive focus.
                                        </p>

                                        <p className="mt-1 bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-sm font-bold text-transparent sm:text-base">
                                            All in one.
                                        </p>
                                    </div>

                                    {/* Login box */}

                                    <div className="group relative w-full">

                                        {/* Glow */}

                                        <div className="absolute -inset-px rounded-3xl bg-gradient-to-r from-indigo-500/20 via-transparent to-pink-500/20 opacity-0 blur transition duration-500 group-hover:opacity-100" />

                                        <div className="relative overflow-hidden rounded-3xl border border-neutral-800/80 bg-[#0D0D0D]/95 p-5 shadow-[0_30px_100px_rgba(0,0,0,0.55)] backdrop-blur-2xl sm:p-7">

                                            {/* Shine */}

                                            <div className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                                            {/* Heading */}

                                            <div className="mb-6 text-center">

                                                <h2 className="text-base font-bold text-white sm:text-lg">
                                                    Welcome back
                                                </h2>

                                                <p className="mt-1.5 text-xs leading-5 text-neutral-500">
                                                    Sign in to continue
                                                    to your workspace
                                                </p>
                                            </div>

                                            {/* Google */}

                                            <div className="google-wrapper flex min-h-[44px] w-full items-center justify-center overflow-hidden rounded-xl">

                                                {!googleClientId ? (

                                                    <div className="w-full rounded-xl border border-red-900/40 bg-red-950/20 p-4 text-center text-xs leading-5 text-red-400">

                                                        <p className="mb-1 font-bold">
                                                            Google Login
                                                            Configuration
                                                            Error
                                                        </p>

                                                        <p className="text-[10px] text-red-400/80">
                                                            VITE_GOOGLE_CLIENT_ID
                                                            is not loaded.
                                                            Check your
                                                            .env file and
                                                            restart Vite.
                                                        </p>
                                                    </div>

                                                ) : (

                                                    <GoogleLogin
                                                        onSuccess={
                                                            handleGoogleSuccess
                                                        }
                                                        onError={
                                                            handleGoogleError
                                                        }
                                                        theme="outline"
                                                        shape="pill"
                                                        size="large"
                                                        width="320"
                                                        text="signin_with"
                                                        useOneTap={
                                                            false
                                                        }
                                                    />
                                                )}
                                            </div>

                                            {/* Loading */}

                                            {isLoading && (

                                                <div className="mt-5 flex items-center justify-center gap-2">

                                                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-neutral-700 border-t-indigo-400" />

                                                    <p className="text-[11px] font-medium text-neutral-500">
                                                        Signing you in...
                                                    </p>
                                                </div>
                                            )}

                                            {/* Security */}

                                            <div className="mt-6 flex items-center justify-center gap-2 border-t border-neutral-800/70 pt-5">

                                                <svg
                                                    viewBox="0 0 24 24"
                                                    className="h-3.5 w-3.5 text-neutral-600"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >

                                                    <rect
                                                        x="3"
                                                        y="11"
                                                        width="18"
                                                        height="11"
                                                        rx="2"
                                                    />

                                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                                </svg>

                                                <span className="text-[10px] tracking-wide text-neutral-600">
                                                    Secure passwordless
                                                    authentication.
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Terms */}

                                    <p className="mt-6 max-w-[330px] text-center text-[9px] leading-5 text-neutral-600 sm:text-[10px]">

                                        By signing in, you agree to our{" "}

                                        <span className="text-neutral-400 transition hover:text-white">
                                            Terms of Service
                                        </span>

                                        {" "}and{" "}

                                        <span className="text-neutral-400 transition hover:text-white">
                                            Privacy Policy
                                        </span>

                                        .
                                    </p>
                                </div>
                            </div>

                            {/* Footer */}

                            <div className="absolute bottom-5 left-0 right-0 z-20 text-center">

                                <p className="text-[8px] uppercase tracking-[0.3em] text-neutral-700 sm:text-[9px]">
                                    © {new Date().getFullYear()} Timmo
                                </p>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </>
    );
}

export default Login;

