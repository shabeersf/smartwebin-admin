import mongoose from "mongoose";

const categorySchema = mongoose.Schema({
    title:{
        type: String,
        required: true,
        unique:true
    },
    status:{
        type:Boolean,
        default:true,
    }
},{
    timestamps:true
})

const Category = mongoose.models.Category || mongoose.model("Category",categorySchema)

export default Category;