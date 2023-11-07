import mongoose from "mongoose";

const otherSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    cover_img: {
        type: String,
        required: true
    },
    images: [
        {
            type: String,
            required: true
        }
    ]
}, { timestamps: true })

const Other = mongoose.models.Other || mongoose.model("Other", otherSchema)

export default Other;