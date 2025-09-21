import mongoose from "mongoose";
const bugReport = new mongoose.Schema({
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        required:[true,"Bug reporter ID is mandatory!"],
        ref:'user'
    },
    updatedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    title:{
        type:String,
        required:[true,'Bug title is mandatory!'],
        trim:true,
    },
    description:{
        type:String,
        required:[true,'Bug description is mandatory!'],
        trim:true,
    },
    severity:{
        type:String,
        required:[true,'Bug Severity is mandatory!'],
        enum:['low','moderate','high','extreme']
    },
    status:{
        type:String,
        enum:['open','onhold','closed'],
        default:'open'
    },
    updatedTimeByAdmin:{
        type:Date,
    },
    remark:{
        type:String,
        trim:true
    }
},{timestamps:true})

const bugmodel = mongoose.model('bugs',bugReport)
export default bugmodel