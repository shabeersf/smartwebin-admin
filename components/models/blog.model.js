import mongoose from "mongoose";

const blogSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        min: '1987-09-28'
    },
    description: {
        type: String,
        required: true
    }
})

const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema)

export default Blog;