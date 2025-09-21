import { Response } from "express";
import { AuthRequest } from "../../auth/loginAuthentication.js";
import bugmodel from "../../model/bugs.js";
import customError from "../../utils/customError.js";

const ctrl = {
    //bug submission and updation from the same route

    submitbug: async function(req:AuthRequest,res:Response){
        const {title,description,severity} = req.body;
        if(req.role!=="Admin"){
            if(req.body.bugid){ //bug id present then update
            await bugmodel.findOneAndUpdate({_id:req.body.bugid},
            {$set:{createdBy:req.userid,title,description,severity}},{new:true,upsert:false})
            return res.status(201).json({status:true,message:"Bug updated"})
        }else{//if not then insert
            await new bugmodel({createdBy:req.userid,title,description,severity}).save()
            return res.status(201).json({status:true,message:"Bug submitted"})
        }
        }else{
            throw new customError("You are not allowed to submit the bug!",401)   

        }
    },

    getallselfbugs:async function(req:AuthRequest,res:Response){
        const findall = await bugmodel.find({createdBy:req?.userid}).sort({createdAt:-1}).lean();
        return res.status(201).json({status:true,data:findall,message:"success"})
    }
}
export default ctrl;