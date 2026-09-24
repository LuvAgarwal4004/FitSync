"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Loading from "@/app/loading";

export let setGlobalLoading;

export default function RouteLoader({ children }) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true); // 🔥 START TRUE

  useEffect(() => {
    setGlobalLoading = (val) => setLoading(val);
  }, []);

  useEffect(() => {
    // ALWAYS show loader for at least 1.2s
    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 500); // adjust this (1000–2000ms feels premium)

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <>
  {children}
   <div className={`loader-wrapper ${loading ? "show" : "hide"}`}>
    <Loading />
  </div>
    </>
  );
}