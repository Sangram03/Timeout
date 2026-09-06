import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { id: "home", label: "Home" },
  { id: "stats", label: "Stats" },
  { id: "features", label: "Features" },
  { id: "preview", label: "Preview" },
  { id: "about", label: "About" },
];

const Navbar = () => {
  const [isLoggedIn] = useState(
    () => !!localStorage.getItem("token")
  );

  const [active, setActive] = useState("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const visible = new Map();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visible.set(entry.target.id, entry.isIntersecting);
        });

        const activeId = NAV_LINKS
          .map(({ id }) => ({
            id,
            el: document.getElementById(id),
          }))
          .filter(({ id, el }) => el && visible.get(id))
          .sort(
            (a, b) =>
              a.el.getBoundingClientRect().top -
              b.el.getBoundingClientRect().top
          )
          .map(({ id }) => id)[0];

        if (activeId) {
          setActive(activeId);
        }
      },
      {
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    const sections = NAV_LINKS
      .map(({ id }) => document.getElementById(id))
      .filter(Boolean);

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const handleNavigation = (id) => {
    setActive(id);
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed inset-x-0 top-4 z-50 flex justify-center px-3 sm:top-7 sm:px-4">
      <nav
        className="
          relative flex h-14 w-full max-w-[420px] items-center
          justify-between rounded-full
          border border-red-200/70
          bg-white/75 px-3
          text-black
          shadow-[0_15px_45px_rgba(220,38,38,0.12)]
          backdrop-blur-2xl
          transition-all duration-300
          hover:border-red-300/80
          sm:h-16 sm:max-w-[760px] sm:px-5
        "
      >
        {/* Logo */}
        <Link
          to="/"
          onClick={() => setIsMenuOpen(false)}
          className="
            group flex items-center gap-2
            text-lg font-black tracking-tight
            sm:text-xl
          "
        >
          <span
            className="
              flex size-8 items-center justify-center
              rounded-full
              bg-gradient-to-br from-red-500
              via-red-600 to-rose-700
              text-sm font-black text-white
              shadow-lg shadow-red-500/30
              transition-transform duration-300
              group-hover:scale-110
            "
          >
            T
          </span>

          <span className="hidden sm:block">
            Timeout
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center justify-center gap-1 sm:flex">
          {NAV_LINKS.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={() => handleNavigation(id)}
              className={`
                relative rounded-full
                px-3 py-2
                text-xs font-bold
                tracking-wide
                transition-all duration-300
                md:px-3.5 md:text-sm
                ${
                  active === id
                    ? `
                      bg-gradient-to-r
                      from-red-500
                      to-rose-600
                      text-white
                      shadow-lg
                      shadow-red-500/25
                    `
                    : `
                      text-neutral-600
                      hover:bg-red-50
                      hover:text-red-600
                    `
                }
              `}
            >
              {label}

              {/* Active indicator */}
              {active === id && (
                <span
                  className="
                    absolute -bottom-0.5
                    left-1/2
                    h-0.5 w-3
                    -translate-x-1/2
                    rounded-full
                    bg-white/90
                  "
                />
              )}
            </a>
          ))}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          {/* Login / Dashboard */}
          <Link
            to={isLoggedIn ? "/clock" : "/login"}
            className="
              rounded-full
              bg-black
              px-4 py-2.5
              text-xs font-bold
              text-white
              shadow-md
              transition-all duration-300
              hover:bg-red-600
              hover:shadow-lg
              hover:shadow-red-500/25
              active:scale-95
              sm:px-5 sm:text-sm
            "
          >
            {isLoggedIn ? "Dashboard" : "Login"}
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            aria-label={
              isMenuOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={isMenuOpen}
            onClick={() =>
              setIsMenuOpen((open) => !open)
            }
            className="
              flex size-10
              items-center justify-center
              rounded-full
              border border-red-100
              bg-red-50/80
              text-red-600
              transition-all duration-300
              hover:border-red-200
              hover:bg-red-100
              hover:text-red-700
              active:scale-90
              sm:hidden
            "
          >
            {isMenuOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div
            className="
              absolute
              left-0 right-0
              top-[calc(100%+10px)]
              overflow-hidden
              rounded-[28px]
              border border-red-100
              bg-white/95
              p-2
              shadow-[0_20px_60px_rgba(220,38,38,0.15)]
              backdrop-blur-2xl
              sm:hidden
            "
          >
            {/* Mobile Header */}
            <div
              className="
                mb-1 flex items-center
                justify-between
                rounded-2xl
                bg-gradient-to-r
                from-red-50
                to-rose-50
                px-4 py-3
              "
            >
              <span className="text-xs font-bold uppercase tracking-widest text-red-500">
                Navigation
              </span>

              <span className="size-2 rounded-full bg-red-500 shadow-lg shadow-red-500/50" />
            </div>

            {NAV_LINKS.map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={() => handleNavigation(id)}
                className={`
                  group relative flex
                  items-center justify-between
                  rounded-2xl
                  px-4 py-3.5
                  text-sm font-bold
                  transition-all duration-300
                  ${
                    active === id
                      ? `
                        bg-gradient-to-r
                        from-red-500
                        to-rose-600
                        text-white
                        shadow-lg
                        shadow-red-500/20
                      `
                      : `
                        text-neutral-700
                        hover:bg-red-50
                        hover:text-red-600
                      `
                  }
                `}
              >
                <span>{label}</span>

                <span
                  className={`
                    transition-transform duration-300
                    ${
                      active === id
                        ? "translate-x-0 opacity-100"
                        : "translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                    }
                  `}
                >
                  →
                </span>
              </a>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;