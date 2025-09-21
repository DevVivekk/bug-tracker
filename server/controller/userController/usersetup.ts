import { Request, Response } from "express";
import usermodel from "../../model/user.js";
import customError from "../../utils/customError.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import fs from "fs";
import { AuthRequest } from "../../auth/loginAuthentication.js";
import mongoose from "mongoose";
dotenv.config({});

const ctrl = {
  //user signup controller
  signup: async function (req: Request, res: Response) {
    //try{
    const { email, username, password, role } = req.body;
    if (password.length >= 50 || password.length <= 8) {
      throw new customError(
        "Invalid password length! It should be 8-50 chars",
        400
      );
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashpassword = await bcrypt.hash(password, salt);
      await new usermodel({
        email,
        password: hashpassword,
        username,
        role,
      }).save();
      res.status(200).json({ status: true, message: "User created!" });
    }
    //implemented global error handler no need of try catch handling
    // }catch(err){
    //     if(err instanceof Error){
    //     res.status(500).json({status:false,message:err.message})
    //     return;
    //     }
    // }
  },

  //user login controller
  login: async function (req: Request, res: Response) {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new customError(
        "Invalid password length! It should be 8-50 chars",
        400
      );
    }
    const user = await usermodel.findOne({ email }).lean();
    if (user) {
      const verifypassword = await bcrypt.compare(password, user.password);
      if (verifypassword) {
        //generate token
        const privateKey = fs.readFileSync("./private.pem", "utf-8");
        const token = jwt.sign({ user: {_id:user._id,role:user.role} }, privateKey, {
          expiresIn: "2d",
          issuer: "bug-app",
          algorithm: "RS256",
        });
        res.cookie("bug-app-token", token, {
          httpOnly: true,
          secure: false, 
          sameSite: "strict",
          maxAge: 2 * 24 * 60 * 60 * 1000, //for 2 days
        });

        res.json({ message: "Logged in!",status:true,role:user.role==='Admin'?'Admin':'Reporter' });
      } else {
        throw new customError("Invalid password or email", 401);
      }
    } else {
      throw new customError("Invalid email", 401);
    }
  },

  //user info controller
  getUserInfo:async function(req:AuthRequest,res:Response){
    const finduser = await usermodel.findOne({_id:new mongoose.Types.ObjectId(req?.userid!)}).lean()
    return res.status(201).json({status:true,data:finduser,message:"Success"})
  }
};
export default ctrl;
