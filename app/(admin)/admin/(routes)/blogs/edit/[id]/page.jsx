"use client"

import { useEffect, useState } from "react";
import BlogEditForm from "@/components/forms/BlogEditForm";
import { fetchBlog } from "@/lib/actions/blog.action";
import LoadingUi from "@/components/LoadingUi";




const BlogEditPage = ({ params }) => {
  const [result, setResult] = useState(null);
  const id = params.id;



  useEffect(() => {
    async function fetchBlogById() {
      try {
        const data = await fetchBlog(id);

        setResult(data);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchBlogById();
  }, []);

  return (
    <div className="px-2 lg:px-4">

      {
        result ? (
          <BlogEditForm id={id} pageNo={params.page} result={result} />
        ) : (
          <LoadingUi />
        )
      }
    </div>
  )
}

export default BlogEditPage