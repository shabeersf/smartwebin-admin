"use client"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { categoryValidation } from "@/constants/categoryValidation"
import { createCategory } from "@/lib/actions/category.action"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Pen } from "lucide-react"
import { usePathname } from "next/navigation"
import { Card } from "../ui/card"
import toast from "react-hot-toast"

const CategoryForm = () => {
  const [cardShow, setcardShow] = useState(false)

  const pathname = usePathname();

  const form = useForm({
    resolver: zodResolver(categoryValidation),
    defaultValues: {
      title: ""
    }
  })


  let isLoading = form.formState.isSubmitting;

  const onSubmit = async (values) => {

    try {
      // Start the form submission
      await createCategory({
        title: values.title,
        path: pathname
      });
      toast.success('Category created successfully')
      form.reset()
    } catch (error) {

      // Handle other errors
      toast.error(error.message);

    } finally {
      // Finish the form submission, whether it succeeds or fails
      isLoading = false
    }
  };

  return (
    <>
      <div className="w-full flex items-center justify-end mt-4 gap-3">
        <Button className="bg-red-500 flex gap-1 items-center" onClick={() => setcardShow(!cardShow)}>
          <Pen className="text-white" size={16} />  <span>New</span>
        </Button>

      </div>
      <Card className={cn("p-3 mt-4 shadow-lg", cardShow ? "" : "hidden")}>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-3 grid grid-cols-12 gap-2 ">
              <FormField
                name="title"
                render={({ field }) => (
                  <FormItem className=" col-span-12 py-2">
                    <FormControl className="m-0 p-0">
                      <Input type="text" className=" w-full border shadow-sm p-2 outline-none focus-visible:ring-0 focus-visible:ring-transparent" disabled={isLoading}
                        placeholder="Title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="md:col-span-2 col-span-5 w-full" disabled={isLoading}>
                Save
              </Button>
            </form>
          </Form>
        </div>
      </Card>
    </>
  )
}

export default CategoryForm