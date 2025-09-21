// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";

const footerSections = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/features" },
      { label: "Pricing", href: "/pricing" },
      { label: "Changelog", href: "/changelog" },
      { label: "Status", href: "/status" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Docs", href: "/docs" },
      { label: "Guides", href: "/guides" },
      { label: "API", href: "/api" },
      { label: "Community", href: "/community" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Cookies", href: "/cookies" },
      { label: "Security", href: "/security" },
    ],
  },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-16 text-white">
      {/* background gradient */}
      <div className="absolute inset-0" aria-hidden="true">
        <div className="h-full w-full bg-gradient-to-b from-[#0E3A2D] via-[#0C2F25] to-[#0A241D]" />
        <div className="absolute inset-x-0 top-0 h-px bg-white/10" />
      </div>

      <div className="relative mx-auto w-full max-w-screen-xl px-6 sm:px-8">
        {/* Brand + Links */}
        <div className="pt-10 pb-8 grid grid-cols-1 gap-y-10 md:grid-cols-[320px_minmax(0,1fr)] md:gap-x-16">
          {/* Brand */}
          <div className="flex flex-col items-start">
            <img
              src={assets.logo}
              alt="QuickBlog logo"
              className="h-10 sm:h-12 w-auto mb-3 drop-shadow-sm -ml-1 sm:-ml-2"
            />
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#F0D2A6] via-[#E7C48C] to-[#D2A065]">
              QuickBlog
            </h3>
            <p className="mt-2 text-sm sm:text-base font-medium text-white/85">
              Co-written with a robot sidekick 🤖
            </p>
          </div>

          {/* Links grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-12 gap-y-8 md:pl-2 lg:pl-4">
            {footerSections.map((section) => (
              <div key={section.title}>
                <h4 className="text-sm font-semibold tracking-wide text-[#E7C48C]">
                  {section.title}
                </h4>
                <ul className="mt-3 space-y-2.5">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        to={link.href}
                        onClick={() =>
                          window.scrollTo({ top: 0, behavior: "smooth" })
                        }
                        className="text-sm text-white/80 hover:text-white transition-colors rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-white/10" />

        {/* Bottom row */}
        <div className="py-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-center sm:text-left text-xs sm:text-sm text-white/75">
            © {year} QuickBlog. All rights reserved.
          </p>

          <ul className="flex items-center justify-center sm:justify-end gap-5 text-xs text-white/75">
            {[
              { href: "/privacy", label: "Privacy" },
              { href: "/terms", label: "Terms" },
              { href: "/cookies", label: "Cookies" },
              { href: "/security", label: "Security" },
            ].map((item) => (
              <li key={item.href}>
                <Link
                  to={item.href}
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                  className="rounded transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="pb-4" />
      </div>
    </footer>
  );
};

export default Footer;
