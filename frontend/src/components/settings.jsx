import React from "react";
import { useTheme } from "../context/ThemeContext";
import { useOutletContext } from "react-router";

function Settings() {
  const {
    sidebarOpt,
    setSidebarOpt,
    outsideClick,
    setOutsideClick,
    timeDisplay,
    setTimeDisplay,
    timeFormat,
    setTimeFormat,
    textColor,
    setTextColor,
    showSeconds,
    setShowSeconds,
  } = useOutletContext();

  // =========================
  // GLOBAL THEME
  // =========================

  const { theme, setTheme } = useTheme();

  const isDark = theme === "dark";

  // =========================
  // HANDLERS
  // =========================

  const handleSidebar = (id) => {
    setSidebarOpt(id);
  };

  const handleTextColor = (id) => {
    setTextColor(id);
  };

  const handleTheme = (newTheme) => {
    setTheme(newTheme);
  };

  // =========================
  // THEME CLASSES
  // =========================

  const pageClass = isDark
    ? "bg-neutral-900 text-white"
    : "bg-neutral-50 text-neutral-900";

  const cardClass = isDark
    ? "bg-neutral-800/50 border-white/5"
    : "bg-white border-neutral-200";

  const innerCardClass = isDark
    ? "border-white/5"
    : "border-neutral-200";

  const mutedTextClass = isDark
    ? "text-neutral-500"
    : "text-neutral-600";

  const hoverClass = isDark
    ? "hover:bg-neutral-800"
    : "hover:bg-neutral-100";

  const dividerClass = isDark
    ? "border-white/5"
    : "border-neutral-200";

  return (
    <div
      className={`h-screen w-screen min-w-0 overflow-y-auto px-4 py-6 transition-colors duration-300 sm:px-6 lg:px-10 flex flex-col items-center ${pageClass}`}
      style={{
        scrollbarWidth: "thin",
        scrollbarColor: isDark
          ? "gray transparent"
          : "#a3a3a3 transparent",
      }}
    >
      <div className="w-full max-w-7xl min-w-0 flex flex-col gap-6">

        {/* ================= HEADER ================= */}

        <div
          className={`flex w-full min-w-0 flex-col gap-2 border-b pb-5 ${
            isDark ? "border-white/10" : "border-neutral-200"
          }`}
        >
          <h1
            className={`font-poppins text-3xl font-semibold tracking-normal sm:text-4xl ${
              isDark ? "text-white" : "text-neutral-900"
            }`}
          >
            Settings
          </h1>
        </div>

        {/* ================= SIDEBAR MODE ================= */}

        <div
          className={`w-full rounded-md py-5 px-4 border-2 justify-between flex flex-col gap-5 sm:px-6 xl:flex-row transition-colors duration-300 ${cardClass}`}
        >
          <div className="flex flex-col gap-2 xl:w-64 xl:shrink-0">
            <p className="font-poppins text-xl">
              Sidebar Mode
            </p>

            <p
              className={`font-poppins text-sm max-w-60 tracking-tight ${mutedTextClass}`}
            >
              Choose how you want to open and close the sidebar.
            </p>
          </div>

          <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">

            {/* MANUAL */}

            <div
              onClick={() => handleSidebar("manual")}
              className={`min-h-35 rounded-md border-2 cursor-pointer transition-all duration-200 p-4 flex gap-4 font-poppins justify-center ${
                sidebarOpt === "manual"
                  ? isDark
                    ? "border-white bg-neutral-800"
                    : "border-neutral-900 bg-neutral-100"
                  : isDark
                  ? "border-white/5"
                  : "border-neutral-200"
              } ${hoverClass}`}
            >
              <div>
                <div
                  className={`size-7 rounded-full border-2 flex items-center justify-center ${
                    sidebarOpt === "manual"
                      ? isDark
                        ? "border-white"
                        : "border-neutral-900"
                      : isDark
                      ? "border-neutral-700"
                      : "border-neutral-400"
                  }`}
                >
                  {sidebarOpt === "manual" && (
                    <div
                      className={`size-3 rounded-full ${
                        isDark
                          ? "bg-white"
                          : "bg-neutral-900"
                      }`}
                    />
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <p>Manual</p>

                <p
                  className={`text-sm tracking-tight ${mutedTextClass}`}
                >
                  Open and close the sidebar manually using the
                  toggle button.
                </p>
              </div>
            </div>

            {/* HOVER */}

            <div
              onClick={() => handleSidebar("hover")}
              className={`min-h-35 rounded-md border-2 cursor-pointer transition-all duration-200 p-4 flex gap-4 font-poppins justify-center ${
                sidebarOpt === "hover"
                  ? isDark
                    ? "border-white bg-neutral-800"
                    : "border-neutral-900 bg-neutral-100"
                  : isDark
                  ? "border-white/5"
                  : "border-neutral-200"
              } ${hoverClass}`}
            >
              <div>
                <div
                  className={`size-7 rounded-full border-2 flex items-center justify-center ${
                    sidebarOpt === "hover"
                      ? isDark
                        ? "border-white"
                        : "border-neutral-900"
                      : isDark
                      ? "border-neutral-700"
                      : "border-neutral-400"
                  }`}
                >
                  {sidebarOpt === "hover" && (
                    <div
                      className={`size-3 rounded-full ${
                        isDark
                          ? "bg-white"
                          : "bg-neutral-900"
                      }`}
                    />
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <p className="flex items-center gap-2">
                  Hover

                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ${
                      isDark
                        ? "bg-neutral-700 text-neutral-300"
                        : "bg-neutral-200 text-neutral-600"
                    }`}
                  >
                    Desktop
                  </span>
                </p>

                <p
                  className={`text-sm tracking-tight ${mutedTextClass}`}
                >
                  Hover on the left edge of the screen to open the
                  sidebar.
                </p>
              </div>
            </div>

            {/* MIX */}

            <div
              onClick={() => handleSidebar("mix")}
              className={`min-h-35 rounded-md border-2 cursor-pointer transition-all duration-200 p-4 flex gap-4 font-poppins justify-center sm:col-span-2 xl:col-span-1 ${
                sidebarOpt === "mix"
                  ? isDark
                    ? "border-white bg-neutral-800"
                    : "border-neutral-900 bg-neutral-100"
                  : isDark
                  ? "border-white/5"
                  : "border-neutral-200"
              } ${hoverClass}`}
            >
              <div>
                <div
                  className={`size-7 rounded-full border-2 flex items-center justify-center ${
                    sidebarOpt === "mix"
                      ? isDark
                        ? "border-white"
                        : "border-neutral-900"
                      : isDark
                      ? "border-neutral-700"
                      : "border-neutral-400"
                  }`}
                >
                  {sidebarOpt === "mix" && (
                    <div
                      className={`size-3 rounded-full ${
                        isDark
                          ? "bg-white"
                          : "bg-neutral-900"
                      }`}
                    />
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <p className="flex items-center gap-2">
                  Mix

                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ${
                      isDark
                        ? "bg-neutral-700 text-neutral-300"
                        : "bg-neutral-200 text-neutral-600"
                    }`}
                  >
                    Desktop
                  </span>
                </p>

                <p
                  className={`text-sm tracking-tight ${mutedTextClass}`}
                >
                  Use both hover to open and manual toggle to close.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* ================= SIDEBAR BEHAVIOR ================= */}

        <div
          className={`w-full rounded-md py-5 px-4 border-2 justify-between flex flex-col gap-5 sm:px-6 xl:flex-row transition-colors duration-300 ${cardClass}`}
        >
          <div className="flex flex-col gap-2 xl:w-64 xl:shrink-0">
            <p className="font-poppins text-xl">
              Sidebar Behavior
            </p>

            <p
              className={`font-poppins text-sm max-w-60 tracking-tight ${mutedTextClass}`}
            >
              Additional sidebar preferences.
            </p>
          </div>

          <div
            className={`rounded-md border-2 w-full min-w-0 flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5 ${innerCardClass}`}
          >
            <div className="flex min-w-0 flex-col gap-2">
              <p className="font-poppins">
                Close sidebar on outside click
              </p>

              <p
                className={`text-sm font-poppins tracking-tight ${mutedTextClass}`}
              >
                Click anywhere outside the sidebar to close it.
              </p>
            </div>

            <div
              onClick={() =>
                setOutsideClick(!outsideClick)
              }
            >
              <div
                className={`relative cursor-pointer rounded-full w-15 h-8 flex p-1 items-center transition-all duration-200 ${
                  outsideClick
                    ? isDark
                      ? "bg-white"
                      : "bg-neutral-900"
                    : "bg-neutral-700"
                }`}
              >
                <div
                  className={`absolute size-6 rounded-full top-1 transition-transform duration-300 ${
                    outsideClick
                      ? "translate-x-7 bg-white"
                      : "translate-x-0 bg-white"
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ================= TIME DISPLAY ================= */}

        <div
          className={`w-full rounded-md py-5 px-4 border-2 justify-between flex flex-col gap-5 sm:px-6 xl:flex-row transition-colors duration-300 ${cardClass}`}
        >
          <div className="flex flex-col gap-2 xl:w-64 xl:shrink-0">
            <p className="font-poppins text-xl">
              Time Display
            </p>

            <p
              className={`font-poppins text-sm max-w-60 tracking-tight ${mutedTextClass}`}
            >
              Choose how time is displayed across the app.
            </p>
          </div>

          <div
            className={`rounded-md border-2 w-full min-w-0 flex flex-col gap-2 items-center justify-between ${innerCardClass}`}
          >

            {/* CLOCK ORIENTATION */}

            <div className="w-full px-4 pt-4 pb-3 flex flex-col gap-4 justify-between sm:px-5 lg:flex-row lg:items-center">

              <div className="flex min-w-0 flex-col gap-1">
                <p className="font-poppins">
                  Clock Orientation
                </p>

                <p
                  className={`font-poppins text-sm ${mutedTextClass}`}
                >
                  Select the preferred time layout.
                </p>
              </div>

              <div className="grid w-full grid-cols-1 gap-3 font-poppins sm:grid-cols-2 lg:w-auto">

                {/* HORIZONTAL */}

                <div
                  onClick={() =>
                    setTimeDisplay(true)
                  }
                  className={`rounded-md flex justify-center items-center cursor-pointer transition-all duration-200 h-15 gap-3 px-4 lg:w-40 ${
                    timeDisplay
                      ? isDark
                        ? "bg-neutral-800/50 border-white border"
                        : "bg-neutral-100 border-neutral-900 border"
                      : `border-2 ${isDark ? "border-white/5" : "border-neutral-200"} ${hoverClass}`
                  }`}
                >
                  <div
                    className={`w-8 h-5 border-2 rounded-sm ${
                      isDark
                        ? "border-neutral-600"
                        : "border-neutral-400"
                    }`}
                  />

                  <p>Horizontal</p>
                </div>

                {/* VERTICAL */}

                <div
                  onClick={() =>
                    setTimeDisplay(false)
                  }
                  className={`rounded-md flex justify-center items-center cursor-pointer transition-all duration-200 h-15 gap-1.5 px-4 lg:w-40 ${
                    !timeDisplay
                      ? isDark
                        ? "bg-neutral-800/50 border-white border"
                        : "bg-neutral-100 border-neutral-900 border"
                      : `border-2 ${isDark ? "border-white/5" : "border-neutral-200"} ${hoverClass}`
                  }`}
                >
                  <div
                    className={`w-8 h-5 border-2 rounded-sm rotate-90 ${
                      isDark
                        ? "border-neutral-600"
                        : "border-neutral-400"
                    }`}
                  />

                  <p>Vertical</p>
                </div>

              </div>
            </div>

            <div
              className={`w-full border ${dividerClass}`}
            />

            {/* TIME FORMAT */}

            <div className="w-full px-4 py-3 flex flex-col gap-4 justify-between sm:px-5 lg:flex-row lg:items-center">

              <div className="flex min-w-0 flex-col gap-1">
                <p className="font-poppins">
                  Time Format
                </p>

                <p
                  className={`font-poppins text-sm ${mutedTextClass}`}
                >
                  Choose your preferred time format.
                </p>
              </div>

              <div className="grid w-full grid-cols-1 gap-3 font-poppins sm:grid-cols-2 lg:w-auto">

                {/* 12 HOUR */}

                <div
                  onClick={() =>
                    setTimeFormat(true)
                  }
                  className={`rounded-md flex justify-around px-5 items-center cursor-pointer transition-all duration-200 min-h-15 gap-3 lg:w-40 ${
                    timeFormat
                      ? isDark
                        ? "bg-neutral-800/50 border-white border"
                        : "bg-neutral-100 border-neutral-900 border"
                      : `border-2 ${isDark ? "border-white/5" : "border-neutral-200"} ${hoverClass}`
                  }`}
                >
                  <div
                    className={`size-7 rounded-full border-2 flex items-center justify-center ${
                      timeFormat
                        ? isDark
                          ? "border-white"
                          : "border-neutral-900"
                        : isDark
                        ? "border-neutral-700"
                        : "border-neutral-400"
                    }`}
                  >
                    {timeFormat && (
                      <div
                        className={`size-3 rounded-full ${
                          isDark
                            ? "bg-white"
                            : "bg-neutral-900"
                        }`}
                      />
                    )}
                  </div>

                  <div>
                    <p>12 Hour</p>
                    <p
                      className={`text-sm ${mutedTextClass}`}
                    >
                      AM/PM
                    </p>
                  </div>
                </div>

                {/* 24 HOUR */}

                <div
                  onClick={() =>
                    setTimeFormat(false)
                  }
                  className={`rounded-md flex justify-around px-5 items-center cursor-pointer transition-all duration-200 min-h-15 gap-1.5 lg:w-40 ${
                    !timeFormat
                      ? isDark
                        ? "bg-neutral-800/50 border-white border"
                        : "bg-neutral-100 border-neutral-900 border"
                      : `border-2 ${isDark ? "border-white/5" : "border-neutral-200"} ${hoverClass}`
                  }`}
                >
                  <div
                    className={`size-7 rounded-full border-2 flex items-center justify-center ${
                      !timeFormat
                        ? isDark
                          ? "border-white"
                          : "border-neutral-900"
                        : isDark
                        ? "border-neutral-700"
                        : "border-neutral-400"
                    }`}
                  >
                    {!timeFormat && (
                      <div
                        className={`size-3 rounded-full ${
                          isDark
                            ? "bg-white"
                            : "bg-neutral-900"
                        }`}
                      />
                    )}
                  </div>

                  <div>
                    <p>24 Hour</p>

                    <p
                      className={`text-sm ${mutedTextClass}`}
                    >
                      13:45
                    </p>
                  </div>
                </div>

              </div>
            </div>

            <div
              className={`w-full border ${dividerClass}`}
            />

            {/* SHOW SECONDS */}

            <div className="rounded-md w-full flex flex-col gap-4 justify-between px-4 py-4 sm:px-5 sm:flex-row sm:items-center">

              <div className="flex min-w-0 flex-col gap-2">
                <p className="font-poppins">
                  Show Seconds
                </p>

                <p
                  className={`text-sm font-poppins tracking-tight ${mutedTextClass}`}
                >
                  Include seconds in the clock display.
                  (Horizontal mode only)
                </p>
              </div>

              <div
                onClick={() =>
                  setShowSeconds(!showSeconds)
                }
              >
                <div
                  className={`relative cursor-pointer rounded-full w-15 h-8 flex p-1 items-center transition-all ${
                    showSeconds
                      ? isDark
                        ? "bg-white"
                        : "bg-neutral-900"
                      : "bg-neutral-700"
                  }`}
                >
                  <div
                    className={`absolute size-6 rounded-full top-1 transition-transform duration-300 ${
                      showSeconds
                        ? "translate-x-7 bg-white"
                        : "translate-x-0 bg-white"
                    }`}
                  />
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ================= FULLSCREEN ================= */}

        <div
          className={`w-full rounded-md py-5 px-4 border-2 justify-between flex flex-col gap-5 sm:px-6 xl:flex-row transition-colors duration-300 ${cardClass}`}
        >
          <div className="flex flex-col gap-2 xl:w-64 xl:shrink-0">
            <p className="font-poppins text-xl">
              Fullscreen Mode
            </p>

            <p
              className={`font-poppins text-sm max-w-60 tracking-tight ${mutedTextClass}`}
            >
              Toggle the app's full screen state.
            </p>
          </div>

          <div
            className={`rounded-md border-2 w-full flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5 ${innerCardClass}`}
          >
            <div className="flex flex-col gap-2">
              <p className="font-poppins flex items-center gap-2">
                Fullscreen Shortcut

                <span
                  className={`px-2 py-0.5 rounded-full text-xs ${
                    isDark
                      ? "bg-neutral-700 text-neutral-300"
                      : "bg-neutral-200 text-neutral-600"
                  }`}
                >
                  Desktop
                </span>
              </p>

              <p
                className={`text-sm font-poppins tracking-tight ${mutedTextClass}`}
              >
                Press the{" "}
                <kbd
                  className={`px-1.5 py-0.5 rounded border font-mono text-xs ${
                    isDark
                      ? "bg-neutral-700 border-neutral-600 text-white"
                      : "bg-neutral-100 border-neutral-300 text-neutral-900"
                  }`}
                >
                  F
                </kbd>{" "}
                key on your keyboard to enter or exit fullscreen.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                if (!document.fullscreenElement) {
                  document.documentElement
                    .requestFullscreen()
                    .catch((err) => {
                      console.error(
                        "Error attempting to enable fullscreen mode:",
                        err
                      );
                    });
                } else {
                  document.exitFullscreen();
                }
              }}
              className={`px-4 py-2 font-poppins font-medium rounded-md transition-colors cursor-pointer ${
                isDark
                  ? "bg-white text-black hover:bg-neutral-200"
                  : "bg-neutral-900 text-white hover:bg-neutral-700"
              }`}
            >
              Toggle Fullscreen
            </button>
          </div>
        </div>

        {/* ================= APPEARANCE ================= */}

        <div
          className={`w-full rounded-md py-5 px-4 border-2 justify-between flex flex-col gap-5 sm:px-6 xl:flex-row transition-colors duration-300 ${cardClass}`}
        >
          <div className="flex flex-col gap-2 xl:w-64 xl:shrink-0">
            <p className="font-poppins text-xl">
              Appearance
            </p>

            <p
              className={`font-poppins text-sm max-w-55 tracking-tight ${mutedTextClass}`}
            >
              Customize the look and feel of the app.
            </p>
          </div>

          <div
            className={`rounded-md border-2 w-full min-w-0 flex flex-col ${innerCardClass}`}
          >

            {/* ================= THEME ================= */}

            <div className="w-full px-4 py-4 flex flex-col gap-5 justify-between sm:px-5 lg:flex-row lg:items-center">

              <div className="flex flex-col gap-1">
                <p className="font-poppins">
                  Theme
                </p>

                <p
                  className={`font-poppins text-sm ${mutedTextClass}`}
                >
                  Choose between light and dark mode.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 font-poppins w-full sm:w-auto">

                {/* DARK BUTTON */}

                <button
                  type="button"
                  onClick={() => handleTheme("dark")}
                  className={`h-12 min-w-28 rounded-md border px-5 cursor-pointer transition-all duration-200 ${
                    theme === "dark"
                      ? "bg-neutral-900 border-white text-white shadow-md"
                      : "bg-white border-neutral-300 text-neutral-900 hover:bg-neutral-100"
                  }`}
                >
                   Dark
                </button>

                {/* LIGHT BUTTON */}

                <button
                  type="button"
                  onClick={() => handleTheme("light")}
                  className={`h-12 min-w-28 rounded-md border px-5 cursor-pointer transition-all duration-200 ${
                    theme === "light"
                      ? "bg-white border-neutral-900 text-neutral-900 shadow-md"
                      : "bg-neutral-800 border-neutral-700 text-white hover:bg-neutral-700"
                  }`}
                >
                   Light
                </button>

              </div>
            </div>

            <div
              className={`w-full border ${dividerClass}`}
            />

            {/* ================= TEXT COLOR ================= */}

            <div className="w-full px-4 py-4 flex flex-col gap-5 justify-between sm:px-5 lg:flex-row lg:items-center">

              <div className="flex flex-col gap-1">
                <p className="font-poppins">
                  Text Color
                </p>

                <p
                  className={`font-poppins text-sm ${mutedTextClass}`}
                >
                  Adjust the text color for better readability.
                </p>
              </div>

              <div className="flex flex-wrap gap-4 items-center sm:gap-6">

                {/* WHITE */}

                <div
                  onClick={() =>
                    handleTextColor("white")
                  }
                  className={`rounded-full size-9 cursor-pointer bg-white transition-all ${
                    textColor === "white"
                      ? "ring-2 ring-white ring-offset-2 ring-offset-neutral-900"
                      : ""
                  }`}
                />

                {/* GOLD */}

                <div
                  onClick={() =>
                    handleTextColor("gold")
                  }
                  className={`rounded-full size-9 cursor-pointer bg-[#F4C95D] ${
                    textColor === "gold"
                      ? "ring-2 ring-[#F4C95D] ring-offset-2 ring-offset-neutral-900"
                      : ""
                  }`}
                />

                {/* CORAL */}

                <div
                  onClick={() =>
                    handleTextColor("coral")
                  }
                  className={`rounded-full size-9 cursor-pointer bg-[#FF7A90] ${
                    textColor === "coral"
                      ? "ring-2 ring-[#FF7A90] ring-offset-2 ring-offset-neutral-900"
                      : ""
                  }`}
                />

                {/* BLUE */}

                <div
                  onClick={() =>
                    handleTextColor("blue")
                  }
                  className={`rounded-full size-9 cursor-pointer bg-[#7DD3FC] ${
                    textColor === "blue"
                      ? "ring-2 ring-[#7DD3FC] ring-offset-2 ring-offset-neutral-900"
                      : ""
                  }`}
                />

                {/* MINT */}

                <div
                  onClick={() =>
                    handleTextColor("mint")
                  }
                  className={`rounded-full size-9 cursor-pointer bg-[#6EE7B7] ${
                    textColor === "mint"
                      ? "ring-2 ring-[#6EE7B7] ring-offset-2 ring-offset-neutral-900"
                      : ""
                  }`}
                />

                {/* PURPLE */}

                <div
                  onClick={() =>
                    handleTextColor("purple")
                  }
                  className={`rounded-full size-9 cursor-pointer bg-[#A78BFA] ${
                    textColor === "purple"
                      ? "ring-2 ring-[#A78BFA] ring-offset-2 ring-offset-neutral-900"
                      : ""
                  }`}
                />

                {/* PEACH */}

                <div
                  onClick={() =>
                    handleTextColor("peach")
                  }
                  className={`rounded-full size-9 cursor-pointer bg-[#FDBA74] ${
                    textColor === "peach"
                      ? "ring-2 ring-[#FDBA74] ring-offset-2 ring-offset-neutral-900"
                      : ""
                  }`}
                />

                {/* LIME */}

                <div
                  onClick={() =>
                    handleTextColor("lime")
                  }
                  className={`rounded-full size-9 cursor-pointer bg-lime-300 ${
                    textColor === "lime"
                      ? "ring-2 ring-lime-300 ring-offset-2 ring-offset-neutral-900"
                      : ""
                  }`}
                />

                {/* CUSTOM COLOR */}

                <div className="relative size-9">

                  <input
                    type="color"
                    value={
                      textColor?.startsWith("#")
                        ? textColor
                        : "#ffffff"
                    }
                    onChange={(e) =>
                      handleTextColor(
                        e.target.value
                      )
                    }
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                  />

                  <div
                    className="rounded-full size-9 border-2 border-dashed flex items-center justify-center cursor-pointer"
                    style={{
                      backgroundColor:
                        textColor?.startsWith("#")
                          ? textColor
                          : "transparent",

                      borderColor:
                        textColor?.startsWith("#")
                          ? textColor
                          : isDark
                          ? "rgba(255,255,255,0.4)"
                          : "rgba(0,0,0,0.3)",
                    }}
                  >
                    {!textColor?.startsWith("#") && (
                      <span
                        className={`text-xl ${
                          isDark
                            ? "text-white/60"
                            : "text-neutral-500"
                        }`}
                      >
                        +
                      </span>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        <div className="h-10 w-full" />

      </div>
    </div>
  );
}

export default Settings;