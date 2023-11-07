"use client"

import LoadingUi from "@/components/LoadingUi";
import PrintEditForm from "@/components/forms/PrintEditForm";
import { fetchPrint } from "@/lib/actions/print.action";
import { useEffect, useState } from "react";



const Page = ({ params }) => {
  const [result, setResult] = useState(null);
  const id = params.id;



  useEffect(() => {
    async function fetchPrintById() {
      try {
        const data = await fetchPrint(id);
        setResult(data);

      } catch (error) {
        console.error('Error fetching print data:', error);
      }
    }
    fetchPrintById();
  }, []);

  return (
    <div className="px-2 lg:px-4">
      {
        result  ? (
          <PrintEditForm id={id} pageNo={params.page} result={result} />
          ) : (
            <LoadingUi />
          )
        }
    </div>
  )
}

export default Page