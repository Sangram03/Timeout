import React, { useEffect, useState, useRef } from "react";
import { HiOutlineHome } from "react-icons/hi2";
import { FaRegChartBar } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { Link, useLocation } from "react-router";
import { MdOutlineAccountCircle } from "react-icons/md";
import { MdOutlineLeaderboard } from "react-icons/md";

import { TbLayoutSidebarRightCollapseFilled } from "react-icons/tb";
import { TbLayoutSidebarLeftCollapseFilled } from "react-icons/tb";
import { FaRegDotCircle } from "react-icons/fa";
import { MdOutlineHourglassEmpty } from "react-icons/md";
import { PiSignOutBold } from "react-icons/pi";

import axios from "axios";
import toast from "react-hot-toast";

import { useTheme } from "../context/ThemeContext";

function Sidebar({ sidebarOpt, outsideClick }) {
  const [sidebar, setSidebar] = useState(true);
  const { pathname } = useLocation();
  const [user, setUser] = useState(null);

  // =========================
  // GLOBAL THEME
  // =========================

  const { theme } = useTheme();

  const isDark = theme === "dark";

  // =========================
  // THEME CLASSES
  // =========================

  const sidebarBackground = isDark
    ? "bg-neutral-900/98"
    : "bg-white";

  const sidebarText = isDark
    ? "text-neutral-400"
    : "text-neutral-600";

  const sidebarBorder = isDark
    ? "border-neutral-700/40"
    : "border-neutral-200";

  const headerBorder = isDark
    ? "border-neutral-700/40"
    : "border-neutral-200";

  const hoverBackground = isDark
    ? "hover:bg-neutral-700/40"
    : "hover:bg-neutral-100";

  const activeBackground = isDark
    ? "bg-neutral-700/40"
    : "bg-neutral-100";

  const activeText = isDark
    ? "text-white"
    : "text-neutral-900";

  const inactiveText = isDark
    ? "text-neutral-500"
    : "text-neutral-500";

  const toggleText = isDark
    ? "text-neutral-400"
    : "text-neutral-600";

  const toggleHoverText = isDark
    ? "hover:text-white"
    : "hover:text-neutral-900";

  const profileBackground = isDark
    ? "bg-neutral-800/65"
    : "bg-neutral-100";

  const profileBorder = isDark
    ? "border-white/5"
    : "border-neutral-200";

  const profileName = isDark
    ? "text-white"
    : "text-neutral-900";

  const profileSecondary = isDark
    ? "text-neutral-500"
    : "text-neutral-500";

  // =========================
  // FETCH USER
  // =========================

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        if (token) {
          const res = await axios.get("/api/user/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (res.data?.success) {
            setUser(res.data.user);
          }
        }
      } catch (err) {
        console.error(
          "Failed to fetch user in sidebar",
          err
        );
      }
    };

    fetchUser();

    const handleProfileUpdate = (e) => {
      if (e.detail) {
        setUser((prev) => ({
          ...prev,
          ...e.detail,
        }));
      }
    };

    window.addEventListener(
      "profileUpdated",
      handleProfileUpdate
    );

    return () =>
      window.removeEventListener(
        "profileUpdated",
        handleProfileUpdate
      );
  }, []);

  // =========================
  // ACTIVE ROUTE
  // =========================

  const isActive = (path) => {
    if (path === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(path);
  };

  // =========================
  // SIDEBAR TOGGLE
  // =========================

  const handleSidebar = () => {
    setSidebar(!sidebar);
  };

  // =========================
  // RESPONSIVE SIDEBAR
  // =========================

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebar(false);
      } else {
        setSidebar(true);
      }
    };

    handleResize();

    window.addEventListener(
      "resize",
      handleResize
    );

    return () =>
      window.removeEventListener(
        "resize",
        handleResize
      );
  }, []);

  // =========================
  // LOGOUT
  // =========================

  const logoutHandler = async () => {
    try {
      const res = await axios.post(
        "/api/user/logout"
      );

      if (res?.data?.success) {
        localStorage.removeItem("token");

        toast.success(res?.data?.msg);
      }
    } catch (err) {
      console.log(
        "error while logout frontend: ",
        err
      );

      toast.error(
        err.response?.data?.msg
      );
    }
  };

  // =========================
  // SIDEBAR REF
  // =========================

  const sidebarRef = useRef(null);

  // =========================
  // OUTSIDE CLICK
  // =========================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        outsideClick &&
        sidebar &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        setSidebar(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, [sidebar, outsideClick]);

  // =========================
  // SIDEBAR MODE
  // =========================

  useEffect(() => {
    if (sidebarOpt === "hover") {
      setSidebar(false);
    }

    if (sidebarOpt === "manual") {
      setSidebar(true);
    }
  }, [sidebarOpt]);

  // =========================
  // HOVER MODE
  // =========================

  const timeoutRef = useRef(null);

  const handleLeave = () => {
    if (sidebarOpt === "hover") {
      timeoutRef.current = setTimeout(() => {
        setSidebar(false);
      }, 300);
    }
  };

  const handleEnter = () => {
    clearTimeout(timeoutRef.current);
  };

  // =========================
  // RENDER
  // =========================

  return (
    <div>
      {/* =========================================
          LEFT HOVER AREA
      ========================================= */}

      <div
        className="fixed left-0 top-0 h-screen w-6 z-40"
        onMouseEnter={() => {
          if (
            sidebarOpt === "hover" ||
            sidebarOpt === "mix"
          ) {
            setSidebar(true);
          }
        }}
      />

      {/* =========================================
          SIDEBAR TOGGLE BUTTON
      ========================================= */}

      <div
        onClick={handleSidebar}
        className={`
          cursor-pointer
          group
          absolute
          z-60
          mt-5.5
          transition-all
          duration-300
          ${toggleText}
          ${toggleHoverText}
          ${sidebar ? "ml-50" : "ml-5"}
        `}
      >
        {sidebar ? (
          <TbLayoutSidebarLeftCollapseFilled
            className={`
              text-2xl
              transition-all
              duration-100
              ${toggleHoverText}
            `}
          />
        ) : (
          <TbLayoutSidebarRightCollapseFilled
            className={`
              text-2xl
              transition-all
              duration-100
              ${toggleHoverText}
            `}
          />
        )}
      </div>

      {/* =========================================
          SIDEBAR
      ========================================= */}

      <div
        ref={sidebarRef}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        className={`
          ${sidebar
            ? "translate-x-0"
            : "-translate-x-full"
          }

          transition-transform
          duration-300

          h-screen
          w-60

          ${sidebarBackground}
          ${sidebarText}

          px-3
          py-5

          flex
          flex-col

          border-r
          ${sidebarBorder}

          fixed
          left-0
          top-0
          z-50

          border-y-0
          border-l-0

          transition-colors
          duration-300
        `}
      >
        {/* =========================================
            LOGO / HEADER
        ========================================= */}

        <div
          className={`
            flex
            justify-between
            items-center
            w-full

            border-b
            ${headerBorder}

            pb-3
            px-3
          `}
        >
          <p
            className={`
              text-xl
              font-gothic
              tracking-wide
              ${isDark
                ? "text-white"
                : "text-neutral-900"
              }
            `}
          >
            Timmo
          </p>
        </div>

        {/* =========================================
            MAIN NAVIGATION
        ========================================= */}

        <Link to="/clock">
          <div
            className={`
              rounded-lg
              h-10
              p-2
              px-3
              mt-5
              cursor-pointer
              active:scale-99
              transition-all
              duration-100

              ${hoverBackground}

              font-gothic
              flex
              items-center
              gap-2
              group

              ${isActive("/clock")
                ? activeBackground
                : ""
              }
            `}
          >
            <HiOutlineHome
              className={`
                text-xl
                transition-all
                duration-100

                ${isActive("/clock")
                  ? activeText
                  : inactiveText
                }
              `}
            />

            <p
              className={`
                font-poppins
                transition-all
                duration-100

                ${isActive("/clock")
                  ? activeText
                  : inactiveText
                }
              `}
            >
              Clock
            </p>
          </div>
        </Link>

        {/* =========================================
            STOPWATCH
        ========================================= */}

        <Link to="/stopwatch">
          <div
            className={`
              rounded-lg
              h-10
              p-2
              px-3
              mt-2
              cursor-pointer
              active:scale-99
              transition-all
              duration-100

              ${hoverBackground}

              font-gothic
              flex
              items-center
              gap-2
              group

              ${isActive("/stopwatch")
                ? activeBackground
                : ""
              }
            `}
          >
            <FaRegDotCircle
              className={`
                text-lg
                transition-all
                duration-100

                ${isActive("/stopwatch")
                  ? activeText
                  : inactiveText
                }
              `}
            />

            <p
              className={`
                font-poppins
                transition-all
                duration-100

                ${isActive("/stopwatch")
                  ? activeText
                  : inactiveText
                }
              `}
            >
              Stopwatch
            </p>
          </div>
        </Link>

        {/* =========================================
            COUNTDOWN
        ========================================= */}

        <Link to="/countdown">
          <div
            className={`
              rounded-lg
              h-10
              p-2
              px-3
              mt-2
              -mb-3
              cursor-pointer
              active:scale-99
              transition-all
              duration-100

              ${hoverBackground}

              font-gothic
              flex
              items-center
              gap-2
              group

              ${isActive("/countdown")
                ? activeBackground
                : ""
              }
            `}
          >
            <MdOutlineHourglassEmpty
              className={`
                text-xl
                transition-all
                duration-100

                ${isActive("/countdown")
                  ? activeText
                  : inactiveText
                }
              `}
            />

            <p
              className={`
                font-poppins
                transition-all
                duration-100

                ${isActive("/countdown")
                  ? activeText
                  : inactiveText
                }
              `}
            >
              Countdown
            </p>
          </div>
        </Link>

        {/* =========================================
            SECONDARY NAVIGATION
        ========================================= */}

        <div
          className={`
            border-t
            ${headerBorder}

            border-x-0
            border-b-0

            mt-8
          `}
        >
          {/* =========================================
              ANALYTICS
          ========================================= */}

          <Link to="/analytics">
            <div
              className={`
                rounded-lg
                h-10

                ${hoverBackground}

                p-2
                px-3
                mt-5

                cursor-pointer
                active:scale-99
                transition-all
                duration-100

                font-gothic
                flex
                items-center
                gap-2
                group

                ${isActive("/analytics")
                  ? activeBackground
                  : ""
                }
              `}
            >
              <FaRegChartBar
                className={`
                  text-lg
                  transition-all
                  duration-100

                  ${isActive("/analytics")
                    ? activeText
                    : inactiveText
                  }
                `}
              />

              <p
                className={`
                  font-poppins
                  transition-all
                  duration-100

                  ${isActive("/analytics")
                    ? activeText
                    : inactiveText
                  }
                `}
              >
                Analytics
              </p>
            </div>
          </Link>

          {/* =========================================
              LEADERBOARD
          ========================================= */}

          <Link to="/leaderboard">
            <div
              className={`
                rounded-lg
                h-10

                ${hoverBackground}

                p-2
                px-3

                cursor-pointer
                active:scale-99
                transition-all
                duration-100

                font-gothic
                flex
                items-center
                gap-2
                group

                mt-2

                ${isActive("/leaderboard")
                  ? activeBackground
                  : ""
                }
              `}
            >
              <MdOutlineLeaderboard
                className={`
                  text-xl
                  transition-all
                  duration-100

                  ${isActive("/leaderboard")
                    ? activeText
                    : inactiveText
                  }
                `}
              />

              <p
                className={`
                  font-poppins
                  transition-all
                  duration-100

                  ${isActive("/leaderboard")
                    ? activeText
                    : inactiveText
                  }
                `}
              >
                Leaderboard
              </p>
            </div>
          </Link>

          {/* =========================================
              PROFILE
          ========================================= */}

          <Link to="/profile">
            <div
              className={`
                rounded-lg
                h-10

                ${hoverBackground}

                p-2
                px-3
                mt-2

                cursor-pointer
                active:scale-99
                transition-all
                duration-100

                font-gothic
                flex
                items-center
                gap-2
                group

                ${isActive("/profile")
                  ? activeBackground
                  : ""
                }
              `}
            >
              <MdOutlineAccountCircle
                className={`
                  text-2xl
                  transition-all
                  duration-100

                  ${isActive("/profile")
                    ? activeText
                    : inactiveText
                  }
                `}
              />

              <p
                className={`
                  font-poppins
                  transition-all
                  duration-100

                  ${isActive("/profile")
                    ? activeText
                    : inactiveText
                  }
                `}
              >
                Profile
              </p>
            </div>
          </Link>

          {/* =========================================
              SETTINGS
          ========================================= */}

          <Link to="/settings">
            <div
              className={`
                rounded-lg
                h-10

                ${hoverBackground}

                p-2
                px-3
                mt-2

                cursor-pointer
                active:scale-99
                transition-all
                duration-100

                font-gothic
                flex
                items-center
                gap-2
                group

                ${isActive("/settings")
                  ? activeBackground
                  : ""
                }
              `}
            >
              <IoSettingsOutline
                className={`
                  text-xl
                  transition-all
                  duration-100

                  ${isActive("/settings")
                    ? activeText
                    : inactiveText
                  }
                `}
              />

              <p
                className={`
                  font-poppins
                  transition-all
                  duration-100

                  ${isActive("/settings")
                    ? activeText
                    : inactiveText
                  }
                `}
              >
                Settings
              </p>
            </div>
          </Link>
        </div>

        {/* =========================================
            USER PROFILE / LOGOUT
        ========================================= */}

        {user ? (
          <div
            className={`
              rounded-lg
              w-54

              ${profileBackground}
              ${profileBorder}

              overflow-hidden
              mt-auto

              px-3
              py-2

              flex
              items-center
              justify-between
              gap-2

              shadow-inner

              transition-colors
              duration-300
            `}
          >
            <Link
              to="/profile"
              className="
                flex
                items-center
                gap-2
                min-w-0
                flex-1

                hover:opacity-85
                transition-opacity
              "
            >
              {/* USER IMAGE */}

              {user.picture ? (
                <img
                  src={user.picture}
                  alt={user.name}
                  className={`
                    size-8
                    rounded-full
                    object-cover

                    border

                    ${isDark
                      ? "border-white/10"
                      : "border-neutral-300"
                    }
                  `}
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div
                  className={`
                    size-8
                    rounded-full

                    ${isDark
                      ? "bg-neutral-700"
                      : "bg-neutral-200"
                    }

                    ${isDark
                      ? "text-white"
                      : "text-neutral-900"
                    }

                    font-bold
                    flex
                    items-center
                    justify-center
                    text-sm
                  `}
                >
                  {user.name
                    ? user.name[0].toUpperCase()
                    : "?"}
                </div>
              )}

              {/* USER INFORMATION */}

              <div className="flex flex-col min-w-0">
                <p
                  className={`
                    text-xs
                    font-semibold
                    truncate
                    leading-snug
                    ${profileName}
                  `}
                >
                  {user.name}
                </p>

                <p
                  className={`
                    text-[9px]
                    truncate
                    leading-none
                    ${profileSecondary}
                  `}
                >
                  View Profile
                </p>
              </div>
            </Link>

            {/* LOGOUT */}

            <Link
              to="/login"
              onClick={logoutHandler}
              title="Sign Out"
              className="
                text-neutral-500
                hover:text-red-400
                transition-colors
                p-1
              "
            >
              <PiSignOutBold className="text-lg" />
            </Link>
          </div>
        ) : (
          <div
            className={`
              rounded-lg
              w-54

              ${profileBackground}
              ${profileBorder}

              overflow-hidden
              mt-auto

              px-3
              py-2

              flex
              items-center
              justify-between
              gap-2

              shadow-inner

              transition-colors
              duration-300
            `}
          >
            <Link
              to="/login"
              onClick={logoutHandler}
              className={`
                flex
                gap-2
                items-center

                ${hoverBackground}

                rounded
                px-2
                py-1.5

                transition-all
                duration-100

                w-full
                cursor-pointer
              `}
            >
              <PiSignOutBold
                className={`
                  text-lg
                  ${inactiveText}
                `}
              />

              <p
                className={`
                  text-xs
                  font-semibold
                  ${inactiveText}
                `}
              >
                Sign Out
              </p>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
