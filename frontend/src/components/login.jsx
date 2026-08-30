
import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();

    const [mousePos, setMousePos] = useState({
        x: 0,
        y: 0,
    });

    const [isHovered, setIsHovered] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // =========================================================
    // Mouse spotlight effect
    // =========================================================
    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();

        setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    // =========================================================
    // Google Login Success
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

            console.log("Google credential received.");

            // Send Google credential to your backend
            const response = await axios.post(
                "/api/user/google-login",
                {
                    credential: credential,
                },
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("Google login response:", response.data);

            const data = response?.data;

            // =================================================
            // Backend returned failure
            // =================================================
            if (!data?.success) {
                toast.error(
                    data?.msg ||
                        data?.message ||
                        "Google login failed."
                );

                return;
            }

            // =================================================
            // Save token
            // =================================================
            if (data?.token) {
                localStorage.setItem("token", data.token);
            }

            // =================================================
            // Save user data if available
            // =================================================
            if (data?.user) {
                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );
            }

            // =================================================
            // Login success
            // =================================================
            toast.success(
                data?.msg ||
                    data?.message ||
                    "Successfully logged in!"
            );

            // Redirect to Clock page
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
    // Google Login Error
    // =========================================================
    const handleGoogleError = () => {
        console.error("Google Login failed.");

        toast.error(
            "Google authentication failed. Please try again."
        );
    };

    // =========================================================
    // Google Client ID
    // =========================================================
    const googleClientId =
        import.meta.env.VITE_GOOGLE_CLIENT_ID;

    // =========================================================
    // JSX
    // =========================================================
    return (
        <div className="relative h-screen w-screen overflow-hidden bg-black font-sans text-white selection:bg-white selection:text-black">

            {/* =====================================================
                Page Metadata
            ====================================================== */}
            <title>
                Login | Timmo — Access Your Focus Dashboard
            </title>

            <meta
                name="author"
                content="Samiran De"
            />

            <meta
                name="description"
                content="Sign in to your Timmo account to track your focus sessions, view activity heatmaps, check global leaderboards, and resume your workspaces."
            />

            <div className="grid h-full w-full grid-cols-1 lg:grid-cols-12">

                {/* =====================================================
                    LEFT SIDE
                ====================================================== */}
                <div
                    onMouseMove={handleMouseMove}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className="relative hidden select-none flex-col justify-between overflow-hidden border-r border-neutral-900/50 bg-black p-12 text-white lg:col-span-6 lg:flex xl:col-span-7"
                >

                    {/* Mouse spotlight */}
                    <div
                        className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300"
                        style={{
                            opacity: isHovered ? 1 : 0,
                            background: `radial-gradient(
                                400px circle at ${mousePos.x}px ${mousePos.y}px,
                                rgba(255,255,255,0.06),
                                transparent 85%
                            )`,
                        }}
                    />

                    {/* Background image */}
                    <img
                        src="/dither.jpg"
                        alt="Dither Illustration"
                        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-35 brightness-90 contrast-150 mix-blend-luminosity"
                    />

                    {/* Gradient overlays */}
                    <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-tr from-neutral-950 via-neutral-950/40 to-transparent" />

                    <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-l from-neutral-950/60 to-transparent" />

                    {/* Grid */}
                    <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:56px_56px]" />

                    {/* =================================================
                        Quote
                    ================================================== */}
                    <div className="relative z-30 my-auto mx-auto max-w-lg px-4 text-center">

                        <p className="font-instrumental text-[clamp(1.75rem,3.5vw,3.25rem)] font-light italic leading-tight text-neutral-200">
                            "Focus is the art of choosing what to ignore."
                        </p>

                        <div className="mx-auto my-6 h-px w-12 bg-neutral-800" />

                        <p className="font-sans text-xs font-bold uppercase tracking-widest text-neutral-500">
                            Timmo Workspace
                        </p>

                    </div>

                    {/* Bottom spacer */}
                    <div className="relative z-30" />
                </div>

                {/* =====================================================
                    RIGHT SIDE
                ====================================================== */}
                <div className="relative flex flex-col justify-between bg-[#0a0a0a] p-8 text-white sm:p-12 md:p-16 lg:col-span-6 xl:col-span-5">

                    {/* =================================================
                        Top navigation
                    ================================================== */}
                    <div className="z-10 flex w-full items-center justify-between">

                        <button
                            type="button"
                            id="login-back-btn"
                            onClick={() => navigate("/")}
                            className="group flex cursor-pointer items-center gap-2 text-sm font-medium text-neutral-400 transition hover:text-white"
                        >
                            <span className="text-base transition-transform duration-200 group-hover:-translate-x-1">
                                ←
                            </span>

                            <span>
                                Back
                            </span>
                        </button>

                    </div>

                    {/* =================================================
                        Login content
                    ================================================== */}
                    <div className="z-10 my-auto mx-auto flex w-full max-w-sm flex-col items-center space-y-6 py-8 text-center">

                        {/* =================================================
                            Logo
                        ================================================== */}
                        <div className="space-y-2.5">

                            <h1 className="font-sans text-3xl font-black uppercase tracking-[0.35em] text-white sm:text-4xl">
                                Timmo
                            </h1>

                            <p className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-500">
                                Workspace
                            </p>

                        </div>

                        {/* Divider */}
                        <div className="mx-auto my-1 h-px w-16 bg-neutral-800/80" />

                        {/* =================================================
                            Tagline
                        ================================================== */}
                        <div className="space-y-1 py-1">

                            <p className="font-sans text-sm font-medium text-neutral-300 sm:text-base">
                                Quiet and productive focus.
                            </p>

                            <p className="font-sans text-sm font-bold text-[#F4C95D] sm:text-base">
                                All in one.
                            </p>

                        </div>

                        {/* =================================================
                            Google Login
                        ================================================== */}
                        <div className="relative flex w-full justify-center pt-2">

                            {!googleClientId ? (

                                <div className="w-full rounded-xl border border-red-900/30 bg-red-950/20 p-4 text-center font-sans text-xs font-medium leading-relaxed text-red-400">

                                    <p className="mb-1 font-bold">
                                        Google Login Configuration Error
                                    </p>

                                    <p>
                                        VITE_GOOGLE_CLIENT_ID is not
                                        loaded. Please check your
                                        .env file and restart the
                                        Vite server.
                                    </p>

                                </div>

                            ) : (

                                <div className="flex w-full justify-center">

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
                                        useOneTap={false}
                                    />

                                </div>

                            )}

                        </div>

                        {/* =================================================
                            Loading
                        ================================================== */}
                        {isLoading && (
                            <p className="text-xs font-medium text-neutral-500">
                                Signing you in...
                            </p>
                        )}

                        {/* =================================================
                            Security notice
                        ================================================== */}
                        <div className="flex items-center justify-center gap-2 text-neutral-500">

                            <svg
                                viewBox="0 0 24 24"
                                className="h-3.5 w-3.5 fill-none stroke-current"
                                strokeWidth="2.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <rect
                                    x="3"
                                    y="11"
                                    width="18"
                                    height="11"
                                    rx="2"
                                    ry="2"
                                />

                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>

                            <span className="font-sans text-[10px] tracking-wide text-neutral-500">
                                Secure passwordless authentication.
                            </span>

                        </div>

                    </div>

                    {/* Footer spacer */}
                    <div className="h-6" />

                </div>
            </div>
        </div>
    );
}

export default Login
