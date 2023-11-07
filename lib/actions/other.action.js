"use server"
import Other from "@/components/models/other.model";
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

export async function createOther({ title, path, cover_img,images }) {
  try {
    connectToDB(); // Establish the database connection
    // console.log(images)
    const imageFilename = await uploadImage(cover_img);
    const imageFilenames = await uploadmultiImage(images);
    // console.log(imageFilenames)
    // return;
    const createdOther = new Other({
      title,
      cover_img: imageFilename, // Save the image name to the database
      images: imageFilenames, // Save the image name to the database
    });

    await createdOther.save();

    revalidatePath(path);
  } catch (error) {
    throw new Error(`${error.message}`);
  }
}


export async function fetchOtherList({ searchString = "",
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

    // Create an initial query object to filter other.
    const query = {
      title: { $ne: "" }
    }


    // If the search string is not empty, add the $or operator to match either username or name fields.
    if (searchString.trim() !== "") {
      query.$or = [
        { title: { $regex: regex } },
      ];
    }

    // Define the sort options for the fetched other based on createdAt field and provided sort order.
    const sortOptions = { createdAt: sortBy };

    const otherQuery = Other.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize)

    // Count the total number of other that match the search criteria (without pagination).
    const totalOtherCount = await Other.countDocuments(query);

    const other = await otherQuery.exec();

    // Check if there are more other beyond the current page.
    const isNext = totalOtherCount > skipAmount + other.length;

    return { other, isNext };
  } catch (error) {
    throw new Error(`${error.message}`);
  }
}

export async function fetchOther(id) {
    try {
      connectToDB();
  
      const OtherFetch = await Other.findOne({ _id: id })
      if (!OtherFetch) {
        throw new Error(`No data exist on this id`);
      }
      return OtherFetch;
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  }

  export async function deleteMultiImage({id,image}) {
    try {
      connectToDB();
      // console.log(id)
      // return;
    const deleteArray = await Other.updateOne(
      { _id: id }, // Filter the document by its ID
      { $pull: { images: image } }, // Use $pull to remove the specified image from the array
    )
      if(deleteArray)
      {
        await deleteImage(image)
        
      }
      else
      {
        throw new Error(`Couldn't delete the image`);
      }   
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  
  }

  export async function deleteOther({ id, path }
    ) {
      try {
        connectToDB();
        const isOtherExist = await Other.findOne({ _id: id })
        // console.log(isOtherExist)
        if (isOtherExist) {
    
          await deleteImage(isOtherExist.cover_img)
          for (const image of isOtherExist.images) {
            await deleteImage(image);
          }
          await Other.deleteOne({ _id: id })
        }
        else {
          throw new Error(`No Other exist`);
        }
    
        revalidatePath(path);
      } catch (error) {
        throw new Error(`${error.message}`);
      }
    }
    
    export async function updateOther({ id,title,cover_img,images }
      ) {
        try {
// console.log(params);
//           return ;
          await connectToDB()
      
      
      
          const isOtherExist = await Other.findOne({ _id: id });
          let cover_imgFileName;
      
          if (cover_img===null) {
            cover_imgFileName= isOtherExist.cover_img
          }
          else {
      
             cover_imgFileName = await uploadImage(cover_img);
             await deleteImage(isOtherExist.cover_img)
          }

          let imagesFileName;

          if (images===null) {
            imagesFileName= isOtherExist.images
          }
          else {
      
            const imagesUpload = await uploadmultiImage(images);
            imagesFileName = [...isOtherExist.images, ...imagesUpload];

          }
      
          await Other.findOneAndUpdate({ _id: id }, { title, cover_img: cover_imgFileName,images:imagesFileName });
      
          revalidatePath('/admin/other-works')
      
        } catch (error) {
          throw new Error(`${error.message}`);
        }
      }