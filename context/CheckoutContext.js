// "use client";

// import {
//   createContext,
//   useContext,
//   useState
// } from "react";

// const CheckoutContext =
//   createContext();

// export const CheckoutProvider =
//   ({ children }) => {

//     const [
//       checkoutStep,
//       setCheckoutStep
//     ] = useState(1);

//     const [
//       orderCompleted,
//       setOrderCompleted
//     ] = useState(false);

//     return (

//       <CheckoutContext.Provider
//         value={{

//           checkoutStep,
//           setCheckoutStep,

//           orderCompleted,
//           setOrderCompleted

//         }}
//       >

//         {children}

//       </CheckoutContext.Provider>

//     );
//   };

// export const useCheckout =
//   () => useContext(
//     CheckoutContext
//   );