import mongoose from "mongoose";

const portfolioSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    linkUrl: {
        type: String,
    },
    image: {
        type: String,
        // required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    }
}, {
    timestamps: true
})

const Portfolio = mongoose.models.Portfolio || mongoose.model("Portfolio",portfolioSchema)

export default Portfolio;