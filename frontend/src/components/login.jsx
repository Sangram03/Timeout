import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [mousePos, setMousePos] = useState({
        x: 0,
        y: 0,
    });

    // =========================================================
    // MOUSE EFFECT
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
    // GOOGLE ERROR
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
    // JSX
    // =========================================================

    return (
        <>
            <style>
                {`
                    /* =====================================================
                       RESET
                       (!important overrides needed because Vite's default
                       index.css ships #root { max-width:1280px; margin:0 auto;
                       padding:2rem } + body { display:flex; place-items:center },
                       which shrink-wraps #root and left-aligns everything
                       inside it instead of letting this page truly center
                       in the viewport.)
                    ====================================================== */

                    html,
                    body {
                        width: 100% !important;
                        min-width: 100% !important;
                        min-height: 100% !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        display: block !important;
                        place-items: unset !important;
                    }

                    #root {
                        width: 100% !important;
                        min-width: 100% !important;
                        min-height: 100% !important;
                        max-width: none !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        text-align: left !important;
                    }

                    *,
                    *::before,
                    *::after {
                        box-sizing: border-box;
                    }

                    /* =====================================================
                       ANIMATIONS
                    ====================================================== */

                    @keyframes slideUp {
                        from {
                            opacity: 0;
                            transform: translateY(24px);
                        }

                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }

                    @keyframes logoAppear {
                        from {
                            opacity: 0;
                            transform: scale(0.85) translateY(10px);
                        }

                        to {
                            opacity: 1;
                            transform: scale(1) translateY(0);
                        }
                    }

                    @keyframes shimmer {
                        0% {
                            transform: translateX(-150%);
                        }

                        100% {
                            transform: translateX(350%);
                        }
                    }

                    @keyframes borderGlow {
                        0%,
                        100% {
                            box-shadow:
                                0 0 0 0 rgba(255, 107, 81, 0);
                        }

                        50% {
                            box-shadow:
                                0 0 35px 0 rgba(255, 107, 81, 0.08);
                        }
                    }

                    @keyframes blink {
                        0%,
                        100% {
                            opacity: 0.35;
                        }

                        50% {
                            opacity: 1;
                        }
                    }

                    .login-card-animation {
                        animation:
                            slideUp 0.75s cubic-bezier(.22, 1, .36, 1) both,
                            borderGlow 5s ease-in-out infinite;
                    }

                    .login-content-animation {
                        animation:
                            slideUp 0.75s 0.1s cubic-bezier(.22, 1, .36, 1) both;
                    }

                    .login-logo-animation {
                        animation:
                            logoAppear 0.7s 0.15s cubic-bezier(.22, 1, .36, 1) both;
                    }

                    .login-dot {
                        animation: blink 2s ease-in-out infinite;
                    }

                    /* =====================================================
                       GOOGLE LOGIN RESPONSIVE
                    ====================================================== */

                    .google-wrapper {
                        width: 100%;
                        max-width: 100%;
                        min-width: 0;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        overflow: hidden;
                    }

                    .google-wrapper > div {
                        max-width: 100% !important;
                    }

                    .google-wrapper iframe {
                        max-width: 100% !important;
                    }

                    /* =====================================================
                       MOBILE
                    ====================================================== */

                    @media (max-width: 480px) {
                        .login-card {
                            border-radius: 18px !important;
                        }

                        .login-content {
                            padding: 28px 16px 22px !important;
                        }

                        .login-logo {
                            margin-bottom: 18px !important;
                        }

                        .login-title {
                            font-size: 28px !important;
                        }

                        .login-box {
                            padding: 15px !important;
                            border-radius: 16px !important;
                        }

                        .terms-text {
                            max-width: 290px !important;
                            font-size: 9px !important;
                        }
                    }

                    /* =====================================================
                       SMALL MOBILE
                    ====================================================== */

                    @media (max-width: 360px) {
                        .login-content {
                            padding-left: 12px !important;
                            padding-right: 12px !important;
                        }

                        .login-box {
                            padding: 13px !important;
                        }

                        .login-title {
                            font-size: 26px !important;
                        }

                        .google-wrapper {
                            transform: scale(0.96);
                            transform-origin: center;
                        }
                    }

                    /* =====================================================
                       SHORT SCREEN
                    ====================================================== */

                    @media (max-height: 720px) {
                        .login-content {
                            padding-top: 24px !important;
                            padding-bottom: 18px !important;
                        }

                        .login-logo {
                            margin-bottom: 14px !important;
                        }

                        .intro-section {
                            margin-bottom: 18px !important;
                        }

                        .terms-text {
                            margin-top: 14px !important;
                        }

                        .status-badge {
                            margin-top: 14px !important;
                        }
                    }

                    /* =====================================================
                       VERY SHORT SCREEN
                    ====================================================== */

                    @media (max-height: 600px) {
                        .login-page {
                            align-items: flex-start !important;
                            padding-top: 70px !important;
                            padding-bottom: 30px !important;
                        }
                    }

                    /* =====================================================
                       VERY LARGE DESKTOP
                    ====================================================== */

                    @media (min-width: 1600px) {
                        .login-card {
                            max-width: 530px !important;
                        }
                    }

                    /* =====================================================
                       REDUCED MOTION
                    ====================================================== */

                    @media (prefers-reduced-motion: reduce) {
                        *,
                        *::before,
                        *::after {
                            animation-duration: 0.01ms !important;
                            animation-iteration-count: 1 !important;
                            transition-duration: 0.01ms !important;
                        }
                    }
                `}
            </style>

            {/* =========================================================
                MAIN PAGE
                Uses fixed + inset-0 so this covers the true browser
                viewport and centers correctly no matter what width/
                margin/padding rules an ancestor (#root, body, a layout
                wrapper, etc.) happens to have.
            ========================================================= */}

            <main
                className="
                    fixed
                    inset-0
                    flex
                    items-center
                    justify-center
                    overflow-x-hidden
                    overflow-y-auto
                    bg-[#171112]
                    font-sans
                    text-white
                "
            >
                {/* =====================================================
                    BACK BUTTON
                ====================================================== */}

                <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="
                        group
                        fixed
                        left-3
                        top-3
                        z-50
                        flex
                        items-center
                        gap-2
                        rounded-lg
                        px-3
                        py-2
                        text-xs
                        font-medium
                        text-neutral-500
                        transition-all
                        duration-300
                        hover:bg-white/[0.04]
                        hover:text-white
                        sm:left-6
                        sm:top-6
                        md:left-8
                        md:top-7
                    "
                >
                    <span
                        className="
                            text-base
                            transition-transform
                            duration-300
                            group-hover:-translate-x-1
                        "
                    >
                        ←
                    </span>

                    <span>Back</span>
                </button>

                {/* =====================================================
                    CENTER CONTAINER
                ====================================================== */}

                <div
                    className="
                        login-page
                        flex
                        h-full
                        w-full
                        items-center
                        justify-center
                        overflow-y-auto
                        px-3
                        py-16
                        sm:px-6
                        sm:py-20
                        md:px-8
                    "
                >
                    {/* =================================================
                        RESPONSIVE CARD WIDTH
                    ================================================== */}

                    <div
                        className="
                            mx-auto
                            flex
                            w-full
                            max-w-[530px]
                            items-center
                            justify-center
                        "
                    >
                        {/* =================================================
                            LOGIN CARD
                        ================================================== */}

                        <section
                            onMouseMove={handleMouseMove}
                            onMouseEnter={() =>
                                setIsHovered(true)
                            }
                            onMouseLeave={() =>
                                setIsHovered(false)
                            }
                            className="
                                login-card
                                login-card-animation
                                relative
                                mx-auto
                                w-full
                                max-w-[530px]
                                overflow-hidden
                                rounded-[22px]
                                border
                                border-[#3a2928]
                                bg-[#211718]
                                shadow-[0_30px_90px_rgba(0,0,0,.60)]
                            "
                        >
                            {/* =================================================
                                MOUSE SPOTLIGHT
                            ================================================== */}

                            <div
                                className="
                                    pointer-events-none
                                    absolute
                                    inset-0
                                    z-10
                                    transition-opacity
                                    duration-500
                                "
                                style={{
                                    opacity: isHovered ? 1 : 0,
                                    background: `
                                        radial-gradient(
                                            350px circle at
                                            ${mousePos.x}px
                                            ${mousePos.y}px,
                                            rgba(255,107,81,.07),
                                            transparent 70%
                                        )
                                    `,
                                }}
                            />

                            {/* =================================================
                                TOP SHINE
                            ================================================== */}

                            <div
                                className="
                                    pointer-events-none
                                    absolute
                                    left-0
                                    right-0
                                    top-0
                                    z-20
                                    h-px
                                    overflow-hidden
                                    bg-gradient-to-r
                                    from-transparent
                                    via-[#ff6b51]/70
                                    to-transparent
                                "
                            >
                                <div
                                    className="
                                        h-full
                                        w-1/3
                                        bg-white/60
                                    "
                                    style={{
                                        animation:
                                            "shimmer 4s linear infinite",
                                    }}
                                />
                            </div>

                            {/* =================================================
                                CONTENT
                            ================================================== */}

                            <div
                                className="
                                    login-content
                                    login-content-animation
                                    relative
                                    z-20
                                    flex
                                    flex-col
                                    items-center
                                    px-5
                                    pb-6
                                    pt-8
                                    sm:px-8
                                    sm:pb-7
                                    sm:pt-10
                                    md:px-10
                                    md:pt-11
                                "
                            >
                                {/* =================================================
                                    LOGO
                                ================================================== */}

                                <div
                                    className="
                                        login-logo
                                        login-logo-animation
                                        mb-5
                                        flex
                                        flex-col
                                        items-center
                                        sm:mb-6
                                    "
                                >
                                    <div
                                        className="
                                            relative
                                            mb-4
                                            sm:mb-5
                                        "
                                    >
                                        <div
                                            className="
                                                pointer-events-none
                                                absolute
                                                -inset-3
                                                rounded-2xl
                                                bg-[#ff6b51]/10
                                                blur-xl
                                            "
                                        />

                                        <div
                                            className="
                                                relative
                                                flex
                                                h-12
                                                w-12
                                                items-center
                                                justify-center
                                                rounded-xl
                                                border
                                                border-[#49302d]
                                                bg-[#2a1b1d]
                                                shadow-[0_15px_45px_rgba(0,0,0,.45)]
                                                sm:h-14
                                                sm:w-14
                                            "
                                        >
                                            <svg
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                className="
                                                    h-6
                                                    w-6
                                                    text-[#ff6b51]
                                                    sm:h-7
                                                    sm:w-7
                                                "
                                            >
                                                <path
                                                    d="M8.5 8L5 12L8.5 16"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />

                                                <path
                                                    d="M15.5 8L19 12L15.5 16"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />

                                                <path
                                                    d="M13.5 5L10.5 19"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                />
                                            </svg>
                                        </div>
                                    </div>

                                    <h1
                                        className="
                                            login-title
                                            text-center
                                            text-[30px]
                                            font-black
                                            tracking-[-0.04em]
                                            text-white
                                            sm:text-3xl
                                            md:text-[35px]
                                        "
                                    >
                                        Timeout
                                    </h1>

                                    <p
                                        className="
                                            mt-2
                                            text-[8px]
                                            font-bold
                                            uppercase
                                            tracking-[0.35em]
                                            text-[#8c7775]
                                            sm:text-[9px]
                                            sm:tracking-[0.4em]
                                        "
                                    >
                                        Focus Workspace
                                    </p>
                                </div>

                                {/* =================================================
                                    INTRO
                                ================================================== */}

                                <div
                                    className="
                                        intro-section
                                        mb-6
                                        w-full
                                        text-center
                                        sm:mb-7
                                    "
                                >
                                    <h2
                                        className="
                                            text-lg
                                            font-semibold
                                            tracking-tight
                                            text-white
                                            sm:text-xl
                                        "
                                    >
                                        Welcome back
                                    </h2>

                                    <p
                                        className="
                                            mt-2
                                            px-2
                                            text-[11px]
                                            leading-5
                                            text-[#907e7c]
                                            sm:text-xs
                                        "
                                    >
                                        Sign in to continue to your
                                        workspace
                                    </p>
                                </div>

                                {/* =================================================
                                    LOGIN BOX
                                ================================================== */}

                                <div
                                    className="
                                        group
                                        relative
                                        flex
                                        w-full
                                        min-w-0
                                    "
                                >
                                    <div
                                        className="
                                            pointer-events-none
                                            absolute
                                            -inset-px
                                            rounded-2xl
                                            bg-gradient-to-r
                                            from-[#ff6b51]/20
                                            via-transparent
                                            to-[#ff846f]/10
                                            opacity-0
                                            blur
                                            transition
                                            duration-500
                                            group-hover:opacity-100
                                        "
                                    />

                                    <div
                                        className="
                                            login-box
                                            relative
                                            w-full
                                            min-w-0
                                            overflow-hidden
                                            rounded-2xl
                                            border
                                            border-[#392827]
                                            bg-[#191112]
                                            p-4
                                            shadow-[0_25px_70px_rgba(0,0,0,.4)]
                                            sm:p-5
                                            md:p-6
                                        "
                                    >
                                        {/* Top Line */}

                                        <div
                                            className="
                                                pointer-events-none
                                                absolute
                                                left-0
                                                right-0
                                                top-0
                                                h-px
                                                bg-gradient-to-r
                                                from-transparent
                                                via-[#ff6b51]/40
                                                to-transparent
                                            "
                                        />

                                        {/* Account Access */}

                                        <div
                                            className="
                                                mb-4
                                                text-center
                                                sm:mb-5
                                            "
                                        >
                                            <p
                                                className="
                                                    text-[9px]
                                                    font-bold
                                                    uppercase
                                                    tracking-[0.2em]
                                                    text-[#796967]
                                                    sm:text-[10px]
                                                "
                                            >
                                                Account access
                                            </p>
                                        </div>

                                        {/* =================================================
                                            GOOGLE LOGIN
                                        ================================================== */}

                                        <div
                                            className="
                                                google-wrapper
                                                min-h-[44px]
                                                w-full
                                            "
                                        >
                                            {!googleClientId ? (
                                                <div
                                                    className="
                                                        w-full
                                                        rounded-xl
                                                        border
                                                        border-red-900/40
                                                        bg-red-950/20
                                                        p-3
                                                        text-center
                                                        sm:p-4
                                                    "
                                                >
                                                    <p
                                                        className="
                                                            mb-1
                                                            text-xs
                                                            font-bold
                                                            text-red-400
                                                        "
                                                    >
                                                        Google Login
                                                        Configuration Error
                                                    </p>

                                                    <p
                                                        className="
                                                            text-[9px]
                                                            leading-5
                                                            text-red-400/80
                                                            sm:text-[10px]
                                                        "
                                                    >
                                                        VITE_GOOGLE_CLIENT_ID
                                                        is not loaded.
                                                        Check your .env
                                                        file and restart
                                                        Vite.
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
                                                    theme="filled_black"
                                                    shape="rectangular"
                                                    size="large"
                                                    width="320"
                                                    text="signin_with"
                                                    useOneTap={false}
                                                />
                                            )}
                                        </div>

                                        {/* =================================================
                                            LOADING
                                        ================================================== */}

                                        {isLoading && (
                                            <div
                                                className="
                                                    mt-4
                                                    flex
                                                    items-center
                                                    justify-center
                                                    gap-2
                                                    sm:mt-5
                                                "
                                            >
                                                <span
                                                    className="
                                                        h-3.5
                                                        w-3.5
                                                        animate-spin
                                                        rounded-full
                                                        border-2
                                                        border-[#493938]
                                                        border-t-[#ff6b51]
                                                    "
                                                />

                                                <p
                                                    className="
                                                        text-[10px]
                                                        font-medium
                                                        text-[#81706e]
                                                        sm:text-[11px]
                                                    "
                                                >
                                                    Signing you in...
                                                </p>
                                            </div>
                                        )}

                                        {/* =================================================
                                            SECURITY
                                        ================================================== */}

                                        <div
                                            className="
                                                mt-5
                                                flex
                                                items-center
                                                justify-center
                                                gap-2
                                                border-t
                                                border-[#302222]
                                                pt-4
                                                sm:mt-6
                                                sm:pt-5
                                            "
                                        >
                                            <svg
                                                viewBox="0 0 24 24"
                                                className="
                                                    h-3
                                                    w-3
                                                    shrink-0
                                                    text-[#655654]
                                                    sm:h-3.5
                                                    sm:w-3.5
                                                "
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.8"
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

                                            <span
                                                className="
                                                    text-center
                                                    text-[9px]
                                                    tracking-wide
                                                    text-[#665654]
                                                    sm:text-[10px]
                                                "
                                            >
                                                Secure passwordless
                                                authentication
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* =================================================
                                    TERMS
                                ================================================== */}

                                <p
                                    className="
                                        terms-text
                                        mt-5
                                        max-w-[310px]
                                        text-center
                                        text-[9px]
                                        leading-5
                                        text-[#665654]
                                        sm:mt-6
                                        sm:text-[10px]
                                    "
                                >
                                    By signing in, you agree to our{" "}
                                    <span
                                        className="
                                            cursor-pointer
                                            text-[#927b77]
                                            transition
                                            hover:text-[#ff806b]
                                        "
                                    >
                                        Terms of Service
                                    </span>{" "}
                                    and{" "}
                                    <span
                                        className="
                                            cursor-pointer
                                            text-[#927b77]
                                            transition
                                            hover:text-[#ff806b]
                                        "
                                    >
                                        Privacy Policy
                                    </span>
                                    .
                                </p>

                                {/* =================================================
                                    STATUS
                                ================================================== */}

                                <div
                                    className="
                                        status-badge
                                        mt-5
                                        flex
                                        items-center
                                        gap-2
                                        rounded-full
                                        border
                                        border-[#382827]
                                        bg-[#191112]
                                        px-3
                                        py-1.5
                                        sm:mt-6
                                    "
                                >
                                    <span
                                        className="
                                            login-dot
                                            h-1.5
                                            w-1.5
                                            shrink-0
                                            rounded-full
                                            bg-[#ff6b51]
                                        "
                                    />

                                    <span
                                        className="
                                            text-[7px]
                                            font-semibold
                                            uppercase
                                            tracking-[0.16em]
                                            text-[#756361]
                                            sm:text-[8px]
                                            sm:tracking-[0.18em]
                                        "
                                    >
                                        Workspace online
                                    </span>
                                </div>
                            </div>

                            {/* =================================================
                                FOOTER
                            ================================================== */}

                            <div
                                className="
                                    relative
                                    z-20
                                    border-t
                                    border-[#302222]
                                    px-4
                                    py-3
                                    text-center
                                    sm:px-5
                                    sm:py-4
                                "
                            >
                                <p
                                    className="
                                        text-[7px]
                                        uppercase
                                        tracking-[0.25em]
                                        text-[#554846]
                                        sm:text-[9px]
                                        sm:tracking-[0.3em]
                                    "
                                >
                                    © {new Date().getFullYear()} Timeout
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