"use client"


import { TrashIcon } from "lucide-react"
import toast from "react-hot-toast"
import { usePathname } from "next/navigation"
import { deleteMobile } from "@/lib/actions/mobile.action"


const DeleteMobile = ({id}) => {
 
      const pathname = usePathname();
    const deleteHandler = async (id) => {

        try {
          const confirmation = window.confirm('Do you want to delete the List?');
          // Start the form submission
          if (confirmation) {
            await deleteMobile({
              id,
              path: pathname
            });
            toast.success('Mobile List deleted successfully')
          }
    
        } catch (error) {
    
          // Handle other errors
          toast.error(error.message);
    
        }
      }
  return (
    <TrashIcon className="cursor-pointer"  size={18} onClick={() => deleteHandler(id)} />
  )
}

export default DeleteMobile