"use client"

import { useEffect, useState } from "react";
import OtherEditForm from "@/components/forms/OtherEditForm";
import { fetchOther } from "@/lib/actions/other.action";
import LoadingUi from "@/components/LoadingUi";



const OtherEditPage = ({ params }) => {
  const [result, setResult] = useState(null);
  const id = params.id;



  useEffect(() => {
    async function fetchOtherById() {
      try {
        const data = await fetchOther(id);
       
        setResult(data);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchOtherById();
  }, []);

  return (
    <div className="px-2 lg:px-4">
      
      {
        result ? (
          <OtherEditForm id={id} pageNo={params.page} result={result}  />
          ) : (
            <LoadingUi />
          )
        }
    </div>
  )
}

export default OtherEditPage