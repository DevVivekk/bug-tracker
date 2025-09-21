import { Request, Response, NextFunction } from "express";
import fs from "fs";
import jwt, { JwtPayload as DefaultPayload } from "jsonwebtoken";
import mongoose from "mongoose";

// Extend Request type to attach user payload
export interface JwtPayload extends DefaultPayload {
  user: {_id:string,role:string};
}

export interface AuthRequest extends Request {
  userid?: mongoose.Types.ObjectId,
  role?:string
}


// JWT verification middleware
export function verifyJWT(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.['bug-app-token']

    if (!token) {
      return res.status(401).json({ message: "Missing token" });
    }

    // Verify JWT using RS256
    const PUBLIC_KEY = fs.readFileSync("public.pem", "utf-8");
    const payload = jwt.verify(token, PUBLIC_KEY, {
      algorithms: ["RS256"],
      issuer: "bug-app"
    }) as JwtPayload;
    req.userid = new mongoose.Types.ObjectId(payload.user._id);
    req.role = payload.user.role;
    next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    return res.status(401).json({ message: "Invalid or expired token",status:false });
  }
}
