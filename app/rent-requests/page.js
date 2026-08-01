"use client";

import { useEffect, useState } from "react";

export default function RentRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  async function fetchRequests() {
    try {
      const res = await fetch("/api/rent", {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error();
      }

      const data = await res.json();
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      // console.log(err);
    } finally {
      setLoading(false);
    }
  }

  const getWhatsAppLink = (phone, itemNeeded, studentName) => {
    const digits = String(phone || "").replace(/\D/g, "");
    const message = `Hi ${studentName || "there"}, I saw your rent request for "${itemNeeded || "an item"}" on the website. Is it still needed?`;
    return `https://wa.me/91${digits}?text=${encodeURIComponent(message)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-bold">
        Loading Borrow Requests...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-indigo-700 mb-12">
        Borrow Requests
      </h1>

      {requests.length === 0 ? (
        <div className="text-center text-xl text-gray-500">
          No Borrow requests available.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          {requests.map((request) => (
            <div
              key={request._id}
              className="bg-white rounded-3xl shadow-xl p-6 hover:shadow-2xl transition"
            >
              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-indigo-700">
                  {request.itemNeeded}
                </h2>

                <p>
                  <strong>Requested By:</strong> {request.studentName}
                </p>

                <p>
                  <strong>Branch:</strong> {request.branch}
                </p>

                <p>
                  <strong>Year:</strong> {request.year}
                </p>

                <p>
                  <strong>Phone:</strong> {request.phone}
                </p>

                <p>
                  <strong>WhatsApp:</strong> {request.whatsapp}
                </p>

                <hr />

                <p>
                  <strong>Reward:</strong> ₹{request.offeredMoney}
                </p>

                {(request.fromDate || request.toDate) && (
                  <p>
                    <strong>Date:</strong>
                    <br />
                    {request.fromDate || "--"} ➜ {request.toDate || "--"}
                  </p>
                )}

                {(request.fromTime || request.toTime) && (
                  <p>
                    <strong>Time:</strong>
                    <br />
                    {request.fromTime || "--"} ➜ {request.toTime || "--"}
                  </p>
                )}

                <p>
                  <strong>Meet At:</strong>
                  <br />
                  {request.meetLocation}
                </p>

                {request.description && (
                  <div>
                    <strong>Description</strong>
                    <p className="text-gray-600 mt-1">{request.description}</p>
                  </div>
                )}
              </div>

              <a
                href={getWhatsAppLink(
                  request.whatsapp,
                  request.itemNeeded,
                  request.studentName
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 block w-full rounded-xl bg-green-500 py-3 text-center text-lg font-bold text-white hover:bg-green-600 transition"
              >
                Message on WhatsApp
              </a>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}