"use server";

import { revalidatePath } from "next/cache";
import { connectToDB } from "../mongoose";
import Portfolio from "@/components/models/portfolio.model";



import fs from 'fs/promises'; // Import the 'fs' module with promises support
import Category from "@/components/models/category.model";

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

export async function createPortfolio({ title, path, linkUrl, category, image }) {
  try {
    connectToDB(); // Establish the database connection

    const imageFilename = await uploadImage(image);

    const createdPortfolio = new Portfolio({
      title,
      linkUrl,
      category,
      image: imageFilename, // Save the image name to the database
    });

    await createdPortfolio.save();

    revalidatePath(path);
  } catch (error) {
    throw new Error(`${error.message}`);
  }
}


export async function updatePortfolio({ id, title, linkUrl, category, image }
) {
  try {
    await connectToDB()



    const isPortfolioExist = await Portfolio.findOne({ _id: id });
    let imageFilename;

    if (image===null) {
      imageFilename= isPortfolioExist.image
    }
    else {

       imageFilename = await uploadImage(image);
       await deleteImage(isPortfolioExist.image)
    }

    await Portfolio.findOneAndUpdate({ _id: id }, { title, linkUrl, category,image: imageFilename });

    revalidatePath('/admin/website')

  } catch (error) {
    throw new Error(`${error.message}`);
  }
}
export async function fetchcatList() {

  try {
    connectToDB();

    const categoryList = await Category.find({ status: true }).select("title _id")

    return categoryList;
  } catch (error) {
    throw new Error(`${error.message}`);
  }
}

export async function fetchPortfolioList({ searchString = "",
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

    // Create an initial query object to filter portfolio.
    const query = {
      title: { $ne: "" }
    }


    // If the search string is not empty, add the $or operator to match either username or name fields.
    if (searchString.trim() !== "") {
      query.$or = [
        { title: { $regex: regex } },
      ];
    }

    // Define the sort options for the fetched portfolio based on createdAt field and provided sort order.
    const sortOptions = { createdAt: sortBy };

    const portfolioQuery = Portfolio.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize)
      .populate('category');
    // Count the total number of portfolio that match the search criteria (without pagination).
    const totalportfolioCount = await Portfolio.countDocuments(query);

    const portfolio = await portfolioQuery.exec();

    // Check if there are more portfolio beyond the current page.
    const isNext = totalportfolioCount > skipAmount + portfolio.length;

    return { portfolio, isNext };
  } catch (error) {
    throw new Error(`${error.message}`);
  }
}


export async function deletePortfolio({ id, path }
) {
  try {
    connectToDB();
    const isPortfolioExist = await Portfolio.findOne({ _id: id })
    // console.log(isPortfolioExist)
    if (isPortfolioExist) {

      await Portfolio.deleteOne({ _id: id })
      await deleteImage(isPortfolioExist.image)
    }
    else {
      throw new Error(`No Portfolio exist`);
    }

    revalidatePath(path);
  } catch (error) {
    throw new Error(`${error.message}`);
  }
}

export async function fetchPortfolio(id) {
  try {
    connectToDB();

    const porfolioFetch = await Portfolio.findOne({ _id: id })
    if (!porfolioFetch) {
      throw new Error(`No data exist on this id`);
    }
    return porfolioFetch;
  } catch (error) {
    throw new Error(`${error.message}`);
  }
}