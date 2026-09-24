"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/context/CartContext";
import SmartLink from "@/components/SmartLink";

import {
  Menu,
  X,
  LogOut,
  LogIn,
  Activity,
  Sparkles,
  LayoutDashboard,
  Dumbbell,
  Utensils,
  Phone,
  Package,
  Truck,
  Shield,
  ShoppingBag,
  ShoppingCart,
} from "lucide-react";

function isActive(pathname, href) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(href + "/");
}

export default function DashboardNavbar({ user }) {
  const { data: session, status } = useSession();
  const pathname = usePathname() || "";
  const { cart, animateCart, setCart } = useCart();

  const [profileOpen, setProfileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [liveOrder, setLiveOrder] = useState(null);

  const dropdownRef = useRef(null);

  const isLoggedIn = status === "authenticated";
  const isAdminUser = session?.user?.role === "admin";
  const currentUser = session?.user || user || {};
  const cartCount = Array.isArray(cart) ? cart.length : 0;
  const hasLiveOrder = Array.isArray(liveOrder)
    ? liveOrder.length > 0
    : Boolean(liveOrder);

  const avatarSrc =
    currentUser?.image ||
    `https://api.dicebear.com/7.x/initials/png?seed=${encodeURIComponent(
      currentUser?.name || "User"
    )}`;

  /* Close dropdown when clicking outside */
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* Close menus on route change */
  useEffect(() => {
    setProfileOpen(false);
    setSidebarOpen(false);
  }, [pathname]);

  /* Load cart */
  useEffect(() => {
    if (status !== "authenticated") return;
    let cancelled = false;

    fetch("/api/cart/get", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setCart(data.cart || []);
      })
      .catch((err) => console.error("Cart load error:", err));

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  /* Load live order */
  useEffect(() => {
    if (status !== "authenticated") return;
    let cancelled = false;

    fetch("/api/order/live")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setLiveOrder(data.order);
      })
      .catch((err) => console.error("Live order error:", err));

    return () => {
      cancelled = true;
    };
  }, [status]);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("Logout error:", error);
      setLoggingOut(false);
    }
  };

  return (
    <>
      {/* =====================================================
          HEADER
      ===================================================== */}
      <header className="sticky top-0 z-50 border-b border-[#dce8e1] bg-[#f7faf8]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-8 md:h-[72px]">
          {/* LEFT: hamburger + logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-[#315047] transition hover:bg-[#e5efe9] md:hidden"
              aria-label="Open navigation"
            >
              <Menu size={22} />
            </button>

            <Link href="/dashboard" className="flex items-center gap-2.5">
              <img
                src="/icon.jpeg"
                alt="NutriFit logo"
                className="h-10 w-auto md:h-11"
              />
              {/* <span className="text-lg font-bold tracking-tight text-[#173d30]">
                NutriFit
              </span> */}
            </Link>
          </div>

          {/* CENTER: desktop tabs */}
          <nav className="hidden flex-1 items-center justify-center md:flex">
            <div className="flex items-center gap-1 lg:gap-2">
              <DesktopNavItem
                href="/dashboard"
                label="Dashboard"
                active={isActive(pathname, "/dashboard")}
              />
              <DesktopNavItem
                href="/market"
                label="Market"
                active={isActive(pathname, "/market")}
              />

              {isLoggedIn && hasLiveOrder && (
                <DesktopNavItem
                  href="/track-order"
                  label="Track Order"
                  active={isActive(pathname, "/track-order")}
                  dot
                />
              )}

              {isLoggedIn && (
                <DesktopNavItem
                  href="/my-orders"
                  label="My Orders"
                  active={isActive(pathname, "/my-orders")}
                />
              )}

              <DesktopNavItem
                href="/contact"
                label="Contact"
                active={isActive(pathname, "/contact")}
              />

              {isAdminUser && (
                <DesktopNavItem
                  href="/admin"
                  label="Admin"
                  active={isActive(pathname, "/admin")}
                  icon={<Shield size={15} />}
                />
              )}
            </div>
          </nav>

          {/* RIGHT: cart + profile / login */}
          <div className="flex items-center gap-3 sm:gap-4">
            {isLoggedIn && (
              <SmartLink href="/Cart">
                <div
                  id="cart-icon"
                  className="relative flex h-10 w-10 items-center justify-center rounded-xl text-[#315047] transition hover:bg-[#e5efe9]"
                  aria-label="Cart"
                >
                  <ShoppingCart
                    size={22}
                    className={`transition-transform duration-300 ${
                      animateCart ? "-translate-y-1 scale-125" : "scale-100"
                    }`}
                  />
                  {cartCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold text-white">
                      {cartCount}
                    </span>
                  )}
                </div>
              </SmartLink>
            )}

            {isLoggedIn && (
              <div ref={dropdownRef} className="relative">
                <button
                  type="button"
                  onClick={() => setProfileOpen((prev) => !prev)}
                  aria-haspopup="menu"
                  aria-expanded={profileOpen}
                  aria-label="Open profile menu"
                  className="flex rounded-full ring-2 ring-transparent transition hover:ring-[#b9d8c6] focus:outline-none focus-visible:ring-[#397054]"
                >
                  <img
                    src={avatarSrc}
                    alt="Profile"
                    width={40}
                    height={40}
                    referrerPolicy="no-referrer"
                    className="h-10 w-10 rounded-full object-cover"
                  />
                </button>

                {profileOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 top-12 z-50 w-64 overflow-hidden rounded-2xl border border-[#dfe9e3] bg-white p-2 shadow-xl"
                  >
                    <div className="border-b border-[#edf1ee] px-3 py-3">
                      <p className="truncate text-sm font-bold text-[#24483a]">
                        {currentUser?.name || "NutriFit User"}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-[#82918a]">
                        {currentUser?.email || ""}
                      </p>
                    </div>

                    <div className="py-1">
                      <DropdownLink
                        href="/my-orders"
                        icon={<Package size={17} />}
                        label="My Orders"
                        onClick={() => setProfileOpen(false)}
                      />
                      {isAdminUser && (
                        <DropdownLink
                          href="/admin"
                          icon={<Shield size={17} />}
                          label="Admin Panel"
                          onClick={() => setProfileOpen(false)}
                        />
                      )}
                    </div>

                    <div className="border-t border-[#edf1ee] pt-1">
                      <button
                        type="button"
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                      >
                        <LogOut size={17} />
                        {loggingOut ? "Signing out..." : "Sign out"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {status === "unauthenticated" && (
              <SmartLink href="/login">
                <span className="inline-flex items-center gap-2 rounded-xl bg-[#173d30] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#245543]">
                  <LogIn size={16} />
                  Login
                </span>
              </SmartLink>
            )}
          </div>
        </div>
      </header>

      {/* =====================================================
          MOBILE SIDEBAR OVERLAY
      ===================================================== */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* =====================================================
          MOBILE SIDEBAR
      ===================================================== */}
      <aside
        aria-hidden={!sidebarOpen}
        className={`fixed left-0 top-0 z-[110] flex h-full w-[285px] flex-col bg-white shadow-2xl transition-transform duration-300 md:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar header */}
        <div className="flex h-16 items-center justify-between border-b border-[#e4ebe7] px-5">
          <Link
            href="/dashboard"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3"
          >
            {/* <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#173d30] font-bold text-white">
              F
            </div> */}
            <span className="text-lg font-bold text-[#173d30]">NutriFit</span>
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

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          <MobileNavItem
            href="/dashboard"
            icon={<LayoutDashboard size={19} />}
            label="Dashboard"
            active={isActive(pathname, "/dashboard")}
            onClick={() => setSidebarOpen(false)}
          />
          <MobileNavItem
            href="/dashboard/today"
            icon={<Activity size={19} />}
            label="Today's Activity"
            active={isActive(pathname, "/dashboard/today")}
            onClick={() => setSidebarOpen(false)}
          />
          <MobileNavItem
            href="/dashboard/workout"
            icon={<Dumbbell size={19} />}
            label="AI Fitness Coach"
            active={isActive(pathname, "/dashboard/workout")}
            onClick={() => setSidebarOpen(false)}
          />
          <MobileNavItem
            href="/dashboard/nutrition"
            icon={<Utensils size={19} />}
            label="Nutrition"
            active={isActive(pathname, "/dashboard/nutrition")}
            onClick={() => setSidebarOpen(false)}
          />
          <MobileNavItem
            href="/dashboard/coach"
            icon={<Sparkles size={19} />}
            label="AI Coach Chat"
            active={isActive(pathname, "/dashboard/coach")}
            onClick={() => setSidebarOpen(false)}
          />
          <MobileNavItem
            href="/dashboard/insights"
            icon={<Sparkles size={19} />}
            label="AI Insights"
            active={isActive(pathname, "/dashboard/insights")}
            onClick={() => setSidebarOpen(false)}
          />
          <MobileNavItem
            href="/market"
            icon={<ShoppingBag size={19} />}
            label="Market"
            active={isActive(pathname, "/market")}
            onClick={() => setSidebarOpen(false)}
          />

          {isLoggedIn && hasLiveOrder && (
            <MobileNavItem
              href="/track-order"
              icon={<Truck size={19} />}
              label="Track Order"
              active={isActive(pathname, "/track-order")}
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {isLoggedIn && (
            <MobileNavItem
              href="/my-orders"
              icon={<Package size={19} />}
              label="My Orders"
              active={isActive(pathname, "/my-orders")}
              onClick={() => setSidebarOpen(false)}
            />
          )}

          <MobileNavItem
            href="/contact"
            icon={<Phone size={19} />}
            label="Contact"
            active={isActive(pathname, "/contact")}
            onClick={() => setSidebarOpen(false)}
          />

          {isAdminUser && (
            <MobileNavItem
              href="/admin"
              icon={<Shield size={19} />}
              label="Admin"
              active={isActive(pathname, "/admin")}
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </nav>

        {status === "unauthenticated" && (
          <div className="border-t border-[#e4ebe7] p-4">
            <Link
              href="/login"
              onClick={() => setSidebarOpen(false)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#173d30] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#245543]"
            >
              <LogIn size={18} />
              Login
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}

/* =========================================================
   DESKTOP NAV ITEM
========================================================= */

function DesktopNavItem({ href, label, active, icon, dot }) {
  return (
    <SmartLink href={href}>
      <span
        className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
          active
            ? "bg-[#e3f0e8] text-[#173d30]"
            : "text-[#4a5f56] hover:bg-[#edf6f0] hover:text-[#173d30]"
        }`}
      >
        {icon}
        {label}
        {dot && (
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
        )}
      </span>
    </SmartLink>
  );
}

/* =========================================================
   PROFILE DROPDOWN LINK
========================================================= */

function DropdownLink({ href, icon, label, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#53665e] transition hover:bg-[#edf6f0] hover:text-[#245543]"
    >
      {icon}
      {label}
    </Link>
  );
}

/* =========================================================
   MOBILE NAV ITEM
========================================================= */

function MobileNavItem({ href, icon, label, onClick, active }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-semibold transition ${
        active
          ? "bg-[#e3f0e8] text-[#173d30]"
          : "text-[#53665e] hover:bg-[#edf6f0] hover:text-[#245543]"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}