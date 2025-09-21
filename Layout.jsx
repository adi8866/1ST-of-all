// src/Pages/admins/Layout.jsx
import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import Sidebar from "../../Components/admin/Sidebar";

const Layout = ({ debug = false }) => {
  const navigate = useNavigate();
  const handleLogo = () => navigate("/");
  const handleLogout = () => navigate("/");

  useEffect(() => {
    if (debug && import.meta?.env?.DEV) debugger;
  }, [debug]);

  return (
    <div className="min-h-screen bg-[#F7F7F5] text-[#0A241D]">
      {/* HEADER aligned to sidebar width */}
      <header className="sticky top-0 z-40 w-full bg-[#145A4F] text-white shadow-[0_6px_18px_rgba(0,0,0,0.18)]">
        {/* Make container relative so we can absolutely pin the logout button */}
        <div className="relative grid grid-cols-[16rem,1fr] h-16">
          {/* Left: logo keeps aspect ratio */}
          <div className="flex items-center border-r border-black/10 px-3 sm:px-6">
            <button
              type="button"
              onClick={handleLogo}
              className="inline-flex items-center gap-3 focus:outline-none"
              title="Go to Home"
            >
              <img
                src={assets.logo}
                alt="Quickblog logo"
                className="h-10 w-auto max-h-10 object-contain select-none pointer-events-none shrink-0"
                draggable="false"
              />
            </button>
          </div>

          {/* Right grid cell intentionally empty; button is absolutely positioned */}
          <div />

          {/* Logout: pinned inside green bar, vertically centered */}
          <button
            type="button"
            onClick={handleLogout}
            className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2
                       inline-flex items-center gap-2 h-10 rounded-full pl-4 pr-3 text-sm font-semibold
                       bg-[#F2C9CA] text-[#0E3A2D] hover:bg-[#EDB6B8] active:translate-y-[1px]
                       shadow-[0_2px_0_rgba(0,0,0,0.08),0_8px_18px_-8px_rgba(0,0,0,0.35)] transition
                       whitespace-nowrap shrink-0"
            aria-label="Logout"
            title="Logout"
          >
            <span className="shrink-0">Logout</span>
            <span className="grid h-7 w-7 place-items-center rounded-full bg-white/70 hover:bg-white transition shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path d="M10 6l6 6-6 6" />
                <path d="M4 12h12" />
              </svg>
            </span>
          </button>
        </div>

        {/* thin divider stays below the green bar */}
        <div className="h-[2px] w-full bg-gradient-to-r from-[#F2C9CA] via-white/40 to-transparent opacity-70" />
      </header>

      {/* BODY (sidebar pinned flush-left) */}
      <div className="w-full">
        <div className="flex">
          <Sidebar />
          <main className="flex-1 min-w-0 p-0 py-6 sm:py-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
