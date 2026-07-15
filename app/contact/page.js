import React from "react";
import { Mail, Phone, Clock, MapPin } from "lucide-react";

const Page = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">

        {/* Left Side */}
        <div className="bg-[#06081f] text-white p-8 md:p-10 flex flex-col justify-center">

          <h1 className="text-4xl font-bold mb-4">
            Contact Us
          </h1>

          <p className="text-gray-300 leading-7">
            Have questions about your order, products, or anything else?
            We'd love to hear from you.
          </p>

          <div className="mt-10 space-y-6">

            <div className="flex items-center gap-4">
              <Mail className="text-blue-400" size={24} />
              <div>
                <p className="text-gray-400 text-sm">
                  Email
                </p>
                <p className="font-medium break-all">
                  rupam3059@gmail.com
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Phone className="text-green-400" size={24} />
              <div>
                <p className="text-gray-400 text-sm">
                  Phone
                </p>
                <p className="font-medium">
                  +91 7003385269
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Clock className="text-yellow-400" size={24} />
              <div>
                <p className="text-gray-400 text-sm">
                  Business Hours
                </p>
                <p className="font-medium">
                  Monday - Saturday
                </p>
                <p className="text-sm text-gray-300">
                  9:00 AM – 8:00 PM
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Right Side */}
        <div className="p-8 md:p-10 flex flex-col justify-center">

          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            Get In Touch
          </h2>

          <p className="text-gray-500 mb-8 leading-7">
            Whether you have a question about your order, shipping,
            returns, or our collections, we're here to help.
          </p>

          <div className="space-y-5">

            <div className="rounded-xl border border-gray-200 p-5 hover:shadow-lg transition">

              <div className="flex items-center gap-3">

                <Mail className="text-blue-600" />

                <div>
                  <p className="font-semibold">
                    Email Support
                  </p>

                  <p className="text-gray-500 text-sm break-all">
                    rupam3059@gmail.com
                  </p>
                </div>

              </div>

            </div>

            <div className="rounded-xl border border-gray-200 p-5 hover:shadow-lg transition">

              <div className="flex items-center gap-3">

                <Phone className="text-green-600" />

                <div>
                  <p className="font-semibold">
                    Phone Support
                  </p>

                  <p className="text-gray-500 text-sm">
                    +91 7003385269
                  </p>
                </div>

              </div>

            </div>

            <div className="rounded-xl border border-gray-200 p-5 hover:shadow-lg transition">

              <div className="flex items-center gap-3">

                <MapPin className="text-red-500" />

                <div>
                  <p className="font-semibold">
                    Service Area
                  </p>

                  <p className="text-gray-500 text-sm">
                    Available across India 🇮🇳
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Page;