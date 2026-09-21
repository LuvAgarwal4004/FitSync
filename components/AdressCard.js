import React from "react";

const AddressCard = ({ address }) => {
  if (!address) {
    return (
      <div className="bg-white border rounded-2xl p-6 text-center shadow-sm">
        <p className="text-gray-500">No address added yet.</p>
      </div>
    );
  }

  return (
    <div
      className="
        bg-white
        rounded-2xl
        border
        shadow-md
        p-6
        space-y-5
        hover:shadow-lg
        transition-shadow
      "
    >
      {/* Name */}
      <div>
        <h3 className="text-xl font-bold text-gray-900">
          👤 {address.firstName} {address.lastName}
        </h3>
      </div>

      {/* Address */}
      <div className="space-y-1">
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
          Delivery Address
        </p>

        <p className="text-gray-700 leading-7 break-words">
          📍 {address.streetAddress}
          <br />
          {address.city}, {address.state}
        </p>
      </div>

      {/* Phone */}
      <div className="pt-4 border-t">
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
          Contact
        </p>

        <p className="text-gray-800 font-medium mt-1">
          📞 {address.mobile}
        </p>
      </div>
    </div>
  );
};

export default AddressCard;