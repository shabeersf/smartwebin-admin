"use client"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { mobileValidation, portfolioValidation } from "@/constants/categoryValidation"
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
import { updateMobile } from "@/lib/actions/mobile.action"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const MobileEditForm = ({ id, result }) => {

    const [selectedImage, setSelectedImage] = useState(null);
    const [files, setFiles] = useState(null);


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
        resolver: zodResolver(mobileValidation),
        defaultValues: {
            title: result.title,
            appstore: result.appstore,
            playstore: result.playstore,
            description: result.description,
            type: result.type,
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
        let formDatas;
        if (files === null) {
            formDatas = null
        }
        else {
            formDatas = new FormData()
            for (let i = 0; i < files.length; i++) {
                formDatas.append("images[]", files[i]);
            }
        }

        try {

            await updateMobile({
                id,
                title: values.title,
                appstore: values.appstore,
                playstore: values.playstore,
                description: values.description,
                type: values.type,
                logo: formData,
                images: formDatas,
            });
            toast.success('Mobile list updated successfully')
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
                                name="appstore"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-6 col-span-12 py-2">
                                        <FormLabel>Appstore Link</FormLabel>
                                        <FormControl className="m-0 p-0">
                                            <Input type="text" className=" w-full border shadow-sm p-2 outline-none focus-visible:ring-0 focus-visible:ring-transparent" disabled={isLoading}
                                                placeholder="Appstore Link" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="playstore"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-6 col-span-12 py-2">
                                        <FormLabel>Playstore Link</FormLabel>
                                        <FormControl className="m-0 p-0">
                                            <Input type="text" className=" w-full border shadow-sm p-2 outline-none focus-visible:ring-0 focus-visible:ring-transparent" disabled={isLoading}
                                                placeholder="Playstore Link" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="type"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-6 col-span-12 py-2">
                                        <FormLabel>Type</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Android">Android</SelectItem>
                                                <SelectItem value="iOS">iOS</SelectItem>
                                                <SelectItem value="Both">Both</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="logo"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-6 col-span-12 py-2">
                                        <FormLabel>Logo</FormLabel>
                                        <FormControl className="m-0 p-0">
                                            <Input type="file" className=" w-full border shadow-sm p-2 outline-none focus-visible:ring-0 focus-visible:ring-transparent" disabled={isLoading}
                                                placeholder="Logo" accept="image/png, image/jpg, image/jpeg" {...field} onChange={handleImageChange} />
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
                                                placeholder="Images" multiple  {...field} onChange={handleFileChange} />
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
                                            src={`/assets/images/${result.logo}`}
                                            fill
                                            alt={result.title}
                                            className='w-100 h-100 object-cover bg-no-repeat'
                                        />
                                    </div>
                                )
                            }

                            {
                                result.images && (
                                    <div className="col-span-12 grid grid-cols-12 mb-2">
                                        {
                                            result.images.map((item, index) => (
                                                <div className="  h-[100px] w-[100px] relative">
                                                    <Image key={index}
                                                        src={`/assets/images/${item}`}
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

export default MobileEditForm