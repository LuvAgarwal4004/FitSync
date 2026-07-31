"use client";

import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import SmartLink from "./SmartLink";
import {
  Menu,
  X,
  Home,
  ShoppingBag,
  ClipboardList,
  PlusCircle,
  User,
  LogOut,
} from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();

  const [mobileMenu, setMobileMenu] = useState(false);
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  return (
    <>
<nav className="sticky top-0 z-50 bg-[#07091d]/95 backdrop-blur-md border-b border-white/10 shadow-xl">        <div className="mx-auto max-w-7xl px-4">

          <div className="flex h-24 items-center justify-between">

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenu(true)}
              className="md:hidden text-white"
            >
              <Menu size={28} />
            </button>

            {/* Logo */}
            {/* Logo */}
<SmartLink href="/" className="flex items-center">
  <div className="flex items-center rounded-xl bg-white px-2 py-1 shadow-md">
    <img
      src="/logo1.jpg"
      alt="HITK Stationary"
      className="h-14 w-auto object-contain"
    />
  </div>
</SmartLink>

            {/* Desktop Links */}

            <div className="hidden md:flex items-center gap-2">

              <SmartLink href="/">
                <span className="rounded-xl px-4 py-2 text-sm font-medium text-gray-300 transition hover:bg-cyan-500/10 hover:text-cyan-400">
                  Home
                </span>
              </SmartLink>

              {/* <SmartLink href="/buy">
                <span className="rounded-xl px-4 py-2 text-sm font-medium text-gray-300 transition hover:bg-cyan-500/10 hover:text-cyan-400">
                  Buy
                </span>
              </SmartLink>

              <SmartLink href="/rent-requests">
                <span className="rounded-xl px-4 py-2 text-sm font-medium text-gray-300 transition hover:bg-cyan-500/10 hover:text-cyan-400">
                  Rent Requests
                </span>
              </SmartLink> */}

              {session && (
                <>
                  {/* <SmartLink href="/sell">
                    <span className="rounded-xl px-4 py-2 text-sm font-medium text-gray-300 transition hover:bg-cyan-500/10 hover:text-cyan-400">
                      Sell
                    </span>
                  </SmartLink>

                  <SmartLink href="/rent">
                    <span className="rounded-xl px-4 py-2 text-sm font-medium text-gray-300 transition hover:bg-cyan-500/10 hover:text-cyan-400">
                      Rent
                    </span>
                  </SmartLink> */}

                  <SmartLink href="/my-activity">
                    <span className="rounded-xl px-4 py-2 text-sm font-medium text-gray-300 transition hover:bg-cyan-500/10 hover:text-cyan-400">
                      My Activity
                    </span>
                  </SmartLink>
                </>
              )}
            </div>

            {/* Right Side */}

            <div className="flex items-center">

              {!session ? (
                <SmartLink href="/login">
                  <button
                    className="
                    rounded-xl
                    bg-gradient-to-r
                    from-indigo-600
                    to-purple-600
                    px-5
                    py-2
                    text-white
                    font-semibold
                    hover:scale-105
                    transition
                  "
                  >
                    Login
                  </button>
                </SmartLink>
              ) : (
                <div
                  ref={dropdownRef}
                  className="relative"
                >
                  <button
                    onClick={() =>
                      setOpen(!open)
                    }
                  >
                    <Image
                      src={
                        session.user.image ||
                        `https://api.dicebear.com/7.x/initials/png?seed=${encodeURIComponent(
                          session.user.name
                        )}`
                      }
                      alt="profile"
                      width={42}
                      height={42}
                      className="rounded-full border-2 border-white"
                    />
                  </button>

                  {open && (
                    <div
                      className="
                      absolute
                      right-0
                      mt-3
                      w-56
                      rounded-2xl
                      bg-white
                      shadow-2xl
                      overflow-hidden
                    "
                    >

                      <div className="border-b p-4">

                        <p className="font-semibold">
                          {session.user.name}
                        </p>

                        <p className="text-sm text-gray-500">
                          {session.user.email}
                        </p>

                      </div>

                      <SmartLink
                        href="/my-activity"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100"
                      >
                        <User size={18} />
                        My Activity
                      </SmartLink>

                      <button
                        onClick={() =>
                          signOut({
                            callbackUrl: "/",
                          })
                        }
                        className="
                        flex
                        w-full
                        items-center
                        gap-3
                        px-4
                        py-3
                        text-red-600
                        hover:bg-red-50
                        "
                      >
                        <LogOut size={18} />
                        Logout
                      </button>

                    </div>
                  )}
                </div>
              )}
            </div>

          </div>

        </div>
      </nav>

      {/* Overlay */}

      <div
        onClick={() =>
          setMobileMenu(false)
        }
        className={`
fixed
inset-0
bg-black/50
z-40
transition
${mobileMenu
            ? "opacity-100"
            : "pointer-events-none opacity-0"}
`}
      />

      {/* Mobile Sidebar */}

      <div
        className={`
fixed
top-0
left-0
z-50
h-screen
w-72
bg-[#06081f]
transition-transform
duration-300
${mobileMenu
            ? "translate-x-0"
            : "-translate-x-full"}
`}
      >

        <div className="flex items-center justify-between p-5">

          <h2 className="text-xl font-bold text-white">
            Campus Hub
          </h2>

          <button
            onClick={() =>
              setMobileMenu(false)
            }
            className="text-white"
          >
            <X />
          </button>

        </div>

        <div className="mt-5 flex flex-col">

          <SmartLink
            href="/"
            className="p-4 text-gray-300 hover:bg-white/10"
          >
            <Home className="inline mr-3" />
            Home
          </SmartLink>

          {/* <SmartLink
            href="/buy"
            className="p-4 text-gray-300 hover:bg-white/10"
          >
            <ShoppingBag className="inline mr-3" />
            Buy
          </SmartLink>

          <SmartLink
            href="/rent-requests"
            className="p-4 text-gray-300 hover:bg-white/10"
          >
            <ClipboardList className="inline mr-3" />
            Rent Requests
          </SmartLink> */}

          {session && (
            <>
              {/* <SmartLink
                href="/sell"
                className="p-4 text-gray-300 hover:bg-white/10"
              >
                <PlusCircle className="inline mr-3" />
                Sell
              </SmartLink>

              <SmartLink
                href="/rent"
                className="p-4 text-gray-300 hover:bg-white/10"
              >
                <PlusCircle className="inline mr-3" />
                Rent
              </SmartLink> */}

              <SmartLink
                href="/my-activity"
                className="p-4 text-gray-300 hover:bg-white/10"
              >
                <User className="inline mr-3" />
                My Activity
              </SmartLink>

              <button
                onClick={() =>
                  signOut({
                    callbackUrl: "/",
                  })
                }
                className="p-4 text-left text-red-400 hover:bg-red-500/10"
              >
                <LogOut className="inline mr-3" />
                Logout
              </button>
            </>
          )}

        </div>

      </div>
    </>
  );
}