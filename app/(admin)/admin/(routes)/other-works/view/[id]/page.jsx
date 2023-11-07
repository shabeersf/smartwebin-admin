"use client"
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card'
import { deleteMultiImage, fetchOther } from '@/lib/actions/other.action';
import { ChevronLeftIcon, TrashIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

const ViewPage = ({ params }) => {
    const [result, setResult] = useState(null);
    const id = params.id;
    const router = useRouter()

    const deleteHandler = async (id, image) => {

        try {
            const confirmation = window.confirm('Do you want to delete this Image?');
            // Start the form submission
            if (confirmation) {
                await deleteMultiImage({
                    id,
                    image,
                });
                toast.success('Image deleted successfully')
            }

        } catch (error) {

            // Handle other errors
            toast.error(error.message);

        }
    }

    useEffect(() => {
        async function fetchPortfolioById() {
            try {
                const data = await fetchOther(id);
                setResult(data);

            } catch (error) {
                console.error('Error fetching category data:', error);
            }
        }
        fetchPortfolioById();
    }, [deleteHandler]);


    return (
        <>
            <div className="w-full flex items-center justify-end mt-4 gap-3 ">
                <Button className="bg-green-500 flex gap-1 items-center mr-3" onClick={() => router.back()} >
                    <ChevronLeftIcon className="text-white" size={16} />  <span>Back</span>
                </Button>

            </div>
            <div className="px-2 lg:px-4">
                <Card className="p-3 shadow-lg mt-4">
                    <h5 className="font-semibold py-4 border-b border-muted">
                        Other Works List Information
                    </h5>

                    {
                        result && (
                            <div className=' mt-5 grid grid-cols-12 p-2 gap-3 md:gap-2'>
                                <div className=' col-span-12  md:col-span-6  p-3 text-sm '>
                                    <div>
                                        <span className=' font-bold ' >Title : </span>
                                        <span>{result.title}</span>
                                    </div>
                                </div>
                                
                                <div className=' col-span-12  md:col-span-6  p-3 text-sm '>
                                    <div>
                                    <span className=' font-bold ' >Cover Image : </span><br/>
                                    </div>
                                    <div className=' relative w-[100px] h-[100px]'>
                                        <Image src={`/assets/images/${result.cover_img}`} fill className='object-cover' />
                                    </div>
                                </div>
                                <div className=' col-span-12  p-3 text-sm '>
                                    <span className=' font-bold ' >Images : </span>
                                </div>
                                {
                                    result.images.map((item, index) => (
                                        <div key={index} className=' col-span-12  md:col-span-6  p-3 text-sm '>
                                            <div className=' relative w-[200px] h-[200px]'>
                                                <Image src={`/assets/images/${item}`} quality={100} fill className=' object-contain bg-no-repeat' />
                                            </div>
                                            <div className="w-1/2 flex justify-center items-center mt-4">
                                                <div className='w-fit bg-red-600 p-2 rounded-md cursor-pointer' onClick={() => deleteHandler(result._id, item)}>
                                                    <TrashIcon size={18} className='text-white' />
                                                </div>

                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        )
                    }
                </Card>
            </div>
        </>
    )
}

export default ViewPage