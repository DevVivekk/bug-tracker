import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config({})
async function connectDb(){
    mongoose.connect(process.env.MONGO_URL!).then(()=>console.log("Connected to db")).catch((err)=>console.log(err))
}
export default connectDb;