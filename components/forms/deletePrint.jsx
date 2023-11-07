"use client"

import { TrashIcon } from "lucide-react"
import toast from "react-hot-toast"
import { usePathname } from "next/navigation"
import { deletePrint } from "@/lib/actions/print.action";


const DeletePrint = ({id}) => {
      const pathname = usePathname();
    const deleteHandler = async (id) => {

        try {
          const confirmation = window.confirm('Do you want to delete the list?');
          // Start the form submission
          if (confirmation) {
            await deletePrint({
              id,
              path: pathname
            });
            toast.success('Print list deleted successfully')
          }
    
        } catch (error) {
    
          // Handle other errors
          toast.error(error.message);
    
        }
      }
  return (
    <TrashIcon className="cursor-pointer" size={18} onClick={() => deleteHandler(id)} />
  )
}

export default DeletePrint