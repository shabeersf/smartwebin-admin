"use client"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { blogValidation, portfolioValidation } from "@/constants/categoryValidation"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { usePathname, useRouter } from "next/navigation"
import { Card } from "../ui/card"
import toast from "react-hot-toast"
import Image from "next/image"
import { useState } from "react"
import { Textarea } from "../ui/textarea"
import { updateBlog } from "@/lib/actions/blog.action"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

const BlogEditForm = ({ id, result }) => {

    const [selectedImage, setSelectedImage] = useState(null);
    const [files, setFiles] = useState(null);
    const [date, setDate] = useState()

    const router = useRouter();

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setSelectedImage(file);
        }
    };

    const pathname = usePathname();
    const handleFileChange = (e) => {
        const selectedFiles = e.target.files;
        const filesArray = Array.from(selectedFiles);
        setFiles(filesArray);

    };

    const form = useForm({
        resolver: zodResolver(blogValidation),
        defaultValues: {
            title: result.title,
            date: result.date,
            description: result.description,
            path: pathname,
        }
    })


    let isLoading = form.formState.isSubmitting;


    const onSubmit = async (values) => {
        // console.log(values)
        let formData;
        if (selectedImage === null) {
            formData = null
        }
        else {
            formData = new FormData()
            formData.append('image', selectedImage);
        }
       

        try {

            await updateBlog({
                id,
                title: values.title,
                date: values.date,
                description: values.description,
                image: formData,
            });
            toast.success('Blog updated successfully')
            form.reset()
        } catch (error) {

            // Handle other errors
            toast.error(error.message);

        }
        finally {
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
                                name="date"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-6 col-span-12 py-2">
                                        <FormLabel>Date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl  className="m-0 p-0">
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            " w-full border shadow-sm p-2 outline-none focus-visible:ring-0 focus-visible:ring-transparent",
                                                            !date && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(field.value, "PPP")
                                                        ) : (
                                                            <span>Pick a date</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) =>
                                                        date > new Date() || date < new Date("1900-01-01")
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
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
                                                placeholder="Image" accept="image/png, image/jpg, image/jpeg" {...field} onChange={handleImageChange} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                                                        <FormField
                                name="description"
                                render={({ field }) => (
                                    <FormItem className=" col-span-12 py-2">
                                        <FormLabel>Description</FormLabel>
                                        <FormControl className="m-0 p-0">
                                            <Textarea placeholder="Description" className=" w-full border shadow-sm p-2 outline-none focus-visible:ring-0 focus-visible:ring-transparent" disabled={isLoading}
                                                required={true} {...field} />

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

export default BlogEditForm