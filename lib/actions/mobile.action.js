"use server"
import Mobile from "@/components/models/mobile.model";
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


async function uploadmultiImage(formData) {
  try {
    const imageFiles = formData.getAll('images[]');
    //     console.log(imageFiles);
    //     console.log(formData);

    // return;
    if (!imageFiles || imageFiles.length === 0) {
      throw new Error('No image files found in FormData.');
    }

    const imageFilenames = [];

    for (const imageFile of imageFiles) {
      const currentDatetime = new Date().toISOString();
      const imageFilename = currentDatetime.replace(/:/g, '-') + '_' + imageFile.name;
      const imageFolder = './public/assets/images/';
      const imagePath = imageFolder + imageFilename;

      const imageData = await imageFile.arrayBuffer();

      await fs.writeFile(imagePath, Buffer.from(imageData));
      imageFilenames.push(imageFilename);
    }

    return imageFilenames;
  } catch (error) {
    console.error(`Error uploading multiple images: ${error.message}`);
    throw error;
  }
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

export async function createMobile({ title, path, appstore, playstore, type, description, logo, images }) {
  try {
    connectToDB(); // Establish the database connection
    // console.log(images)
    const imageFilename = await uploadImage(logo);
    const imageFilenames = await uploadmultiImage(images);
    // console.log(imageFilenames)
    // return;
    const createdMobile = new Mobile({
      title,
      appstore,
      playstore,
      type,
      description,
      logo: imageFilename, // Save the image name to the database
      images: imageFilenames, // Save the image name to the database
    });

    await createdMobile.save();

    revalidatePath(path);
  } catch (error) {
    throw new Error(`${error.message}`);
  }
}


export async function fetchMobileList({ searchString = "",
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

    // Create an initial query object to filter mobile.
    const query = {
      title: { $ne: "" }
    }


    // If the search string is not empty, add the $or operator to match either username or name fields.
    if (searchString.trim() !== "") {
      query.$or = [
        { title: { $regex: regex } },
      ];
    }

    // Define the sort options for the fetched mobile based on createdAt field and provided sort order.
    const sortOptions = { createdAt: sortBy };

    const mobileQuery = Mobile.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize)

    // Count the total number of mobile that match the search criteria (without pagination).
    const totalmobileCount = await Mobile.countDocuments(query);

    const mobile = await mobileQuery.exec();

    // Check if there are more mobile beyond the current page.
    const isNext = totalmobileCount > skipAmount + mobile.length;

    return { mobile, isNext };
  } catch (error) {
    throw new Error(`${error.message}`);
  }
}

export async function fetchMobile(id) {
  try {
    connectToDB();

    const mobileFetch = await Mobile.findOne({ _id: id })
    if (!mobileFetch) {
      throw new Error(`No data exist on this id`);
    }
    return mobileFetch;
  } catch (error) {
    throw new Error(`${error.message}`);
  }
}

export async function deleteMultiImage({ id, image }) {
  try {
    connectToDB();
    // console.log(id)
    // return;
    const deleteArray = await Mobile.updateOne(
      { _id: id }, // Filter the document by its ID
      { $pull: { images: image } }, // Use $pull to remove the specified image from the array
    )
    if (deleteArray) {
      await deleteImage(image)

    }
    else {
      throw new Error(`Couldn't delete the image`);
    }
  } catch (error) {
    throw new Error(`${error.message}`);
  }

}

export async function deleteMobile({ id, path }
) {
  try {
    connectToDB();
    const isMobileExist = await Mobile.findOne({ _id: id })
    // console.log(isMobileExist)
    if (isMobileExist) {

      await deleteImage(isMobileExist.logo)
      for (const image of isMobileExist.images) {
        await deleteImage(image);
      }
      await Mobile.deleteOne({ _id: id })
    }
    else {
      throw new Error(`No Mobile exist`);
    }

    revalidatePath(path);
  } catch (error) {
    throw new Error(`${error.message}`);
  }
}

export async function updateMobile({ id, title, appstore, playstore, type, description, logo, images }
) {
  try {
    // console.log(params);
    //           return ;
    await connectToDB()



    const isMobileExist = await Mobile.findOne({ _id: id });
    let logoFileName;

    if (logo === null) {
      logoFileName = isMobileExist.logo
    }
    else {

      logoFileName = await uploadImage(logo);
      await deleteImage(isMobileExist.logo)
    }

    let imagesFileName;

    if (images === null) {
      imagesFileName = isMobileExist.images
    }
    else {

      const imagesUpload = await uploadmultiImage(images);
      imagesFileName = [...isMobileExist.images, ...imagesUpload];

    }

    await Mobile.findOneAndUpdate({ _id: id }, { title, appstore, playstore, type, logo: logoFileName, description, images: imagesFileName });

    revalidatePath('/admin/mobile')

  } catch (error) {
    throw new Error(`${error.message}`);
  }
}