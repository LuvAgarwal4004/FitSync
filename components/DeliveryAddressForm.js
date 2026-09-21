import { Box, Button, Grid } from '@mui/material'
import React, { useEffect, useState } from 'react'
import AdressCard from './AdressCard'
import { useRouter } from 'next/navigation';
import { setGlobalLoading } from './RouteLoader';
import { useSession } from "next-auth/react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
// import { useCheckout } from "@/context/CheckoutContext";

const DeliveryAddressForm = () => {

  const router = useRouter();

  const [address, setAddress] = useState(null);
  const { data: session } = useSession();
  const [selectedState, setSelectedState] =
    useState("");
  const states = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Lakshadweep",
    "Puducherry"
  ];
  // const {
  //   setCheckoutStep
  // } = useCheckout();


  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const address = {
      firstName: data.get("firstName"),
      lastName: data.get("lastName"),
      streetAddress: data.get("address"),
      city: data.get("city"),
      state: selectedState,
      mobile: data.get("phoneNumber"),
    };

    localStorage.setItem(
      `address-${session.user.email}`,
      JSON.stringify(address)
    );
    await fetch("/api/user/address", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(address)
    });
    if (typeof setGlobalLoading === "function") {
      setGlobalLoading(true);
    }
    setTimeout(async () => {
      const res = await fetch(
        "/api/checkout/update-step",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            step: 3
          })
        }
      );

      const data = await res.json();

      console.log("UPDATE STEP:", data);
      console.log("STATUS:", res.status);
      if (!res.ok) {
        const err = await res.json();
        console.log(err);
        return;
      }

      router.push("/checkout?step=3");

      setTimeout(() => {
        setGlobalLoading(false); // STOP LOADER AFTER PAGE LOAD FEEL
      }, 800);
    }, 1);
  };
  useEffect(() => {

    if (!session?.user?.email) return;

    const savedAddress =
      localStorage.getItem(
        `address-${session.user.email}`
      );

    if (savedAddress) {
      const parsed =
        JSON.parse(savedAddress);

      setAddress(parsed);

      setSelectedState(
        parsed.state || ""
      );
    }

  }, [session]);


  return (
    <div>
      <Grid container spacing={3}>
        <Grid
          item
          xs={12}
          lg={4}
        >
          <div
            className="
      bg-white
      rounded-3xl
      border
      shadow-lg
      overflow-hidden
      h-fit
      lg:sticky
      lg:top-6
    "
          >

            <div className="p-6">

              <h2 className="text-xl font-bold mb-5">
                Saved Address
              </h2>

              <AdressCard address={address} />

            </div>

          </div>
        </Grid>
        <Grid item xs={12} lg={8}>
          <Box
            className="
    bg-white
    rounded-3xl
    border
    shadow-lg
    p-6
    sm:p-8
  "
          >
            <h2 className="text-2xl font-bold mb-8">
              Delivery Address
            </h2>
            <form onSubmit={handleSubmit} className="space-y-7">
              <div className="grid
grid-cols-1
md:grid-cols-2
gap-5">
                <div>
                  <label htmlFor="firstName" className="mb-2 block text-sm font-semibold font-medium text-gray-700">First Name</label>
                  <input type="text" id="firstName" name="firstName" defaultValue={address?.firstName || ""}
                    className="w-full border  border-gray-300 bg-white px-4 py-3 text-gray-900 
               focus:border-transparent focus:ring-2 focus:ring-black focus:outline-none"
                    placeholder="John" required />
                </div>
                <div>
                  <label htmlFor="lastName" className="mb-2 block text-sm font-semibold font-medium text-gray-700">Last Name</label>
                  <input defaultValue={address?.lastName || ""} type="text" id="lastName" name="lastName" className="
w-full
rounded-xl
border
border-gray-300
bg-white
px-4
py-3
text-gray-900
transition

focus:outline-none
focus:ring-2
focus:ring-blue-500
focus:border-blue-500
" placeholder="Doe" required />
                </div>
              </div>

              <div>
                <label htmlFor="address" className="mb-2 block text-sm font-semibold font-medium text-gray-700">Address</label>
                <input defaultValue={address?.streetAddress || ""} type="address" id="address" name="address" className="
w-full
rounded-xl
border
border-gray-300
bg-white
px-4
py-3
text-gray-900
transition

focus:outline-none
focus:ring-2
focus:ring-blue-500
focus:border-blue-500
" placeholder="Address" required />
              </div>

              <div>
                <label htmlFor="city" className="mb-2 block text-sm font-semibold font-medium text-gray-700">City</label>
                <input defaultValue={address?.city || ""} type="text" id="city" name="city" className="
w-full
rounded-xl
border
border-gray-300
bg-white
px-4
py-3
text-gray-900
transition

focus:outline-none
focus:ring-2
focus:ring-blue-500
focus:border-blue-500
" placeholder=" City" required />
                {/* <p className="mt-2 text-xs text-gray-500">Must be at least 8 characters with numbers and symbols</p> */}
              </div>
              <div>
                <label htmlFor="state" className="mb-2 block text-sm font-semibold font-medium text-gray-700">State</label>
                {/* <select
                  id="state"
                  name="state"
                  value={selectedState}
                  onChange={(e) =>
                    setSelectedState(e.target.value)}
                  className="w-full
rounded-xl
border
border-gray-300
bg-white
px-4
py-3
transition
focus:border-blue-500
focus:ring-2
focus:ring-blue-200
outline-none"
                  required
                >
                  <option value="">
                    Select State
                  </option>

                  <option value="West Bengal">
                    West Bengal
                  </option>

                  <option value="Maharashtra">
                    Maharashtra
                  </option>

                  <option value="Delhi">
                    Delhi
                  </option>

                  <option value="Karnataka">
                    Karnataka
                  </option>

                  <option value="Tamil Nadu">
                    Tamil Nadu
                  </option>

                  <option value="Uttar Pradesh">
                    Uttar Pradesh
                  </option>

                  <option value="Gujarat">
                    Gujarat
                  </option>

                  {/* add remaining states */}
                {/* </select>  */}
                <Autocomplete
                  id="state"
                  name="state"
                  options={states}
                  value={selectedState}
                  onChange={(event, newValue) =>
                    setSelectedState(newValue || "")
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="State"
                      required
                    />
                  )}
                />
                {/* <input defaultValue={address?.state || ""} type="text" id="state" name="state" className="w-full
rounded-xl
border
border-gray-300
bg-white
px-4
py-3
transition
focus:border-blue-500
focus:ring-2
focus:ring-blue-200
outline-none text-gray-900 focus:border-transparent focus:ring-2 focus:ring-black focus:outline-none" placeholder=" City" required /> */}
                {/* <p className="mt-2 text-xs text-gray-500">Must be at least 8 characters with numbers and symbols</p> */}
              </div>


              <div>
                <label htmlFor="phoneNumber" className="mb-2 block text-sm font-semibold font-medium text-gray-700">Phone Number</label>
                <input defaultValue={address?.mobile || ""} type="tel" id="phoneNumber" name="phoneNumber" className="
w-full
rounded-xl
border
border-gray-300
bg-white
px-4
py-3
text-gray-900
transition

focus:outline-none
focus:ring-2
focus:ring-blue-500
focus:border-blue-500
" placeholder="" required />
              </div>

              <button
                type="submit"
                className="
w-full
sm:w-auto

bg-gradient-to-r
from-blue-600
to-indigo-700

text-white

px-10
py-3

rounded-xl

font-semibold

shadow-lg

hover:scale-105
transition-all
"
              >
                Deliver Here
              </button>
            </form>
          </Box>
        </Grid>

      </Grid>
    </div>
  )
}

export default DeliveryAddressForm
