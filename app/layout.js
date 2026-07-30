import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SessionWrapper from "@/components/SessionWrapper";
import { CartProvider } from "@/context/CartContext";
import RouteLoader from "@/components/RouteLoader";
import { Toaster } from "react-hot-toast";
// import { CheckoutProvider } from "@/context/CheckoutContext";
import NotificationProvider from "@/components/NotificationProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "HITK Stationary",
  description: "Get your style up!",
};

export default function RootLayout({ children }) {


  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionWrapper>
          <NotificationProvider />
          <CartProvider>
            <RouteLoader>
              {/* <CheckoutProvider> */}


              <Navbar />
              <div className="min-h-screen">

                {children}

              </div>
              <Footer />
              {/* </CheckoutProvider> */}
            </RouteLoader>
          </CartProvider>
        </SessionWrapper>
        <Toaster
          position="top-center"
          gutter={8}
          toastOptions={{
            duration: 3000,
            style: {
              background: "#18181b",
              color: "#fff",
              borderRadius: "16px",
              padding: "16px",
              fontSize: "15px",
            },

            success: {
              iconTheme: {
                primary: "#22c55e",
                secondary: "#fff",
              },
            },

            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#fff",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
