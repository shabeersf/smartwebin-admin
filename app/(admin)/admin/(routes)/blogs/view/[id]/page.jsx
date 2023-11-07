"use client"
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card'
import { fetchBlog } from '@/lib/actions/blog.action';
import { ChevronLeftIcon, TrashIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

const ViewPage = ({ params }) => {
    const [result, setResult] = useState(null);
    const id = params.id;
    const router = useRouter()



    useEffect(() => {
        async function fetchPortfolioById() {
            try {
                const data = await fetchBlog(id);
                setResult(data);

            } catch (error) {
                console.error('Error fetching category data:', error);
            }
        }
        fetchPortfolioById();
    }, []);


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
                        Blog List Information
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
                                        <span className=' font-bold ' >Date : </span>
                                        <span>{new Date(result.date).toLocaleDateString("en-GB")}</span>
                                    </div>
                                </div>
                                <div className=' col-span-12  md:col-span-6  p-3 text-sm '>
                                    <div>
                                        <span className=' font-bold ' >Image : </span>
                                    </div>
                                    <div className=' relative w-[100px] h-[100px]'>
                                        <Image src={`/assets/images/${result.image}`} fill className='object-cover' />
                                    </div>
                                </div>
                                <div className=' col-span-12   p-3 text-sm '>
                                    <div>
                                        <span className=' font-bold ' >Description : </span>
                                        <span>{result.description}</span>
                                    </div>
                                </div>
                                

                            </div>
                        )
                    }
                </Card>
            </div>
        </>
    )
}

export default ViewPage