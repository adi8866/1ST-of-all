// src/Components/admin/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";

/* --- tiny keyframes (no deps) --- */
const FadeSlideStyles = () => (
  <style>{`
    @keyframes fadeSlideIn {
      from { opacity: 0; transform: translateY(4px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `}</style>
);

/** Inline SVG icons (inherit currentColor) */
const Icon = {
  Home: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            d="M3 11.5l9-7 9 7M5 10v10a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-5h2v5a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V10" />
    </svg>
  ),
  Plus: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            d="M12 5v14M5 12h14" />
    </svg>
  ),
  List: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            d="M8 6h13M3 6h.01M8 12h13M3 12h.01M8 18h13M3 18h.01" />
    </svg>
  ),
  Comment: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            d="M21 12a8 8 0 0 1-8 8H7l-4 3V12a8 8 0 0 1 8-8h2a8 8 0 0 1 8 8z" />
    </svg>
  ),
};

const linkBase =
  "relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors duration-150";
const linkActive = "text-[#145A4F] font-semibold bg-[#145A4F]/10";
const linkIdle   = "text-[#0A241D] hover:bg-[#0A241D]/5 hover:text-[#145A4F]";

function NavItem({ to, end, icon: IconEl, label }) {
  return (
    <NavLink to={to} end={end}>
      {({ isActive }) => (
        <div
          className={[linkBase, isActive ? linkActive : linkIdle].join(" ")}
          style={{ animation: "fadeSlideIn 220ms ease-out both" }}
        >
          <span
            className="absolute left-0 top-1/2 -translate-y-1/2 rounded-r"
            style={{
              height: 24,
              width: isActive ? 6 : 0,
              background: "#145A4F",
              transition: "width 220ms ease",
            }}
          />
          <IconEl className="h-5 w-5" />
          <span>{label}</span>
        </div>
      )}
    </NavLink>
  );
}

export default function Sidebar() {
  return (
    <aside
      className="
        flex-shrink-0 sticky left-0 top-[84px] h-[calc(100vh-84px)] w-64
        bg-white border-r border-black/10 overflow-y-auto
        m-0 p-0
      "
    >
      <FadeSlideStyles />

      <div className="px-3 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-wide text-[#0A241D]/55">
        Main
      </div>
      <nav className="space-y-1">
        <NavItem to="/admin" end icon={Icon.Home} label="Dashboard" />
      </nav>

      <div className="my-3 h-px bg-black/10 mx-3" />

      <div className="px-3 pt-1 pb-1 text-[11px] font-semibold uppercase tracking-wide text-[#0A241D]/55">
        Blog
      </div>
      <nav className="space-y-1">
        <NavItem to="/admin/addBlog"  icon={Icon.Plus}    label="Add Blog" />
        <NavItem to="/admin/listBlog" icon={Icon.List}    label="List Blog" />
        <NavItem to="/admin/comments" icon={Icon.Comment} label="Comments" />
      </nav>

      <div className="mt-6 pt-3 border-t border-black/10 text-[11px] text-[#0A241D]/60 px-3">
        Quickblog Admin • v1.0
      </div>
    </aside>
  );
}
