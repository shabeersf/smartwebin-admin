"use client"


import { TrashIcon } from "lucide-react"
import toast from "react-hot-toast"
import { usePathname } from "next/navigation"
import { deletePortfolio } from "@/lib/actions/portfolio.action";


const DeletePortfolio = ({id}) => {
 
      const pathname = usePathname();
    const deleteHandler = async (id) => {

        try {
          const confirmation = window.confirm('Do you want to delete the Website?');
          // Start the form submission
          if (confirmation) {
            await deletePortfolio({
              id,
              path: pathname
            });
            toast.success('Website List deleted successfully')
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

export default DeletePortfolio