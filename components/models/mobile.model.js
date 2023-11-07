import mongoose from "mongoose";
import { string } from "zod";

const mobileSchema = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    playstore:{
        type:String,
    },
    appstore:{
        type:String,
    },
    type:{
        type:String,
        required:true
    },
    logo:{
        type:String,
    },
    images:[
        {
            type:String,
        }
    ]
},{timestamps:true})

const Mobile = mongoose.models.Mobile || mongoose.model('Mobile',mobileSchema)

export default Mobile;