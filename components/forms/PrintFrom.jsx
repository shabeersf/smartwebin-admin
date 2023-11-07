"use client"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {  printValidation } from "@/constants/categoryValidation"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {  useState } from "react"
import { cn } from "@/lib/utils"
import { Pen } from "lucide-react"
import { usePathname } from "next/navigation"
import { Card } from "../ui/card"
import toast from "react-hot-toast"
import Image from "next/image"
import { createPrint } from "@/lib/actions/print.action"

const PrintForm = () => {
    const [cardShow, setcardShow] = useState(false)
    const [file, setFile] = useState()
    const pathname = usePathname();

    const form = useForm({
        resolver: zodResolver(printValidation),
        defaultValues: {
            title: "",
        }
    })


    let isLoading = form.formState.isSubmitting;

    const onSubmit = async (values) => {
        // console.log(file)
        const formData = new FormData(); // Create a FormData object

        formData.append('image', file);
        try {
            // Start the form submission
            await createPrint({
                title: values.title,
                path: pathname,
                image: formData,
            });
            toast.success('Print list created successfully')
            form.reset()
            setFile(null)
        } catch (error) {

            // Handle other errors
            toast.error(error.message);

        }
         finally {
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
                        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-3 grid grid-cols-12 gap-2 " encType="multipart/form-data">
                            <FormField
                                name="title"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-6 col-span-12 py-2">
                                        <FormLabel>Title</FormLabel>
                                        <FormControl className="m-0 p-0">
                                            <Input type="text" className=" w-full border shadow-sm p-2 outline-none focus-visible:ring-0 focus-visible:ring-transparent" disabled={isLoading}
                                                placeholder="Title" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="image"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-6 col-span-12 py-2">
                                        <FormLabel>Image</FormLabel>
                                        <FormControl className="m-0 p-0">
                                            <Input type="file" className=" w-full border shadow-sm p-2 outline-none focus-visible:ring-0 focus-visible:ring-transparent" disabled={isLoading}
                                                placeholder="Image" required={true} {...field} onChange={(e) => setFile(e.target.files?.[0])} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            
                            {
                                file && (
                                    <div className="col-span-12 grid grid-cols-12 h-[100px] w-[100px] relative">
                                        <Image
                                            src={URL.createObjectURL(file)}
                                            fill
                                            alt={'logo'}
                                            className='w-100 h-100 object-cover bg-no-repeat'
                                        />
                                    </div>
                                )
                            }
                            <div className="col-span-12 grid grid-cols-12">
                                <Button className="md:col-span-2 col-span-5 w-full" disabled={isLoading}>
                                    Save
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </Card>
        </>
    )
}

export default PrintForm