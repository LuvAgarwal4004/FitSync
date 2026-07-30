import {NextResponse} from "next/server";
import connectDB from "@/db/connectDb";
import NotificationToken from "@/models/NotificationToken";


export async function POST(req){


try{

await connectDB();


const {token,userId}=await req.json();


await NotificationToken.findOneAndUpdate(

 {token},

 {
  token,
  user:userId
 },

 {
  upsert:true,
  new:true
 }

);


return NextResponse.json({
success:true
});


}
catch(error){

console.log(error);

return NextResponse.json(
{
error:"failed"
},
{
status:500
}
)

}


}