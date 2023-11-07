"use server";

import { revalidatePath } from "next/cache";
import { connectToDB } from "../mongoose";
import Category from "@/components/models/category.model";
import Portfolio from "@/components/models/portfolio.model";
import User from "@/components/models/user.model";
import bcrypt from "bcryptjs"

export async function createCategory({ title, path }
) {
  try {
    connectToDB();
    const isCategoryExist = await Category.findOne({ title })
    console.log(isCategoryExist)
    if (isCategoryExist) {
      throw new Error('Category already exists');
    }

    const createdCategory = new Category({
      title
    });

    await createdCategory.save()

    revalidatePath(path);
  } catch (error) {
    throw new Error(`${error.message}`);
  }
}

export async function fetchCategoryList({ searchString = "",
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

    // Create an initial query object to filter category.
    const query = {
      title: { $ne: "" }
    }


    // If the search string is not empty, add the $or operator to match either username or name fields.
    if (searchString.trim() !== "") {
      query.$or = [
        { title: { $regex: regex } },
      ];
    }

    // Define the sort options for the fetched category based on createdAt field and provided sort order.
    const sortOptions = { createdAt: sortBy };

    const categoryQuery = Category.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    // Count the total number of category that match the search criteria (without pagination).
    const totalcategoryCount = await Category.countDocuments(query);

    const category = await categoryQuery.exec();

    // Check if there are more category beyond the current page.
    const isNext = totalcategoryCount > skipAmount + category.length;

    return { category, isNext };
  } catch (error) {
    throw new Error(`${error.message}`);
  }
}

export async function fetchCategory(id) {
  try {
    connectToDB();

    const categoryFetch = await Category.findOne({ _id: id })
    if (!categoryFetch) {
      throw new Error(`No data exist on this id`);
    }
    return categoryFetch;
  } catch (error) {
    throw new Error(`${error.message}`);
  }
}

export async function deleteCategory({ id, path }
) {
  try {
    connectToDB();
    const isCategoryExist = await Category.findOne({ _id: id })
    console.log(isCategoryExist)
    if (isCategoryExist) {
      const isPortfolioExist = await Portfolio.find({ category: id })
      if (isPortfolioExist) {
        await Portfolio.deleteMany({ category: id })
      }
      await Category.deleteOne({ _id: id })
    }
    else {
      throw new Error(`No category exist`);
    }

    revalidatePath(path);
  } catch (error) {
    throw new Error(`${error.message}`);
  }
}

export async function updateCategory({ id, title }
) {
  try {
    await connectToDB()

    const isCategoryExist = await Category.findOne({ _id: { $ne: id }, title: title });

    if (isCategoryExist) {
      throw new Error('Category already exists');
    }
    await Category.findOneAndUpdate({ _id: id }, { title: title });

    revalidatePath('/admin/category')
  } catch (error) {
    throw new Error(`${error.message}`);
  }
}

export async function resetPassword({password,old_pass }
) {
  try {
    await connectToDB()
    const name = "admin";
    const user = await User.findOne({ name });
    if (!user) {
      throw new Error('No user exist with username admin');
    }
    const passMatch = await bcrypt.compare(old_pass, user.password);
    if (!passMatch) {
      throw new Error('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(password,10)

    await User.findOneAndUpdate({ _id: user._id }, { password: hashedPassword });

    revalidatePath('/admin/reset-password')
  } catch (error) {
    throw new Error(`${error.message}`);
  }
}