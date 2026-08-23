"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";

import {
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  Dumbbell,
  Utensils,
  TrendingUp,
  Trophy,
  User,
  ChevronDown,
} from "lucide-react";

export default function DashboardNavbar({ user }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const firstLetter =
    user?.name?.[0]?.toUpperCase() || "F";

  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      await signOut({
        callbackUrl: "/",
      });
    } catch (error) {
      console.error("Logout error:", error);
      setLoggingOut(false);
    }
  };

  return (
    <>
      {/* =====================================================
          DESKTOP / MOBILE HEADER
      ===================================================== */}

      <header className="sticky top-0 z-50 border-b border-[#dce8e1]/80 bg-[#f7faf8]/90 backdrop-blur-xl">

        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">

          {/* =================================================
              LEFT SIDE
          ================================================= */}

          <div className="flex items-center gap-3">

            {/* Mobile menu button */}

            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-[#315047] transition hover:bg-[#e5efe9] lg:hidden"
              aria-label="Open navigation"
            >
              <Menu size={22} />
            </button>

            {/* Logo */}

            <Link
              href="/dashboard"
              className="flex items-center gap-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#173d30] font-bold text-white shadow-lg">
                F
              </div>

              <div>
                <div className="text-lg font-bold text-[#173d30]">
                  FitSync
                </div>

                <div className="hidden text-[10px] font-medium uppercase tracking-[0.18em] text-[#779087] sm:block">
                  Train · Fuel · Track · Repeat
                </div>
              </div>
            </Link>

          </div>

          {/* =================================================
              DESKTOP USER AREA
          ================================================= */}

          <div className="relative">

            <button
              type="button"
              onClick={() =>
                setProfileOpen((previous) => !previous)
              }
              className="flex items-center gap-3 rounded-2xl px-2 py-1.5 transition hover:bg-[#eaf2ed]"
            >

              <div className="hidden text-right sm:block">

                <p className="text-sm font-bold text-[#24483a]">
                  {user?.name || "FitSync User"}
                </p>

                <p className="text-xs text-[#82918a]">
                  Your fitness journey
                </p>

              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#dceee3] font-bold text-[#397054]">
                {firstLetter}
              </div>

              <ChevronDown
                size={16}
                className={`hidden text-[#71817a] transition-transform sm:block ${
                  profileOpen ? "rotate-180" : ""
                }`}
              />

            </button>

            {/* =================================================
                PROFILE DROPDOWN
            ================================================= */}

            {profileOpen && (
              <div className="absolute right-0 top-14 z-50 w-64 overflow-hidden rounded-2xl border border-[#dfe9e3] bg-white p-2 shadow-xl">

                <div className="border-b border-[#edf1ee] px-4 py-3">

                  <p className="text-sm font-bold text-[#24483a]">
                    {user?.name || "FitSync User"}
                  </p>

                  <p className="mt-1 truncate text-xs text-[#82918a]">
                    {user?.email || ""}
                  </p>

                </div>

                <Link
                  href="/dashboard"
                  onClick={() => setProfileOpen(false)}
                  className="mt-1 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-[#53665e] transition hover:bg-[#edf6f0]"
                >
                  <LayoutDashboard size={17} />
                  Dashboard
                </Link>

                <Link
                  href="/dashboard/profile"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-[#53665e] transition hover:bg-[#edf6f0]"
                >
                  <User size={17} />
                  My Profile
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                >
                  <LogOut size={17} />

                  {loggingOut
                    ? "Logging out..."
                    : "Logout"}
                </button>

              </div>
            )}

          </div>

        </div>

      </header>

      {/* =====================================================
          MOBILE SIDEBAR OVERLAY
      ===================================================== */}

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* =====================================================
          MOBILE SIDEBAR
      ===================================================== */}

      <aside
        className={`fixed left-0 top-0 z-[110] flex h-full w-[285px] flex-col bg-white shadow-2xl transition-transform duration-300 lg:hidden ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >

        {/* Sidebar header */}

        <div className="flex h-20 items-center justify-between border-b border-[#e4ebe7] px-5">

          <Link
            href="/dashboard"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3"
          >

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#173d30] font-bold text-white">
              F
            </div>

            <div>
              <div className="font-bold text-[#173d30]">
                FitSync
              </div>

              <div className="text-[9px] uppercase tracking-wider text-[#82918a]">
                Your fitness journey
              </div>
            </div>

          </Link>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-[#53665e] hover:bg-[#edf6f0]"
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>

        </div>

        {/* User */}

        <div className="border-b border-[#e4ebe7] p-5">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#dceee3] font-bold text-[#397054]">
              {firstLetter}
            </div>

            <div className="min-w-0">

              <p className="truncate text-sm font-bold text-[#24483a]">
                {user?.name || "FitSync User"}
              </p>

              <p className="truncate text-xs text-[#82918a]">
                {user?.email || ""}
              </p>

            </div>

          </div>

        </div>

        {/* Navigation */}

        <nav className="flex-1 space-y-1 p-4">

          <MobileNavItem
            href="/dashboard"
            icon={<LayoutDashboard size={19} />}
            label="Dashboard"
            onClick={() => setSidebarOpen(false)}
          />

          <MobileNavItem
            href="/dashboard/workout"
            icon={<Dumbbell size={19} />}
            label="AI Fitness Coach"
            onClick={() => setSidebarOpen(false)}
          />

          <MobileNavItem
            href="/dashboard/nutrition"
            icon={<Utensils size={19} />}
            label="Nutrition"
            onClick={() => setSidebarOpen(false)}
          />

          <MobileNavItem
            href="/dashboard/progress"
            icon={<TrendingUp size={19} />}
            label="My Progress"
            onClick={() => setSidebarOpen(false)}
          />

          <MobileNavItem
            href="/dashboard/challenges"
            icon={<Trophy size={19} />}
            label="Challenges"
            onClick={() => setSidebarOpen(false)}
          />

          <MobileNavItem
            href="/dashboard/profile"
            icon={<User size={19} />}
            label="My Profile"
            onClick={() => setSidebarOpen(false)}
          />

        </nav>

        {/* Logout */}

        <div className="border-t border-[#e4ebe7] p-4">

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
          >

            <LogOut size={19} />

            {loggingOut
              ? "Logging out..."
              : "Logout"}

          </button>

        </div>

      </aside>
    </>
  );
}


/* =========================================================
   MOBILE NAV ITEM
========================================================= */

function MobileNavItem({
  href,
  icon,
  label,
  onClick,
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-semibold text-[#53665e] transition hover:bg-[#edf6f0] hover:text-[#245543]"
    >
      {icon}
      {label}
    </Link>
  );
}