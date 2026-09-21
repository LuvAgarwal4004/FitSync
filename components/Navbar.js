"use client"
import React from 'react'
import { useState } from "react";
import { useSession, signOut } from "next-auth/react"
import Image from "next/image";
import { useEffect, useRef } from "react";
import { useCart } from "@/context/CartContext";
import SmartLink from './SmartLink';
import {
    Menu,
    X,
    Home,
    Package,
    Truck,
    Phone,
    Shield,
    LogOut,
    User
} from "lucide-react";

const Navbar = () => {
    const { data: session } = useSession();

    const [open, setOpen] = useState(false);
    const [mobileMenu, setMobileMenu] = useState(false);
    const dropdownRef = useRef(null);
    const [liveOrder, setLiveOrder] =
        useState(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    const { cart, animateCart, setCart } = useCart();

    useEffect(() => {
        if (session) {
            fetch("/api/cart/get", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                // body: JSON.stringify({
                //     email: session.user.email
                // })
            })
                .then(res => res.json())
                .then(data => {
                    setCart(data.cart); // IMPORTANT
                });
        }
    }, [session]);
    useEffect(() => {

        if (session) {

            fetch("/api/order/live")
                .then(res => res.json())
                .then(data => {
                    setLiveOrder(data.order);
                });

        }

    }, [session]);

    return (
        <>

            <nav className="relative bg-[#06081f]">
                <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                    <div className="relative flex h-20 items-center justify-between">
                        <button
                            onClick={() => setMobileMenu(true)}
                            className="
sm:hidden
text-white
mr-2
"
                        >
                            <Menu size={28} />
                        </button>
                        <SmartLink href="/">
                            <img src="/logo.jpg" alt="Your Company" className="
h-16
md:h-20
w-auto
transition
" />
                        </SmartLink>
                        <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                            <div className="flex shrink-0 items-center">
                            </div>
                            <div className="hidden md:block ml-8">
                                <div className="flex space-x-4">

                                    <SmartLink href="#"> <span aria-current="page"
                                        className="
rounded-xl
px-4
py-2
text-sm
font-medium
text-gray-300
transition
duration-300
hover:bg-cyan-500/10
hover:text-cyan-400
">Home</span></SmartLink>
                                    {session && (<>
                                        {liveOrder?.length > 0 && (
                                            <SmartLink href="/track-order">
                                                <span className="
rounded-md
px-3
py-2
text-sm
font-medium
text-gray-300
hover:bg-white/5
hover:text-white
">
                                                    Track Order
                                                </span>
                                            </SmartLink>
                                        )}
                                        <SmartLink href="/my-orders">
                                            <span className="
rounded-xl
px-4
py-2
text-sm
font-medium
text-gray-300
transition
duration-300
hover:bg-cyan-500/10
hover:text-cyan-400
">My Order</span></SmartLink>
                                    </>)}
                                    <SmartLink href="/contact"><span
                                        className="
rounded-xl
px-4
py-2
text-sm
font-medium
text-gray-300
transition
duration-300
hover:bg-cyan-500/10
hover:text-cyan-400
">Contact</span></SmartLink>
                                    {/* <SmartLink href="#"><span className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white">More</span></SmartLink> */}

                                    {session?.user?.role === "admin" && (
                                        <SmartLink href="/admin">
                                            <span
                                                className="
rounded-xl
px-4
py-2
text-sm
font-medium
text-gray-300
transition
duration-300
hover:bg-cyan-500/10
hover:text-cyan-400
">
                                                Admin
                                            </span>
                                        </SmartLink>
                                    )}
                                </div>
                            </div>
                        </div>
                        {session && (
                            <SmartLink href={"/Cart"}>
                                <button id="cart-icon" className="relative">
                                    <div
                                        className={`transition-transform duration-300 ${animateCart ? "scale-220 -translate-y-1" : "scale-160"
                                            }`}
                                    >
                                        🛒
                                    </div>

                                    {/* badge */}
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full">
                                        {cart.length}
                                    </span>
                                </button>
                            </SmartLink>
                        )}



                        {session && (
                            <div ref={dropdownRef} className="relative ml-3">
                                <button
                                    onClick={() => setOpen(!open)}
                                    className="relative flex rounded-full focus:outline-none"
                                >

                                    <Image
                                        src={session?.user?.image || `https://api.dicebear.com/7.x/initials/png?seed=${encodeURIComponent(session?.user?.name || "User")}`}
                                        alt="profile"
                                        width={40}
                                        height={40}
                                        className="rounded-full"
                                    />
                                </button>

                                {open && (
                                    <div className="absolute z-10 right-0 mt-2 w-40 rounded-md bg-white py-1 shadow-lg">
                                        {/* <SmartLink href="#"><span className="block px-4 py-2 text-sm text-gray-700
                                     hover:bg-gray-100">
                                        Your profile
                                    </span>
                                    </SmartLink> */}

                                        <button
                                            onClick={() => signOut({ callbackUrl: "/" })}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Sign out
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {!session && <SmartLink href={"/login"}>
                            <button type="button" className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl rounded-lg focus:ring-4 focus:outline-none font-medium rounded-base text-sm px-4 py-2.5 text-center leading-5">Login</button>
                        </SmartLink>}

                    </div>
                </div>
            </nav>
            <>
                <div
                    className={`
fixed
inset-0
bg-black/50
backdrop-blur-sm
z-40
transition
${mobileMenu ? "opacity-100" : "opacity-0 pointer-events-none"}
`}
                    onClick={() => setMobileMenu(false)}
                />

                <div
                    className={`
fixed
top-0
left-0
h-screen
w-72
bg-[#06081f]
z-50
transition-transform
duration-300
${mobileMenu ? "translate-x-0" : "-translate-x-full"}
`}
                >

                    <div className="flex justify-between items-center p-5">

                        <h2 className="text-white text-xl font-bold">
                            SR Creation
                        </h2>

                        <button
                            onClick={() => setMobileMenu(false)}
                            className="text-white"
                        >
                            <X />
                        </button>

                    </div>

                    <div className="flex flex-col mt-5">

                        <SmartLink href="/" className="p-4 text-gray-300 hover:bg-white/10">
                            <Home className="inline mr-3" />
                            Home
                        </SmartLink>

                        {session && liveOrder?.length > 0 && (

                            <SmartLink href="/track-order" className="p-4 text-gray-300 hover:bg-white/10">

                                <Truck className="inline mr-3" />

                                Track Order

                            </SmartLink>

                        )}

                        {session && (

                            <SmartLink href="/my-orders" className="p-4 text-gray-300 hover:bg-white/10">

                                <Package className="inline mr-3" />

                                My Orders

                            </SmartLink>

                        )}

                        <SmartLink href="/contact" className="p-4 text-gray-300 hover:bg-white/10">

                            <Phone className="inline mr-3" />

                            Contact

                        </SmartLink>

                        {session?.user?.role === "admin" && (

                            <SmartLink href="/admin" className="p-4 text-gray-300 hover:bg-white/10">

                                <Shield className="inline mr-3" />

                                Admin

                            </SmartLink>

                        )}

                        {session && (

                            <button

                                onClick={() => signOut({ callbackUrl: "/" })}

                                className="p-4 text-left text-red-400 hover:bg-red-500/10"

                            >

                                <LogOut className="inline mr-3" />

                                Logout

                            </button>

                        )}

                    </div>

                </div>

            </>
        </>
    );
}

export default Navbar;
