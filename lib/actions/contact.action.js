"use server";

import { revalidatePath } from "next/cache";
import { connectToDB } from "../mongoose";
import Contact from "@/components/models/contact.model";





export async function fetchContactList({searchString="",
pageNumber,
pageSize,
sortBy = "desc"},
  ) {
  try {
    connectToDB();
    const skipAmount = (pageNumber - 1) * pageSize;
    searchString = String(searchString).trim();

    // Create a case-insensitive regular expression for the provided search string.
    const regex = new RegExp(searchString, "i");

    // Create an initial query object to filter contact.
    const query = {
      fname: { $ne: ""}
    }


    // If the search string is not empty, add the $or operator to match either username or name fields.
    if (searchString.trim() !== "") {
      query.$or = [
        { fname: { $regex: regex } },
        { lname: { $regex: regex } },
      ];
    }

    // Define the sort options for the fetched contact based on createdAt field and provided sort order.
    const sortOptions = { createdAt: sortBy };

    const contactQuery = Contact.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    // Count the total number of contact that match the search criteria (without pagination).
    const totalcontactCount = await Contact.countDocuments(query);

    const contact = await contactQuery.exec();

    // Check if there are more contact beyond the current page.
    const isNext = totalcontactCount > skipAmount + contact.length;

    return { contact, isNext };
  } catch (error) {
    throw new Error(`${error.message}`);
  }
}



export async function deleteContact({ id, path }
) {
    try {
        connectToDB();
        const isContactExist = await Contact.findOne({ _id: id })
        console.log(isContactExist)
        if (isContactExist) {
            await Contact.deleteOne({ _id: id })
        }
        else {
            throw new Error(`No contact exist`);
        }

        revalidatePath(path);
    } catch (error) {
        throw new Error(`${error.message}`);
    }
}



export async function fetchContact(id) {
  try {
    connectToDB();

    const contactFetch = await Contact.findOne({ _id: id })
    if (!contactFetch) {
      throw new Error(`No data exist on this id`);
    }
    return contactFetch;
  } catch (error) {
    throw new Error(`${error.message}`);
  }
}