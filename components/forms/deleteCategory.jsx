"use client"

import { deleteCategory } from "@/lib/actions/category.action";
import { TrashIcon } from "lucide-react"
import toast from "react-hot-toast"
import { usePathname } from "next/navigation"


const DeleteCategory = ({item}) => {
      const pathname = usePathname();
    const deleteHandler = async (id) => {

        try {
          const confirmation = window.confirm('Do you want to delete the category?');
          // Start the form submission
          if (confirmation) {
            await deleteCategory({
              id,
              path: pathname
            });
            toast.success('Category deleted successfully')
          }
    
        } catch (error) {
    
          // Handle other errors
          toast.error(error.message);
    
        }
      }
  return (
    <TrashIcon className="cursor-pointer"  size={18} onClick={() => deleteHandler(item._id)} />
  )
}

export default DeleteCategory