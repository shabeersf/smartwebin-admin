"use client"


import { TrashIcon } from "lucide-react"
import toast from "react-hot-toast"
import { usePathname } from "next/navigation"
import { deleteBlog } from "@/lib/actions/blog.action"


const DeleteBlog = ({id}) => {
 
      const pathname = usePathname();
    const deleteHandler = async (id) => {

        try {
          const confirmation = window.confirm('Do you want to delete the List?');
          // Start the form submission
          if (confirmation) {
            await deleteBlog({
              id,
              path: pathname
            });
            toast.success('Blog List deleted successfully')
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

export default DeleteBlog