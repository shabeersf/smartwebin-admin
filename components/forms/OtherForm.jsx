"use client"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {  otherValidation } from "@/constants/categoryValidation"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Pen } from "lucide-react"
import { usePathname } from "next/navigation"
import { Card } from "../ui/card"
import toast from "react-hot-toast"
import Image from "next/image"
import { Textarea } from "../ui/textarea"
import { createOther } from "@/lib/actions/other.action"

const OtherForm = () => {
    const [cardShow, setcardShow] = useState(false)
    const [file, setFile] = useState()
    const [files, setFiles] = useState([]);
    const pathname = usePathname();

    const form = useForm({
        resolver: zodResolver(otherValidation),
        defaultValues: {
            title: "",
        }
    })


    let isLoading = form.formState.isSubmitting;

    const onSubmit = async (values) => {
        // console.log(file)
        const formData = new FormData(); // Create a FormData object
        const formDatas = new FormData(); // Create a FormData object
        for (let i = 0; i < files.length; i++) {
            formDatas.append("images[]", files[i]);
          }
        formData.append('image', file);
        try {
            // Start the form submission
            await createOther({
                title: values.title,
                path: pathname,
                cover_img: formData,
                images: formDatas,
            });
            toast.success('Other Work created successfully')
            form.reset()
            setFile(null)
            setFiles(null)
        } catch (error) {

            // Handle other errors
            toast.error(error.message);

        }
         finally {
            // Finish the form submission, whether it succeeds or fails
            isLoading = false
        }
    };
    const handleFileChange = (e) => {
        const selectedFiles = e.target.files;
        const filesArray = Array.from(selectedFiles);
        setFiles(filesArray);

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
                                name="cover_img"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-6 col-span-12 py-2">
                                        <FormLabel>Cover Image</FormLabel>
                                        <FormControl className="m-0 p-0">
                                            <Input type="file" className=" w-full border shadow-sm p-2 outline-none focus-visible:ring-0 focus-visible:ring-transparent" disabled={isLoading}
                                                placeholder="Cover Image" accept="image/png, image/jpg, image/jpeg" required={true} {...field} onChange={(e) => setFile(e.target.files?.[0])} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="images"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-6 col-span-12 py-2">
                                        <FormLabel>Images (ctrl + select for multiple images)</FormLabel>
                                        <FormControl className="m-0 p-0">
                                            <Input type="file" accept="image/png, image/jpg, image/jpeg" className=" w-full border shadow-sm p-2 outline-none focus-visible:ring-0 focus-visible:ring-transparent" disabled={isLoading}
                                                placeholder="Images" multiple required={true} {...field} onChange={handleFileChange} />
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
                                            alt={'image'}
                                            className='w-100 h-100 object-contain bg-no-repeat'
                                        />
                                    </div>
                                )
                            }

                            {
                                files && (
                                    <div className="col-span-12 grid grid-cols-12">
                                        {
                                            files.map((selectedFile, index) => (
                                                <div className="  h-[100px] w-[100px] relative">
                                                    <Image key={index}
                                                        src={URL.createObjectURL(selectedFile)}
                                                        fill
                                                        alt={'images'}
                                                        className='w-100 h-100 object-contain bg-no-repeat'
                                                    />
                                                </div>

                                            ))
                                        }

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

export default OtherForm