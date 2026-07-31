// import { NextResponse } from "next/server";
// import connectDB from "@/db/connectDb";
// import NotificationToken from "@/models/NotificationToken";


// export async function POST(req) {


//     try {

//         await connectDB();


//         const { token, userId } = await req.json();


//         // await NotificationToken.findOneAndUpdate(

//         //  {token},

//         //  {
//         //   token,
//         //   user:userId
//         //  },

//         //  {
//         //   upsert:true,
//         //   new:true
//         //  }

//         // );
//         await NotificationToken.findOneAndUpdate(
//             { user: userId },
//             {
//                 token,
//                 user: userId,
//             },
//             {
//                 upsert: true,
//                 new: true,
//             }
//         );

//         return NextResponse.json({
//             success: true
//         });


//     }
//     catch (error) {

//         console.log(error);

//         return NextResponse.json(
//             {
//                 error: "failed"
//             },
//             {
//                 status: 500
//             }
//         )

//     }


// }
import { NextResponse } from "next/server";
import connectDB from "@/db/connectDb";
import NotificationToken from "@/models/NotificationToken";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    console.log("BODY:");
    console.log(body);

    const { token, userId } = body;

    console.log("token =", token);
    console.log("userId =", userId);

    const result = await NotificationToken.findOneAndUpdate(
      { user: userId },
      {
        token,
        user: userId,
      },
      {
        upsert: true,
        new: true,
      }
    );

    console.log("RESULT:");
    console.log(result);

    return NextResponse.json({
      success: true,
    });

  } catch (error) {
    console.error("FULL ERROR:");
    console.error(error);

    return NextResponse.json(
      {
        error: error.message,
        stack: error.stack,
      },
      {
        status: 500,
      }
    );
  }
}