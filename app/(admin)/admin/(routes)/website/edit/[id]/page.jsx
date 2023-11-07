"use client"

import { fetchPortfolio, fetchcatList } from "@/lib/actions/portfolio.action"
import { useEffect, useState } from "react";
import PortfolioEditForm from "@/components/forms/PortfolioEditForm";
import LoadingUi from "@/components/LoadingUi";



const Page = ({ params }) => {
  const [result, setResult] = useState(null);
  const [catList, setCatList] = useState(null);
  const id = params.id;



  useEffect(() => {
    async function fetchPortfolioById() {
      try {
        const data = await fetchPortfolio(id);
        const catListed = await fetchcatList()
        setResult(data);
        setCatList(catListed);

      } catch (error) {
        console.error('Error fetching website data:', error);
      }
    }
    fetchPortfolioById();
  }, []);

  return (
    <div className="px-2 lg:px-4">
      {
        result  ? (
          <PortfolioEditForm id={id} pageNo={params.page} result={result} catList={catList} />
          ) : (
            <LoadingUi />
          )
        }
    </div>
  )
}

export default Page