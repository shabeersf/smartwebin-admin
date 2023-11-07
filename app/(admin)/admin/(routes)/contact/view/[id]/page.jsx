"use client"
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card'
import { fetchContact } from '@/lib/actions/contact.action';
import { ChevronLeftIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

import React, { useEffect, useState } from 'react'

const ContactViewPage = ({ params }) => {
    const [result, setResult] = useState(null);
    const id = params.id;
    const router = useRouter()

    

    useEffect(() => {
        async function fetchContactById() {
            try {
                const data = await fetchContact(id);
                setResult(data);

            } catch (error) {
                console.error('Error fetching  data:', error);
            }
        }
        fetchContactById();
    },[]);


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
                        Mobile List Information
                    </h5>

                    {
                        result && (
                            <div className=' mt-5 grid grid-cols-12 p-2 gap-3 md:gap-2'>
                                <div className=' col-span-12  md:col-span-6  p-3 text-sm '>
                                    <div>
                                        <span className=' font-bold ' >Name : </span>
                                        <span>{result.fname} {result.lname}</span>
                                    </div>
                                </div>
                                <div className=' col-span-12  md:col-span-6  p-3 text-sm '>
                                    <div>
                                        <span className=' font-bold ' >Email : </span>
                                        <span>{result.email}</span>
                                    </div>
                                </div>
                                <div className=' col-span-12  md:col-span-6  p-3 text-sm '>
                                    <div>
                                        <span className=' font-bold ' >Phone: </span>
                                        <span>{result.phone}</span>
                                    </div>
                                </div>
                                <div className=' col-span-12  md:col-span-6  p-3 text-sm '>
                                    <div>
                                        <span className=' font-bold ' >Subject: </span>
                                        <span>{result.subject}</span>
                                    </div>
                                </div>
                               
                                <div className=' col-span-12   p-3 text-sm '>
                                    <div>
                                        <span className=' font-bold ' >Message : </span>
                                        <span>{result.message}</span>
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

export default ContactViewPage