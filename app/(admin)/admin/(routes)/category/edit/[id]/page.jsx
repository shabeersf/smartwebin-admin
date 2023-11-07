"use client"

import { fetchCategory } from "@/lib/actions/category.action"
import { useEffect, useState } from "react";
import CategoryEditForm from "@/components/forms/CategoryEditForm";
import LoadingUi from "@/components/LoadingUi";



const Page = ({ params }) => {
  const [result, setResult] = useState(null);
  const id = params.id;

  useEffect(() => {
    async function fetchCategoryById() {
      try {
        const data = await fetchCategory(id);
        setResult(data);

      } catch (error) {
        console.error('Error fetching category data:', error);
      }
    }
    fetchCategoryById();
  }, []);

  return (
    <div className="px-2 lg:px-4">
      {
        result ? (
          <CategoryEditForm id={id} result={result} />
          ) : (
            <LoadingUi />
          )
        }
    </div>
  )
}

export default Page