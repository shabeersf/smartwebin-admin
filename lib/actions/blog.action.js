"use server"
import Blog from "@/components/models/blog.model";
import { connectToDB } from "../mongoose";

import fs from 'fs/promises'; // Import the 'fs' module with promises support
import { revalidatePath } from "next/cache";

async function uploadImage(image) {
    const imageFile = image.get('image'); // Get the file input from FormData

    const currentDatetime = new Date().toISOString();
    const imageFilename = currentDatetime.replace(/:/g, '-') + '_' + imageFile.name;
    const imageFolder = './public/assets/images/';
    const imagePath = imageFolder + imageFilename;

    const imageData = await imageFile.arrayBuffer();

    await fs.writeFile(imagePath, Buffer.from(imageData));

    return imageFilename;
}


async function deleteImage(filename) {
    const imageFolder = './public/assets/images/';
    const imagePath = imageFolder + filename;

    try {
        // Check if the file exists before attempting to delete it
        await fs.access(imagePath);
        await fs.unlink(imagePath);
    } catch (error) {
        console.error(`Error deleting the image file: ${error.message}`);
    }
}

export async function createBlog({ title, path, date, description, image }) {
    try {
        connectToDB(); // Establish the database connection
        const imageFilename = await uploadImage(image);
        // return;
        const createdBlog = new Blog({
            title,
            date,
            description,
            image: imageFilename, // Save the image name to the database
        });

        await createdBlog.save();

        revalidatePath(path);
    } catch (error) {
        throw new Error(`${error.message}`);
    }
}


export async function fetchBlogList({ searchString = "",
    pageNumber,
    pageSize,
    sortBy = "desc" },
) {
    try {
        connectToDB();
        const skipAmount = (pageNumber - 1) * pageSize;
        searchString = String(searchString).trim();

        // Create a case-insensitive regular expression for the provided search string.
        const regex = new RegExp(searchString, "i");

        // Create an initial query object to filter blog.
        const query = {
            title: { $ne: "" }
        }


        // If the search string is not empty, add the $or operator to match either username or name fields.
        if (searchString.trim() !== "") {
            query.$or = [
                { title: { $regex: regex } },
            ];
        }

        // Define the sort options for the fetched blog based on createdAt field and provided sort order.
        const sortOptions = { createdAt: sortBy };

        const blogQuery = Blog.find(query)
            .sort(sortOptions)
            .skip(skipAmount)
            .limit(pageSize)

        // Count the total number of blog that match the search criteria (without pagination).
        const totalblogCount = await Blog.countDocuments(query);

        const blog = await blogQuery.exec();

        // Check if there are more blog beyond the current page.
        const isNext = totalblogCount > skipAmount + blog.length;

        return { blog, isNext };
    } catch (error) {
        throw new Error(`${error.message}`);
    }
}

export async function fetchBlog(id) {
    try {
        connectToDB();

        const blogFetch = await Blog.findOne({ _id: id })
        if (!blogFetch) {
            throw new Error(`No data exist on this id`);
        }
        return blogFetch;
    } catch (error) {
        throw new Error(`${error.message}`);
    }
}


export async function deleteBlog({ id, path }
) {
    try {
        connectToDB();
        const isBlogExist = await Blog.findOne({ _id: id })
        // console.log(isBlogExist)
        if (isBlogExist) {

            await deleteImage(isBlogExist.image)
           
            await Blog.deleteOne({ _id: id })
        }
        else {
            throw new Error(`No Blog exist`);
        }

        revalidatePath(path);
    } catch (error) {
        throw new Error(`${error.message}`);
    }
}

export async function updateBlog({ id, title, date, description, image }
) {
    try {
        // console.log(params);
        //           return ;
        await connectToDB()



        const isBlogExist = await Blog.findOne({ _id: id });
        let imageFileName;

        if (image === null) {
            imageFileName = isBlogExist.image
        }
        else {

            imageFileName = await uploadImage(image);
            await deleteImage(isBlogExist.image)
        }



        await Blog.findOneAndUpdate({ _id: id }, { title, date, image: imageFileName, description});

        revalidatePath('/admin/blog')

    } catch (error) {
        throw new Error(`${error.message}`);
    }
}