"use client"

import { useEffect, useState } from "react";
import MobileEditForm from "@/components/forms/MobileEditForm";
import { fetchMobile } from "@/lib/actions/mobile.action";
import LoadingUi from "@/components/LoadingUi";



const MobileEditPage = ({ params }) => {
  const [result, setResult] = useState(null);
  const id = params.id;



  useEffect(() => {
    async function fetchMobileById() {
      try {
        const data = await fetchMobile(id);
       
        setResult(data);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchMobileById();
  }, []);

  return (
    <div className="px-2 lg:px-4">
      
      {
        result ? (
          <MobileEditForm id={id} pageNo={params.page} result={result}  />
          ) : (
            <LoadingUi />
          )
        }
    </div>
  )
}

export default MobileEditPage