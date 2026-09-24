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
  Activity,
  Sparkles,
  MessageCircle,
  LayoutDashboard,
  Dumbbell,
  Utensils,
  Phone,
  Package,
  Store,
  Truck,
  ShieldCheck,
  ShoppingCart,
} from "lucide-react";

export default function DashboardNavbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const { cart, animateCart, setCart } = useCart();

  const [profileOpen, setProfileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [liveOrder, setLiveOrder] = useState(null);

  const dropdownRef = useRef(null);

  const authed = status === "authenticated";
  const isAdmin = session?.user?.role === "admin";
  const hasLiveOrder = liveOrder?.length > 0;
  const cartCount = Array.isArray(cart) ? cart.length : 0;

  const avatarSrc =
    session?.user?.image ||
    `https://api.dicebear.com/7.x/initials/png?seed=${encodeURIComponent(
      session?.user?.name || "User"
    )}`;

  /* ---------- close dropdown on outside click / Escape ---------- */
  useEffect(() => {
    function onMouseDown(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }
    function onKeyDown(event) {
      if (event.key === "Escape") {
        setProfileOpen(false);
        setSidebarOpen(false);
      }
    }
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  /* ---------- close menus when the page changes ---------- */
  useEffect(() => {
    setProfileOpen(false);
    setSidebarOpen(false);
  }, [pathname]);

  /* ---------- lock page scroll while the mobile drawer is open ---------- */
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  /* ---------- load cart + live order once the user is logged in ---------- */
  useEffect(() => {
    if (status !== "authenticated") return;

    fetch("/api/cart/get", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => setCart(data.cart || []))
      .catch((err) => console.error("Cart load error:", err));

    fetch("/api/order/live")
      .then((res) => res.json())
      .then((data) => setLiveOrder(data.order))
      .catch((err) => console.error("Live order load error:", err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const isActive = (href) =>
    href === "/dashboard"
      ? pathname === href
      : pathname === href || pathname?.startsWith(`${href}/`);

  /* ---------- link lists ---------- */
  const desktopLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/market", label: "Market" },
    ...(authed && hasLiveOrder
      ? [{ href: "/track-order", label: "Track Order" }]
      : []),
    ...(authed ? [{ href: "/my-orders", label: "My Orders" }] : []),
    { href: "/contact", label: "Contact" },
    ...(isAdmin ? [{ href: "/admin", label: "Admin" }] : []),
  ];

  const mobileLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/today", label: "Today's Activity", icon: Activity },
    { href: "/dashboard/workout", label: "AI Fitness Coach", icon: Dumbbell },
    { href: "/dashboard/nutrition", label: "Nutrition", icon: Utensils },
    { href: "/dashboard/coach", label: "AI Coach Chat", icon: MessageCircle },
    { href: "/dashboard/insights", label: "AI Insights", icon: Sparkles },
    { href: "/market", label: "Market", icon: Store },
    ...(authed && hasLiveOrder
      ? [{ href: "/track-order", label: "Track Order", icon: Truck }]
      : []),
    ...(authed ? [{ href: "/my-orders", label: "My Orders", icon: Package }] : []),
    { href: "/contact", label: "Contact", icon: Phone },
    ...(isAdmin ? [{ href: "/admin", label: "Admin Panel", icon: ShieldCheck }] : []),
  ];

  return (
    <>
      {/* =====================================================
          HEADER
      ===================================================== */}
      <header className="sticky top-0 z-50 border-b border-[#dce8e1] bg-[#f7faf8]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[68px] max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          {/* Left: hamburger + logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-[#315047] transition-colors hover:bg-[#e5efe9] lg:hidden"
              aria-label="Open navigation"
            >
              <Menu size={22} />
            </button>

            <Link href="/dashboard" className="flex items-center gap-2.5">
              <img
                src="/icon.png"
                alt="FitSync logo"
                className="h-10 w-auto sm:h-11"
              />
              <span className="text-lg font-bold tracking-tight text-[#173d30]">
                FitSync
              </span>
            </Link>
          </div>

          {/* Center: desktop tabs */}
          <nav
            aria-label="Main"
            className="ml-8 hidden flex-1 items-center gap-1 lg:flex"
          >
            {desktopLinks.map((link) => (
              <DesktopLink
                key={link.href}
                href={link.href}
                label={link.label}
                active={isActive(link.href)}
              />
            ))}
          </nav>

          {/* Right: cart + profile / login */}
          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            {authed && (
              <SmartLink href="/Cart">
                <span
                  id="cart-icon"
                  aria-label={`Cart, ${cartCount} items`}
                  className="relative flex h-10 w-10 items-center justify-center rounded-xl text-[#315047] transition-colors hover:bg-[#e5efe9]"
                >
                  <span
                    className={`inline-flex transition-transform duration-300 ${
                      animateCart ? "-translate-y-0.5 scale-125" : ""
                    }`}
                  >
                    <ShoppingCart size={22} />
                  </span>

                  {cartCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold leading-none text-white">
                      {cartCount > 99 ? "99+" : cartCount}
                    </span>
                  )}
                </span>
              </SmartLink>
            )}

            {status === "loading" && (
              <div className="h-10 w-10 animate-pulse rounded-full bg-[#e5efe9]" />
            )}

            {authed && (
              <div ref={dropdownRef} className="relative">
                <button
                  type="button"
                  onClick={() => setProfileOpen((prev) => !prev)}
                  aria-haspopup="menu"
                  aria-expanded={profileOpen}
                  aria-label="Open profile menu"
                  className={`flex rounded-full ring-2 transition focus:outline-none focus-visible:ring-[#397054] ${
                    profileOpen
                      ? "ring-[#397054]"
                      : "ring-transparent hover:ring-[#b9d6c6]"
                  }`}
                >
                  <img
                    src={avatarSrc}
                    alt="Profile"
                    referrerPolicy="no-referrer"
                    className="h-10 w-10 rounded-full object-cover"
                  />
                </button>

                {profileOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 top-full z-50 mt-3 w-64 overflow-hidden rounded-2xl border border-[#dfe9e3] bg-white p-2 shadow-xl"
                  >
                    <div className="border-b border-[#edf1ee] px-3 pb-3 pt-2">
                      <p className="truncate text-sm font-bold text-[#24483a]">
                        {session?.user?.name || "FitSync User"}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-[#6b7d75]">
                        {session?.user?.email}
                      </p>
                    </div>

                    <div className="py-1">
                      <MenuLink
                        href="/my-orders"
                        icon={<Package size={17} />}
                        label="My Orders"
                      />
                      {isAdmin && (
                        <MenuLink
                          href="/admin"
                          icon={<ShieldCheck size={17} />}
                          label="Admin Panel"
                        />
                      )}
                    </div>

                    <div className="border-t border-[#edf1ee] pt-1">
                      <button
                        type="button"
                        role="menuitem"
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
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
                <span className="inline-flex items-center rounded-xl bg-[#173d30] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#245543]">
                  Login
                </span>
              </SmartLink>
            )}
          </div>
        </div>
      </header>

      {/* =====================================================
          MOBILE DRAWER
      ===================================================== */}
      <div
        onClick={() => setSidebarOpen(false)}
        className={`fixed inset-0 z-[100] bg-black/40 transition-opacity duration-300 lg:hidden ${
          sidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        aria-hidden={!sidebarOpen}
        className={`fixed left-0 top-0 z-[110] flex h-full w-[285px] flex-col bg-white shadow-2xl transition-[transform,visibility] duration-300 lg:hidden ${
          sidebarOpen ? "visible translate-x-0" : "invisible -translate-x-full"
        }`}
      >
        <div className="flex h-[68px] items-center justify-between border-b border-[#e4ebe7] px-5">
          <Link
            href="/dashboard"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-2.5"
          >
            <img src="/icon.png" alt="FitSync logo" className="h-9 w-auto" />
            <span className="text-lg font-bold tracking-tight text-[#173d30]">
              FitSync
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-[#53665e] transition-colors hover:bg-[#edf6f0]"
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {mobileLinks.map(({ href, label, icon: Icon }) => (
            <MobileNavItem
              key={href}
              href={href}
              label={label}
              icon={<Icon size={19} />}
              active={isActive(href)}
              onClick={() => setSidebarOpen(false)}
            />
          ))}
        </nav>
      </aside>
    </>
  );
}

/* =========================================================
   DESKTOP TAB
========================================================= */
function DesktopLink({ href, label, active }) {
  return (
    <SmartLink href={href}>
      <span
        aria-current={active ? "page" : undefined}
        className={`inline-flex items-center rounded-xl px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
          active
            ? "bg-[#173d30] text-white"
            : "text-[#4a635a] hover:bg-[#e5efe9] hover:text-[#173d30]"
        }`}
      >
        {label}
      </span>
    </SmartLink>
  );
}

/* =========================================================
   PROFILE DROPDOWN ITEM
========================================================= */
function MenuLink({ href, icon, label }) {
  return (
    <Link
      href={href}
      role="menuitem"
      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#3f574d] transition-colors hover:bg-[#edf6f0] hover:text-[#173d30]"
    >
      {icon}
      {label}
    </Link>
  );
}

/* =========================================================
   MOBILE DRAWER ITEM
========================================================= */
function MobileNavItem({ href, icon, label, active, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-semibold transition-colors ${
        active
          ? "bg-[#173d30] text-white"
          : "text-[#3f574d] hover:bg-[#edf6f0] hover:text-[#173d30]"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}