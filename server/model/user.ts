import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required!"],
    trim: true,
    minLegth: [8, "Username length should be greater than 8 chars"],
    maxLength: [25, "Username length not be greater than 25 chars"],
  },
  password: {
    type: String,
    required: [true,"Password is required!"]
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    validate: {
      validator: function (email: string) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
      },
      message: (props: { value: string }) => `${props?.value} is not a valid email!`,
    },
  },
  role:{
    type:String,
    required:[true,'Role is required'],
    enum:["Reporter","Admin"]
  }
},{timestamps:true});

const usermodel = mongoose.model('user',userSchema); //usermodel handling signup,login and auth for both reporter and admin
export default usermodel;