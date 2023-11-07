import mongoose from "mongoose";

const printSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
    },
    image: String,

}, { timestamps: true })

const Print = mongoose.models.Print || mongoose.model("Print", printSchema)

export default Print;