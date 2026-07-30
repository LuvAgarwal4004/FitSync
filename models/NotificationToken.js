import mongoose from "mongoose";


const NotificationTokenSchema =
new mongoose.Schema({

 user:{
   type:mongoose.Schema.Types.ObjectId,
   ref:"User"
 },

 token:{
   type:String,
   required:true,
   unique:true
 },


 createdAt:{
   type:Date,
   default:Date.now
 }

});


export default mongoose.models.NotificationToken ||
mongoose.model(
"NotificationToken",
NotificationTokenSchema
);