import { Response } from "express";
import { AuthRequest } from "../../auth/loginAuthentication.js";
import bugmodel from "../../model/bugs.js";
import customError from '../../utils/customError.js'

const ctrl = {
   //get all bugs
   getallbugs:async function(req:AuthRequest,res:Response){
    if(req.role!=="Admin") throw new customError("You are not allowed",400)
    const findbugs = await bugmodel.aggregate([
  {
  $sort: { createdAt: -1 }
  },
  {
    $group: {
      _id: "$createdBy",  
      bugs: { $push: "$$ROOT" }, 
      bugCount: { $sum: 1 }
    }
  },
  {
    $lookup: {
      from: "users",      
      localField: "_id", 
      foreignField: "_id",
      as: "userDetails"
    }
  },
  {
    $unwind: "$userDetails"
  },
  {
    $unset:"userDetails.creadtedBy"
  },
  {
    $unset:"bugs.createdBy" //removing unecessary fields using unset
  },
  {
    $unset:"bugs.updatedBy"
  },
  {
    $project: {
      _id: 0,
      bugCount: 1,
      bugs:1,
      username: "$userDetails.username",
      email: "$userDetails.email"
    }
  }
]);

    res.status(201).json({status:true,message:"Success",data:findbugs})
   },

    //update bugs
    updatebug: async function(req:AuthRequest,res:Response){
        const {title,description,severity,bugid,remark,status} = req.body;
        if(!bugid){
            throw new customError("Bug id is absent!",401)
        }
        if(req.role==="Admin"){
            await bugmodel.findOneAndUpdate({_id:req.body.bugid},
                {$set:{updatedBy:req.userid,status,updatedTimeByAdmin:new Date(),remark,title,description,severity}},{new:true,runValidators:true,upsert:false})
            return res.status(201).json({status:true,message:"Bug submitted"})
        }else{
        throw new customError("You are not allowed to update the bug!",401)   
        }
    }
}
export default ctrl;