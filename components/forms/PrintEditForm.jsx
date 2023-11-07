"use client"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { usePathname, useRouter } from "next/navigation"
import { Card } from "../ui/card"
import toast from "react-hot-toast"
import Image from "next/image"
import { useState } from "react"
import { printValidation } from "@/constants/categoryValidation"
import { updatePrint } from "@/lib/actions/print.action"

const PrintEditForm = ({id, result,pageNo }) => {

    const [selectedImage, setSelectedImage] = useState(null);

console.log(pageNo)
    const router = useRouter();

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setSelectedImage(file);
        }
    };

    const pathname = usePathname();


    const form = useForm({
        resolver: zodResolver(printValidation),
        defaultValues: {
            title: result.title,
        }
    })


    let isLoading = form.formState.isSubmitting;

    const onSubmit = async (values) => {
        
        let formData;
        if (selectedImage===null) {
            formData = null
        }
        else{
            formData = new FormData()
            formData.append('image', selectedImage);
        }
       
        try {
            // Start the form submission
            await updatePrint({
                id,
                title: values.title,
                path: pathname,
                image: formData,
            });
            toast.success('Print list updated successfully')
            form.reset()
        } catch (error) {

            // Handle other errors
            toast.error(error.message);

        } finally {
            // Finish the form submission, whether it succeeds or fails
            isLoading = false
            router.back()
        }
    };

    return (
        <>
            <div className="w-full flex items-center justify-end mt-4 gap-3">


            </div>
            <Card className={"p-3 mt-4 shadow-lg"}>
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
                                                placeholder="Image" {...field} onChange={handleImageChange} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            
                            {
                                selectedImage ? (
                                    <div className="col-span-12 grid grid-cols-12 h-[100px] w-[100px] relative">
                                        <Image
                                            src={URL.createObjectURL(selectedImage)}
                                            fill
                                            alt={result.title}
                                            className='w-100 h-100 object-cover bg-no-repeat'
                                        />
                                    </div>
                                ) : (
                                    <div className="col-span-12 grid grid-cols-12 h-[100px] w-[100px] relative">
                                        <Image
                                            src={`/assets/images/${result.image}`}
                                            fill
                                            alt={result.title}
                                            className='w-100 h-100 object-cover bg-no-repeat'
                                        />
                                    </div>
                                )
                            }
                            <div className="col-span-12 grid grid-cols-12">
                                <Button className="md:col-span-2 col-span-5 w-full" disabled={isLoading}>
                                    Update
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </Card>
        </>
    )
}

export default PrintEditForm