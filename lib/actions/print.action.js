"use server"
import Print from "@/components/models/print.model";
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

export async function fetchPrintList({ searchString = "",
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

    // Create an initial query object to filter print.
    const query = {
      title: { $ne: "" }
    }


    // If the search string is not empty, add the $or operator to match either username or name fields.
    if (searchString.trim() !== "") {
      query.$or = [
        { title: { $regex: regex } },
      ];
    }

    // Define the sort options for the fetched print based on createdAt field and provided sort order.
    const sortOptions = { createdAt: sortBy };

    const printQuery = Print.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize)

    // Count the total number of print that match the search criteria (without pagination).
    const totalprintCount = await Print.countDocuments(query);

    const print = await printQuery.exec();

    // Check if there are more print beyond the current page.
    const isNext = totalprintCount > skipAmount + print.length;

    return { print, isNext };
  } catch (error) {
    throw new Error(`${error.message}`);
  }
}

export async function createPrint({ title, path, image }) {
  try {
    connectToDB(); // Establish the database connection

    const imageFilename = await uploadImage(image);

    const createdPrint = new Print({
      title,
      image: imageFilename, // Save the image name to the database
    });

    await createdPrint.save();

    revalidatePath(path);
  } catch (error) {
    throw new Error(`${error.message}`);
  }
}

export async function fetchPrint(id) {
  try {
    connectToDB();

    const printFetch = await Print.findOne({ _id: id })
    if (!printFetch) {
      throw new Error(`No data exist on this id`);
    }
    return printFetch;
  } catch (error) {
    throw new Error(`${error.message}`);
  }
}
export async function updatePrint({ id, title, image }
) {
  try {
    await connectToDB()



    const isPrintExist = await Print.findOne({ _id: id });
    let imageFilename;

    if (image === null) {
      imageFilename = isPrintExist.image
    }
    else {

      imageFilename = await uploadImage(image);
      await deleteImage(isPrintExist.image)
    }

    await Print.findOneAndUpdate({ _id: id }, { title, image: imageFilename });

    revalidatePath('/admin/print')

  } catch (error) {
    throw new Error(`${error.message}`);
  }
}

export async function deletePrint({ id, path }
  ) {
    try {
      connectToDB();
      const isPrintExist = await Print.findOne({ _id: id })
      // console.log(isPrintExist)
      if (isPrintExist) {
  
        await Print.deleteOne({ _id: id })
        await deleteImage(isPrintExist.image)
      }
      else {
        throw new Error(`No Print exist`);
      }
  
      revalidatePath(path);
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  }