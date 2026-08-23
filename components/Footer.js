import React from "react";

const Footer = () => {
  return (
    <footer className="mt-16">

      <div className="bg-slate-900 text-white">

        <div className="max-w-7xl mx-auto px-6 py-10">

          {/* Divider */}
          <div className="h-px bg-slate-700 mb-8"></div>

          {/* Footer Content */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">

            {/* Brand */}
            <div className="text-center md:text-left">

              <h2 className="text-2xl font-bold">
                FitSync
              </h2>

              <p className="text-gray-400 text-sm mt-2">
                Help your friends in the college
              </p>

            </div>

            {/* Links */}
            <div className="flex flex-wrap justify-center gap-6 text-sm">

              <a
                href="/"
                className="hover:text-blue-400 transition"
              >
                Home
              </a>

              {/* <a
                href="/collections"
                className="hover:text-blue-400 transition"
              >
                Collections
              </a> */}

              <a
                href="/contact"
                className="hover:text-blue-400 transition"
              >
                Contact
              </a>

              {/* <a
                href="/privacy"
                className="hover:text-blue-400 transition"
              >
                Privacy Policy
              </a> */}

            </div>

          </div>

          {/* Bottom */}
          <div className="border-t border-slate-700 mt-8 pt-6 text-center text-gray-400 text-sm">

            © {new Date().getFullYear()}{" "}
            <span className="font-semibold text-white">
              FitSync
            </span>
            . All Rights Reserved.

          </div>

        </div>

      </div>

    </footer>
  );
};

export default Footer;